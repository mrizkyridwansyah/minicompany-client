import React, { useRef, useState, useEffect } from 'react'
import { Form,Col, Button, Alert } from 'react-bootstrap'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useRoot } from '../../RootContext'

export default function Forms() {
    let URI_API = `${process.env.REACT_APP_SSO_URI_API}/user/`
    let method = "POST"
    const { type, id } = useParams()
    const [loading, setLoading] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const [error, setError] = useState("")    
    const [currentName, setCurrentName] = useState("")
    const [currentEmail, setCurrentEmail] = useState("")
    const [currentUsername, setCurrentUsername] = useState("")
    const [currentRole, setCurrentRole] = useState("")
    const [roles, setRoles] = useState([])
    const nameRef = useRef()
    const emailRef = useRef()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const roleRef = useRef()
    const history = useHistory()
    const { fetchQuery, logout } = useRoot()

    useEffect(() => {
        getRoles()

        if(type === "edit") {
            setError("")
            setLoading(true)
            const query = {
                query : `query {
                    user (id: "${id}") { id, name, username, email, role }
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
                    setCurrentName(data.body.data.user.name)
                    setCurrentRole(data.body.data.user.role)
                    setCurrentUsername(data.body.data.user.username)
                    setCurrentEmail(data.body.data.user.email)
                    setError("")
                }            
            })
            setLoading(false)
        }
    }, [])

    function getRoles() {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                roles { id, name }
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
                setRoles(data.body.data.roles)
                setError("")
            }            
        })
        setLoading(false)
    }

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const query = {
            username: usernameRef.current.value,
            name: nameRef.current.value,
            email: emailRef.current.value,
            role: roleRef.current.value
        }
        
        if(passwordRef.current.value !== "" && confirmPasswordRef.current.value !== "") {
            query.password = passwordRef.current.value
            query.confirmPassword = confirmPasswordRef.current.value
        }

        if(type === "edit") {
            URI_API = `${URI_API}${id}`
            method = "PUT"
        }

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
                history.push("/user")
            }
        })

        setLoading(false)
    }


    return (
        <>
            <h3>{ type.charAt(0).toUpperCase() + type.slice(1) } User</h3>
            { error && <Alert variant="danger">{error}</Alert>}
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Col md="6">
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} defaultValue={currentName} autoFocus={true} disabled={loading} required={true} />
                    </Form.Group>                
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} defaultValue={currentEmail} disabled={loading} required={true} />
                    </Form.Group>                
                    <Form.Row>       
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" ref={usernameRef} defaultValue={currentUsername} disabled={loading} required={true} />
                            </Form.Group>                
                        </Col>       
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Role</Form.Label>
                                <Form.Control as="select" ref={roleRef} disabled={loading} value={currentRole} onChange={ e => setCurrentRole(e.target.value)}>
                                    <option value="" hidden>Select Role</option>
                                    {
                                        roles.map(role => {
                                            return <option key={role.id} value={role.name}>{role.name}</option>
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>                
                        </Col>      
                    </Form.Row>
                    <Form.Row>       
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} disabled={loading} />
                            </Form.Group>                
                        </Col>       
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Confirmation Password</Form.Label>
                                <Form.Control type="password" ref={confirmPasswordRef} disabled={loading} />
                            </Form.Group>                
                        </Col>      
                    </Form.Row>
                    <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                    { !loading && <Link to="/user" className="btn btn-danger" disabled={loading}>Cancel</Link>}                    
                </Col>
            </Form>
        </>
    )
}
