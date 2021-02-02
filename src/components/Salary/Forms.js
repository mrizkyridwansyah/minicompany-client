import React, { useRef, useState, useEffect } from 'react'
import { Form,Col, Button, Alert } from 'react-bootstrap'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useRoot } from '../../RootContext'

export default function Forms() {
    const { type, id, idemployee } = useParams()
    let URI_API = `${process.env.REACT_APP_HRIS_URI_API}/employee/salary/`
    let method = "POST"
    const [loading, setLoading] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const [error, setError] = useState("")    
    const [currentAmount, setCurrentAmount] = useState()
    const amountRef = useRef()
    const history = useHistory()
    const { fetchQuery, logout } = useRoot()

    useEffect(() => {
        if(type === "edit") {
            setError("")
            setLoading(true)
            const query = {
                query : `query {
                    employeeSalary (id: "${id}") { id, amount }
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
                    setCurrentAmount(data.body.data.employeeSalary.amount)
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
            amount: amountRef.current.value, 
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
                history.push(`/salary/${idemployee}`)
            }
        })

        setLoading(false)
    }


    return (
        <>
            <h3>{ type.charAt(0).toUpperCase() + type.slice(1) } Salary</h3>
            { error && <Alert variant="danger">{error}</Alert>}
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Col md="4">
                    <Form.Group>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" min="0" ref={amountRef} disabled={loading} defaultValue={currentAmount} required={true}></Form.Control>
                    </Form.Group>
                    <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                    { !loading && <Link to={`/salary/${idemployee}`} className="btn btn-danger" disabled={loading}>Cancel</Link>}                    
                </Col>
            </Form>
        </>
    )
}
