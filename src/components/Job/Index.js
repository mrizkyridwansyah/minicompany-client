import React, { useState, useEffect, useRef } from 'react'
import { Form, Col, Button, Card, Alert } from 'react-bootstrap' 
import { Link, useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'

export default function Index() {
    const URI_API = `${process.env.REACT_APP_REQRUITMENT_URI_API}/job`
    const [jobs, setJobs] = useState([])
    const [hasChanged, setHasChanged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { fetchQuery, logout } = useRoot()
    const keywordRef = useRef()
    const statusRef = useRef()
    const history = useHistory()

    async function getJobs(search = "") {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                jobs ${search} { id, title, desc, requirement, type, minRate, maxRate, publishedFlag, closedFlag, createAt }
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
                setJobs(data.body.data.jobs)
                setError("")
            }            
        })
        setLoading(false)
    }

    function handleSearch(e) {
        e.preventDefault()

        let statusSearch = ""
        if(statusRef.current.value === "published") statusSearch += ", published: true"
        if(statusRef.current.value === "closed") statusSearch += ", closed: true"
        let search = `(keyword: "${keywordRef.current.value}" ${statusSearch})`

        getJobs(search)
    }

    function handleClose(e) {
        e.preventDefault()
        if(window.confirm(`Are you sure want to close this job?`)) {
            const id = e.target.dataset.id
            console.log(id)
            handleUpdate("close", id)
        }

    }

    function handlePublish(e) {
        e.preventDefault()
        if(window.confirm(`Are you sure want to publish this job?`)) {
            const id = e.target.dataset.id
            handleUpdate("publish", id)
        }
    }

    function handleUpdate(type, id) {
        setLoading(true)
        setError("")
        fetchQuery(`${URI_API}/${type}/${id}`, {}, true, "PUT").then(async(data) => {
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

    useEffect(() => {
        getJobs()
    }, [hasChanged])

    return (
        <>
            <h3>
                { window.location.pathname === "/job" ? "Jobs" 
                : window.location.pathname === "/qna" ? "Question & Answer" 
                : window.location.pathname === "/applications" ? "Job Applications" 
                : "" }
            </h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                {
                    window.location.pathname === "/job" &&
                    <Link to="/job/add" className="btn btn-primary">Add New Job</Link>
                }
                <Form className="mt-4" onSubmit={handleSearch}>
                    <Form.Row>
                        <Col md="5">
                            <Form.Group>
                                <Form.Control type="text" ref={keywordRef} onChange={handleSearch} disabled={loading} placeholder="Search by Name"></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group>
                                <Form.Control as="select" ref={statusRef} onChange={handleSearch} >
                                    <option value="">All Status</option>
                                    <option value="closed">Closed</option>
                                    <option value="published">Published</option>
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
                        jobs.length > 0 ? 
                            jobs.map(job => {
                                return <List key={job.id} job={job} handleClose={handleClose} handlePublish={handlePublish}></List>
                            }) 
                        : 
                        <div className="mt-4 text-weight text-muted col-md-6 text-center">
                            <span>No Data</span>
                        </div>
                    }
            </div>
        </>
    )
}
