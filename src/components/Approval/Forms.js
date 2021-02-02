import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Col, Row, Alert, Badge } from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useRoot } from '../../RootContext'


export default function Forms() {
    const { type, id } = useParams()
    let URI_API = `${process.env.REACT_APP_HRIS_URI_API}/approval/${id}`
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [approvalNeeded, setApprovalNeeded] = useState(false)
    const [currentType, setCurrentType] = useState("")
    const [currentAmount, setCurrentAmount] = useState(0)
    const [currentActivity, setCurrentActivity] = useState({})
    const { fetchQuery, logout } = useRoot()
    const history = useHistory()
    const typeRef = useRef()
    const fromRef = useRef()
    const untilRef = useRef()
    const notesRef = useRef()
    const amountRef = useRef()

    function handleSubmit(e) {
        e.preventDefault()
        const action = e.nativeEvent.submitter.id
        if(window.confirm(`Are you sure want to ${action} this data?`)){
            setError("")
            setLoading(true) 

            let query = {
                userId: typeRef.current.value,
                approvedFlag: action === "approve",
                notes: notesRef.current.value
            }

            fetchQuery(URI_API, query, true, "POST").then(async(result) => {
                console.log(result)
                if(result.status !== 200) {
                    if(result.status === 403) {
                        await logout()
                        history.push("/login")
                    } 
                    setError(result.body.message)
                } else {
                    setError("")
                    history.push("/approval")
                }
            })
    
            setLoading(false)
        }
    }

    function getCurrentActivity(){
        setError("")
        setLoading(true)

        const query = {
            query : `query {
                approval (id: "${id}") {
                    id,
                    activity { id, type, name, status, notes, dateFrom, dateUntil
                        reimburse { id, amount, status, file }
                    }
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
                setCurrentAmount(data.body.data.approval.activity.reimburse[0].amount)
                setCurrentType(data.body.data.approval.activity.type)
                setCurrentActivity(data.body.data.approval.activity)
                setApprovalNeeded(data.body.data.approval.activity.type === "Business Trip" || data.body.data.approval.activity.type === "Overtime")
                setError("")
            }            
        })
        setLoading(false)
    }

    useEffect(() => {
        getCurrentActivity()
    }, [])

    return (
        <>
            <h3>Detail Activity</h3>
            { error && <Alert variant="danger">{error}</Alert>} 
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Col md="8">
                    <Form.Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Type</Form.Label>
                                <Form.Control as="select" ref={typeRef} value={currentType} disabled={true} >
                                    <option value="" hidden>Select Type</option>
                                    <option value="Business Trip">Business Trip</option>
                                    <option value="Overtime">Overtime</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            {
                                approvalNeeded && 
                                <Form.Group>
                                    <Form.Label>Amount (Rp.)</Form.Label>
                                    <Form.Control type="number" min="0" ref={amountRef} defaultValue={currentAmount} disabled={true}></Form.Control>
                                </Form.Group>
                            }
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Date From</Form.Label>
                                <Form.Control type="date" ref={fromRef} disabled={true} defaultValue={Object.keys(currentActivity).length > 0 ? currentActivity.dateFrom : ""}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Date Until</Form.Label>
                                <Form.Control type="date" ref={untilRef} disabled={true} defaultValue={Object.keys(currentActivity).length > 0 ? currentActivity.dateUntil : ""}></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Group>
                        <Form.Label>Notes Activity</Form.Label>
                        <Form.Control as="textarea" disabled={true} defaultValue={Object.keys(currentActivity).length > 0 ? currentActivity.notes : ""}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Notes Approval</Form.Label>
                        <Form.Control as="textarea" ref={notesRef} required={true} disabled={loading}></Form.Control>
                    </Form.Group>
                    {
                        type !== "add" && Object.keys(currentActivity).length > 0 &&
                        <>
                            <a href={currentActivity.reimburse[0].file && currentActivity.reimburse[0].file !== null ? currentActivity.reimburse[0].file : "#" } download={currentActivity.reimburse[0].file && currentActivity.reimburse[0].file !== null ? `Attachment Reimburse ${currentActivity.notes} (${currentActivity.name.replace(".", " ")})` : null }>
                                <i className="fa fa-download fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Download Attachment</span>
                            </a>
                            <br />
                            <br />
                        </>
                    }
                    <Button type="submit" id="approve" className="mr-2" disabled={loading}>Approve</Button>
                    <Button type="submit" id="reject" variant="danger" className="mr-2" disabled={loading}>Reject</Button>
                    { <Link to="/activity" className="btn btn-danger">Cancel</Link>}                    
                </Col>
            </Form>
        </>
    )
}
