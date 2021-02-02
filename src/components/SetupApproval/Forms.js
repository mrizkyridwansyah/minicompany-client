import React, { useRef, useState, useEffect } from 'react'
import { Form,Col, Button, Alert, Modal, Card } from 'react-bootstrap'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from '../User/List'

export default function Forms() {
    let URI_API = `${process.env.REACT_APP_HRIS_URI_API}/approval/setup`
    let method = "POST"
    const { type, id } = useParams()
    const [loading, setLoading] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const [error, setError] = useState("")    
    const [currentUser, setCurrentUser] = useState("")
    const [currentLevel, setCurrentLevel] = useState()
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState([])
    const [levels, setLevels] = useState([])
    const levelRef = useRef()
    const userRef = useRef()
    const keywordRef = useRef()
    const history = useHistory()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
      const { fetchQuery, logout } = useRoot()

    function handleSearch(e) {
        e.preventDefault()
        let search = `(search: "${keywordRef.current.value}", active: true)`
        getUsers(search)
    }

    function handleChoose(e) {
        const id = e.target.dataset.id
        handleClose()
        setCurrentUser(id)
    }

    useEffect(() => {
        getLevels()
        getUsers()

        if(type === "edit") {
            setError("")
            setLoading(true)
            const query = {
                query : `query {
                    approvalReference (id: "${id}") {id, userId, level }  
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
                    setCurrentUser(data.body.data.approvalReference.userId)
                    setCurrentLevel(data.body.data.approvalReference.level)
                    setError("")
                }            
            })
            setLoading(false)
        }
    }, [])

    async function getLevels() {
        setError("")
        const query = {
            query : `query { levels }`
        }
        fetchQuery(process.env.REACT_APP_HRIS_URI_GRAPHQL, query, true, "POST").then(async(data) => {            
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setLevels(data.body.data.levels)
                setError("")
            }            
        })
    }

    async function getUsers(search = "(active: true)") {
        setError("")
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
    }

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")

        let query = {
            userId: userRef.current.value,
            level: levelRef.current.value
        }
        
        if(type === "edit") {
            query = { level: levelRef.current.value }
            URI_API = `${URI_API}/${id}`
            method = "PUT"
        }
        console.log(method)
        fetchQuery(URI_API, query, true, method).then(async(data) => {
            console.log(data)
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setHasChanged(!hasChanged)
                setError("")
                history.push("/setupapproval")
            }
        })

        setLoading(false)
    }


    return (
        <>
            <h3>{ type.charAt(0).toUpperCase() + type.slice(1) } User</h3>
            { error && <Alert variant="danger">{error}</Alert>}
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Col md="8">
                    <Form.Row>       
                        <Col md="7">
                            <Form.Group>
                                <Form.Label>User</Form.Label>
                                <Form.Control as="select" ref={userRef} disabled={loading || type === "edit"} value={currentUser} onChange={ e => setCurrentUser(e.target.value)}>
                                    <option value="" hidden>Select User</option>
                                    {
                                        users.map(user => {
                                            return <option key={user.id} value={user.id}>{user.name} - {user.username}</option>
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>                
                        </Col>       
                        <Col md="1">
                            <Form.Group>
                                <Form.Label>&nbsp;</Form.Label>
                                <Button className="mb-0 fa fa-search form-control" onClick={handleShow}></Button>
                            </Form.Group>
                        </Col>       
                        <Col md="3">
                            <Form.Group>
                                <Form.Label>Level</Form.Label>
                                <Form.Control as="select" ref={levelRef} disabled={loading} value={currentLevel} onChange={ e => setCurrentLevel(e.target.value)}>
                                    <option value="" hidden>Select Level</option>
                                    {
                                        levels.map((level, index) => {
                                            return <option key={level} value={index+1}>{index+1}</option>
                                        })
                                    }
                                    <option value={levels.length + 1}>{levels.length + 1}</option>                                    
                                </Form.Control>
                            </Form.Group>                
                        </Col>      
                    </Form.Row>
                    <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                    { !loading && <Link to="/setupapproval" className="btn btn-danger" disabled={loading}>Cancel</Link>}                    
                </Col>
            </Form>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Search User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form className="mt-4" onSubmit={handleSearch}>
                    <Form.Row>
                        <Col md="5">
                            <Form.Group>
                                <Form.Control type="text" ref={keywordRef} onChange={handleSearch} disabled={loading} placeholder="Search by Name"></Form.Control>
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
                                    return <List key={user.username} user={user} handleChoose={handleChoose}></List>
                                }) 
                            }
                        </Card>
                        : 
                        <div className="mt-4 text-weight text-muted col-md-6 text-center">
                            <span>No Data</span>
                        </div>
                    }                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
