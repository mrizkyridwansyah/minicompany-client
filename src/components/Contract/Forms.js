import React, { useRef, useState, useEffect } from 'react'
import { Form,Col, Button, Alert } from 'react-bootstrap'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useRoot } from '../../RootContext'

export default function Forms() {
    const { type, id, idemployee } = useParams()
    let URI_API = `${process.env.REACT_APP_HRIS_URI_API}/employee/contract/`
    let method = "POST"
    const [loading, setLoading] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const [error, setError] = useState("")    
    const [currentDateFrom, setCurrentDateFrom] = useState("")
    const [currentDateUntil, setCurrentDateUntil] = useState("")
    const nameRef = useRef()
    const fromRef = useRef()
    const untilRef = useRef()
    const history = useHistory()
    const { fetchQuery, logout } = useRoot()

    useEffect(() => {
        if(type === "edit") {
            setError("")
            setLoading(true)
            const query = {
                query : `query {
                    employeeContract (id: "${id}") { id, dateFrom, dateUntil }
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
                    setCurrentDateFrom(data.body.data.employeeContract.dateFrom)
                    setCurrentDateUntil(data.body.data.employeeContract.dateUntil)
                    setError("")
                }            
            })
            setLoading(false)
        }
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const query = { 
            dateFrom: fromRef.current.value, 
            dateUntil: untilRef.current.value,
            createBy: sessionStorage.getItem("id"),
            updateBy: sessionStorage.getItem("id")
        }
        
        URI_API = type === "edit" ? `${URI_API}${id}` : `${URI_API}${idemployee}`
        if(type === "edit") method = "PUT"

        fetchQuery(URI_API, query, true, method).then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setHasChanged(!hasChanged)
                setError("")
                history.push(`/contract/${idemployee}`)
            }
        })

        setLoading(false)
    }


    return (
        <>
            <h3>{ type.charAt(0).toUpperCase() + type.slice(1) } Contract</h3>
            { error && <Alert variant="danger">{error}</Alert>}
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Col md="5">
                    <Form.Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Date From</Form.Label>
                                <Form.Control type="date" ref={fromRef} disabled={loading} defaultValue={currentDateFrom} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Date Until</Form.Label>
                                <Form.Control type="date" ref={untilRef} disabled={loading} defaultValue={currentDateUntil} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                    { !loading && <Link to={`/contract/${idemployee}`} className="btn btn-danger" disabled={loading}>Cancel</Link>}                    
                </Col>
            </Form>
        </>
    )
}
