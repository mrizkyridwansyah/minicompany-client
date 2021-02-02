import React, { useState, useEffect, useRef } from 'react'
import { Form, Col, Button, Card, Alert } from 'react-bootstrap' 
import { Link, useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'


export default function Index() {
    const URI_API = `${process.env.REACT_APP_HRIS_URI_API}/activity/`
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [hasChanged, setHasChanged] = useState(false)
    const [activities, setActivities] = useState([])
    const { fetchQuery, logout } = useRoot()
    const keywordRef = useRef()
    const statusRef = useRef()
    const typeRef = useRef()
    const history = useHistory()

    function handleSearch(e) {
        e.preventDefault()
        let status = (statusRef.current.value !== "") ? `, status: "${statusRef.current.value}"`: ""
        let type = (typeRef.current.value !== "") ? `, type: "${typeRef.current.value}"`: ""
        let employeeId = sessionStorage.getItem("role") !== "Sys-Master" ? `, id: "${sessionStorage.getItem("employeeId")}"` : ""
        let search = `(keyword: "${keywordRef.current.value}"${status}${type}${employeeId})`

        getActivities(search)
    }

    function handleDelete(e) {
        e.preventDefault()
        setError("")
        setLoading(true)
        if(window.confirm("Are you sure want to delete this activity")){
            const id = e.target.dataset.id
            fetchQuery(`${URI_API}/${id}`, {}, true, "DELETE").then(async(data) => {
                if(data.status !== 200) {
                    if(data.status === 403) {
                        await logout()
                        history.push("/login")
                    } 
                    setError(data.body.message)
                } else {
                    setHasChanged(!hasChanged)
                    setError("")
                }            
            })
            setLoading(false)            
        }
        else {
            setLoading(false)
        }
    }

    async function getActivities(search = "") {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                employeeActivities ${search} { id, employeeId, employee { id }, name, type, status, notes, createAt }
            }`
        }

        fetchQuery(process.env.REACT_APP_HRIS_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            console.log(data)
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setActivities(data.body.data.employeeActivities)
                setError("")
            }            
        })
        setLoading(false)
    }

    useEffect(() => {
        if(sessionStorage.getItem("role") === "Sys-Master") {
            getActivities()
        } else {
            getActivities(`(id: "${sessionStorage.getItem("employeeId")}")`)
        }
    }, [hasChanged])

    return (
        <>
            <h3>Activities</h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <Link className="btn btn-primary" to={`/activity/add`}>Add New Activity</Link>
                <Form className="mt-4" onSubmit={handleSearch}>
                    <Form.Row>
                        <Col md="4">
                            <Form.Group>
                                <Form.Control type="text" ref={keywordRef} onChange={handleSearch} disabled={loading} placeholder="Search by Name" ></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="3">
                            <Form.Group>
                                <Form.Control as="select" ref={statusRef} onChange={handleSearch} >
                                    <option value="">All Status</option>
                                    <option value="New">New</option>
                                    <option value="On Progress">On Progress</option>
                                    <option value="Done">Done</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="3">
                            <Form.Group>
                                <Form.Control as="select" ref={typeRef} onChange={handleSearch} >
                                    <option value="">All Type</option>
                                    <option value="Permission">Permission</option>
                                    <option value="Sick">Sick</option>
                                    <option value="Paid Leave">Paid Leave</option>
                                    <option value="Business Trip">Business Trip</option>
                                    <option value="Overtime">Overtime</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group>
                                <Button variant="success" type="submit" disabled={loading}>Search</Button>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                </Form>
                    {                        
                        activities && activities.length > 0 ? 
                        <Card style={{ width: '50em' }} className="mt-4">
                            { 
                                activities.map(activity => {
                                    return <List key={activity.id} activity={activity} handleDelete={handleDelete} ></List>
                                }) 
                            }
                        </Card>
                        : 
                        <div className="mt-4 text-weight text-muted col-md-6 text-center">
                            <span>No Data</span>
                        </div>
                    }
            </div>
        </>
    )
}
