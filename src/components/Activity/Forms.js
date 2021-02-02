import { until } from 'async'
import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Col, Row, Alert, Badge } from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import History from '../Approval/History'


export default function Forms() {
    let URI_API = `${process.env.REACT_APP_HRIS_URI_API}/activity/`
    let method = "POST"
    const { type, id } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [files, setFiles] = useState([])
    const [approvalNeeded, setApprovalNeeded] = useState(false)
    const [currentType, setCurrentType] = useState("")
    const [currentAmount, setCurrentAmount] = useState(0)
    const [currentActivity, setCurrentActivity] = useState({})
    const { fetchQuery, logout } = useRoot()
    const history = useHistory()
    const typeRef = useRef()
    const fileRef = useRef()
    const fromRef = useRef()
    const untilRef = useRef()
    const notesRef = useRef()
    const amountRef = useRef()

    function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true) 

        let newActivity = {
            type: typeRef.current.value,
            dateFrom: fromRef.current.value,
            dateUntil: untilRef.current.value,
            notes: notesRef.current.value
        }

        if(files.length > 0) newActivity.file = files[0]
        if(amountRef.current) newActivity.amount = amountRef.current.value

        URI_API = type !== "add" ? `${URI_API}${id}` : `${URI_API}${sessionStorage.getItem("employeeId")}`
        if(type === "edit") method = "PUT"

        fetchQuery(URI_API, newActivity, true, method).then(async(result) => {
            if(result.status !== 200) {
                if(result.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(result.body.message)
            } else {
                setError("")
                history.push("/activity")
            }
        })

        setLoading(false)
    }

    function handleType(e) {
        setCurrentType(e.target.value)        
        setApprovalNeeded(typeRef.current.value === "Business Trip" || typeRef.current.value === "Overtime")
    }

    function handleUpload(e) {
        e.preventDefault()

        const id = e.target.id
        let fileReader = new FileReader()
        let selectedFile = e.target.files[0]

        fileReader.onload = () => {
            setFiles([...files, { type: selectedFile.type, id: id, data: fileReader.result }])
        }

        fileReader.readAsDataURL(selectedFile)
    }

    function getCurrentActivity(){
        setError("")
        setLoading(true)

        const query = {
            query : `query {
                employeeActivity (id: "${id}") { id, type, name, status, notes, dateFrom, dateUntil
                    reimburse { id, amount, status, file }
                }
            }`
        }

        fetchQuery(process.env.REACT_APP_HRIS_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                if(data.body.data.employeeActivity.reimburse[0]){
                    setCurrentAmount(data.body.data.employeeActivity.reimburse[0].amount)
                }
                setCurrentType(data.body.data.employeeActivity.type)
                setCurrentActivity(data.body.data.employeeActivity)
                setApprovalNeeded(data.body.data.employeeActivity.type === "Business Trip" || data.body.data.employeeActivity.type === "Overtime")
                setError("")
            }            
        })
        setLoading(type === "detail")
    }

    useEffect(() => {
        if(type !== "add") getCurrentActivity()
    }, [])

    return (
        <>
            <h3>{ type.charAt(0).toUpperCase() + type.slice(1) } Activity</h3>
            { error && <Alert variant="danger">{error}</Alert>} 
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Col md="8">
                    <Form.Row>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>Type</Form.Label>
                                <Form.Control as="select" ref={typeRef} value={currentType} required={true} onChange={handleType} disabled={loading} >
                                    <option value="" hidden>Select Type</option>
                                    <option value="Permission">Permission</option>
                                    <option value="Sick">Sick</option>
                                    <option value="Paid Leave">Paid Leave</option>
                                    <option value="Business Trip">Business Trip</option>
                                    <option value="Overtime">Overtime</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="4">
                            {
                                approvalNeeded && 
                                <Form.Group>
                                    <Form.Label>Amount (Rp.)</Form.Label>
                                    <Form.Control type="number" min="0" ref={amountRef} required={true} defaultValue={currentAmount} disabled={loading}></Form.Control>
                                </Form.Group>
                            }
                        </Col>
                        <Col md="4">
                            {
                                approvalNeeded && !loading &&
                                <Form.Group>
                                    <Form.Label>Attachment</Form.Label>
                                    <input type="file" id="file-upload" ref={fileRef} accept={[".jpg", ".jpeg", ".png"]} onChange={handleUpload} />
                                </Form.Group>
                            }
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Date From</Form.Label>
                                <Form.Control type="date" ref={fromRef} disabled={loading} defaultValue={Object.keys(currentActivity).length > 0 ? currentActivity.dateFrom : ""} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Date Until</Form.Label>
                                <Form.Control type="date" ref={untilRef} disabled={loading} defaultValue={Object.keys(currentActivity).length > 0 ? currentActivity.dateUntil : ""} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Group>
                        <Form.Label>Notes</Form.Label>
                        <Form.Control as="textarea" ref={notesRef} disabled={loading} defaultValue={Object.keys(currentActivity).length > 0 ? currentActivity.notes : ""} required={true}></Form.Control>
                    </Form.Group>
                    {
                        type !== "add" && Object.keys(currentActivity).length > 0 &&
                        currentActivity.reimburse.length > 0 &&
                        <>
                            <a href={currentActivity.reimburse[0].file && currentActivity.reimburse[0].file !== null ? currentActivity.reimburse[0].file : "#" } download={currentActivity.reimburse[0].file && currentActivity.reimburse[0].file !== null ? `Attachment Reimburse ${currentActivity.notes} (${currentActivity.name.replace(".", " ")})` : null }>
                                <i className="fa fa-download fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Download Attachment</span>
                            </a>
                            <br />
                            <br />
                        </>
                    }
                    {
                        type === "detail" &&
                        <History activityId={id}></History>
                    }
                    { type !== "detail" &&
                        <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                    }
                    { <Link to="/activity" className="btn btn-danger" disabled={loading}>Cancel</Link>}                    
                </Col>
            </Form>
        </>
    )
}
