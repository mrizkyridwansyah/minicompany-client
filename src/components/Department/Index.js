import React, { useRef, useState, useEffect } from 'react'
import { Form, Col, Button, Card, Alert } from 'react-bootstrap' 
import { Link, useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'

export default function Index() {
    const URI_API = `${process.env.REACT_APP_HRIS_URI_API}/department`
    const keywordRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [departments, setDepartments] = useState([])
    const { fetchQuery, logout } = useRoot()
    const history = useHistory()

    function handleSearch(e) {
        e.preventDefault()

        let search = `(keyword: "${keywordRef.current.value}")`
        getDepartment(search)
    }

    function handleDelete(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
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
                    window.location.reload()
                    setError("")
                }            
            })
            setLoading(false)
        } else {
            setLoading(false)
        }
    }
    
    function getDepartment(search = "") {
        setLoading(true)
        setError("")
        const query = {
            query : `query { departments ${search} { id, name } }`
        }
        fetchQuery(process.env.REACT_APP_HRIS_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setDepartments(data.body.data.departments)
                setError("")
            }            
        })
        setLoading(false)
    }

    useEffect(() => {
        getDepartment()
    }, [])
    return (
        <>
            <h3>Department</h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <Link to="/department/add" className="btn btn-primary">Add New Department</Link>
                <Form className="mt-4" onSubmit={handleSearch}>
                    <Form.Row>
                        <Col md="5">
                            <Form.Group>
                                <Form.Control type="text" ref={keywordRef} onChange={handleSearch} disabled={loading} placeholder="Search by Name"></Form.Control>
                            </Form.Group>
                        </Col>
                        <Form.Group>
                            <Button variant="success" type="submit" disabled={loading}>Search</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
                {
                        departments.length > 0 ?
                        <Card style={{ width: "30em"}} className="mt-4">
                            {
                                departments.map(department => {
                                    return <List key={department.id} department={department} handleDelete={handleDelete}></List>
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
