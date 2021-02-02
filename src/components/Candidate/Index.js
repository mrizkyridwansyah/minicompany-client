import React, { useState, useEffect, useRef } from 'react'
import { Form, Col, Button, Card, Alert } from 'react-bootstrap' 
import { Link, useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'

export default function Index() {
    const URI_API = "http://localhost:2000/api/candidate"
    const [candidates, setCandidates] = useState([])
    const [hasChanged, setHasChanged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { fetchQuery, logout } = useRoot()
    const keywordRef = useRef()
    const statusRef = useRef()
    const history = useHistory()

    async function getCandidates(search = "") {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                candidates ${search} { id, email, name, status }
            }`
        }

        fetchQuery(process.env.REACT_APP_REQRUITMENT_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setCandidates(data.body.data.candidates)
                setError("")
            }            
        })
        setLoading(false)
    }

    function handleSearch(e) {
        e.preventDefault()
        let active = (statusRef.current.value !== "") ? `, active: ${statusRef.current.value}`: ""
        let search = `(search: "${keywordRef.current.value}"${active})`
        getCandidates(search)
    }

    function handleDelete(e) {
        e.preventDefault()
        if(window.confirm("Are you sure want to delete this data?")) {
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
    }

    function handleUpdateStatus(e) {
        e.preventDefault()
        const status = e.target.dataset.status === "true"
        let action = status ? "block" : "activate"
        if(window.confirm(`Are you sure want to ${action} this candidate?`)) {
            setLoading(true)
            setError("")
            const id = e.target.dataset.id
            fetchQuery(`${URI_API}/updatestatus/${id}`, {}, true, "PUT").then(async(data) => {
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
    }

    useEffect(() => {
        getCandidates()
    }, [hasChanged])

    return (
        <>
            <h3>Candidate</h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <Form className="mt-4" onSubmit={handleSearch}>
                    <Form.Row>
                        <Col md="5">
                            <Form.Group>
                                <Form.Control type="text" ref={keywordRef} onChange={handleSearch} disabled={loading} placeholder="Search by Identity Number, Email or Name"></Form.Control>
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
                        candidates.length > 0 ? 
                        <Card style={{ width: '40em' }} className="mt-4">
                            { 
                                candidates.map(candidate => {
                                    if(candidate.id !== sessionStorage.getItem("id")) {
                                        return <List key={candidate.id} candidate={candidate} handleDelete={handleDelete} handleUpdateStatus={handleUpdateStatus}></List>
                                    }
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
