import React, { useRef, useState, useEffect } from 'react'
import { Form,Col, Button, Alert } from 'react-bootstrap'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useRoot } from '../../RootContext'

export default function Forms() {
    let URI_API = `${process.env.REACT_APP_SSO_URI_API}/app/`
    let method = "POST"
    const { type, id } = useParams()
    const [loading, setLoading] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const [error, setError] = useState("")    
    const [currentName, setCurrentName] = useState("")
    const [currentDesc, setCurrentDesc] = useState("")
    const nameRef = useRef()
    const descRef = useRef()
    const history = useHistory()
    const { fetchQuery, logout } = useRoot()

    useEffect(() => {
        if(type === "edit") {
            setError("")
            setLoading(true)
            const query = {
                query : `query {
                    app (id: "${id}") { id, name, desc }
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
                    setCurrentName(data.body.data.app.name)
                    setCurrentDesc(data.body.data.app.desc)
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
            name: nameRef.current.value,
            desc: descRef.current.value
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
                history.push("/application")
            }
        })

        setLoading(false)
    }


    return (
        <>
            <h3>{ type.charAt(0).toUpperCase() + type.slice(1) } Application</h3>
            { error && <Alert variant="danger">{error}</Alert>}
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Col md="5">
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} defaultValue={currentName} autoFocus={true} disabled={loading} required={true} />
                    </Form.Group>                
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" ref={descRef} defaultValue={currentDesc} rows={3} disabled={loading} required={true} />
                    </Form.Group>
                    <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                    { !loading && <Link to="/application" className="btn btn-danger" disabled={loading}>Cancel</Link>}                    
                </Col>
            </Form>
        </>
    )
}
