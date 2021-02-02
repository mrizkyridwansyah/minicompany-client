import React, { useState, useEffect, useRef } from 'react'
import { Form, Col, Button, Card, Alert } from 'react-bootstrap' 
import { Link, useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'

export default function Index() {
    const URI_API = `${process.env.REACT_APP_SSO_URI_API}/user`
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [hasChanged, setHasChanged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { fetchQuery, logout } = useRoot()
    const keywordRef = useRef()
    const statusRef = useRef()
    const roleRef = useRef()
    const history = useHistory()

    async function getRoles(search = "") {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                roles ${search} { id, name }
            }`
        }

        fetchQuery(process.env.REACT_APP_SSO_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            console.log(data)
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setRoles(data.body.data.roles)
                setError("")
            }            
        })
        setLoading(false)
    }

    async function getUsers(search = "") {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                users ${search} { id, username, name, email, role, activeFlag }
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
                setUsers(data.body.data.users)
                setError("")
            }            
        })
        setLoading(false)
    }

    function handleSearch(e) {
        e.preventDefault()
        let active = (statusRef.current.value !== "") ? `, active: ${statusRef.current.value}`: ""
        let role = (roleRef.current.value !== "") ? `, role: "${roleRef.current.value}"`: ""
        let search = `(search: "${keywordRef.current.value}"${active}${role})`
        getUsers(search)
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
        if(window.confirm(`Are you sure want to ${action} this user?`)) {
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
        getUsers()
        getRoles()
    }, [hasChanged])

    return (
        <>
            <h3>Users</h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <Link to="/user/add" className="btn btn-primary">Add New User</Link>
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
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group>
                                <Form.Control as="select" ref={roleRef} onChange={handleSearch} >
                                    <option value="">All Role</option>
                                    {
                                        roles.map(role => {
                                            return <option value={role.name}>{role.name}</option>                                            
                                        })
                                    }
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
                        users.length > 0 ? 
                        <Card style={{ width: '40em' }} className="mt-4">
                            { 
                                users.map(user => {
                                    if(user.id !== sessionStorage.getItem("id")) {
                                        return <List key={user.id} user={user} handleDelete={handleDelete} handleUpdateStatus={handleUpdateStatus}></List>
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
