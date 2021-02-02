import React, { useState, useEffect, useRef } from 'react'
import { Form, Col, Button, Card, Alert } from 'react-bootstrap' 
import { Link, useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'

export default function Index() {
    const URI_API = `${process.env.REACT_APP_SSO_URI_API}/app`
    const [applications, setApplications] = useState([])
    const [hasChanged, setHasChanged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { fetchQuery, logout } = useRoot()
    const keywordRef = useRef()
    const history = useHistory()

    async function getApplications(search = "") {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                apps ${search} { id, name, desc }
            }`
        }

        fetchQuery(process.env.REACT_APP_SSO_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
            setError(data.body.message)
            } else {
                setApplications(data.body.data.apps)
                setError("")
            }            
        })
        setLoading(false)
    }

    async function handleSearch(e) {
        e.preventDefault()
        let search = `(search: "${keywordRef.current.value}")`
        getApplications(search)
    }

    async function handleDelete(e) {
        e.preventDefault()
        if(window.confirm("Are you sure want to delete this data?")) {
            setLoading(true)
            setError("")
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

    useEffect(() => {
        getApplications()
    }, [hasChanged])

    return (
        <>
            <h3>Application</h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <Link to="/application/add" className="btn btn-primary">Add New Application</Link>
                    <Form className="mt-4">
                        <Form.Row onSubmit={handleSearch}>
                            <Col md="6">
                                <Form.Group>
                                    <Form.Control type="text" ref={keywordRef} placeholder="Search by Name" onChange={handleSearch} disabled={loading}></Form.Control>
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
                        applications.length > 0 ?
                        <Card style={{ width: "30em"}} className="mt-4">
                            {
                                applications.map(app => {
                                    return <List key={app.id} app={app} handleDelete={handleDelete}></List>
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
