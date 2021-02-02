import React, { useState, useRef, useEffect } from 'react'
import { Form, Col, Button, Row, Card, Alert } from 'react-bootstrap'
import { Link, useHistory, useParams} from 'react-router-dom'
import { useRoot } from '../../RootContext'
import ListMenu from './ListMenu'

export default function Menu() {
    let URI_API = `${process.env.REACT_APP_SSO_URI_API}/menu/`
    let method = "POST"
    const [menus, setMenus] = useState([])
    const [parentMenus, setParentMenus] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [hasChanged, setHasChanged] = useState(false)
    const [currentApplication, setCurrentApplication] = useState("")
    const [currentIdMenu, setCurrentIdMenu] = useState("")
    const [currentName, setCurrentName] = useState("")
    const [currentEntry, setCurrentEntry] = useState("")
    const [currentLogo, setCurrentLogo] = useState("")
    const [currentParent, setCurrentParent] = useState("")
    const nameRef = useRef()
    const entryRef = useRef()
    const logoRef = useRef()
    const parentRef = useRef()
    const history = useHistory()
    const { id } = useParams()
    const { fetchQuery, logout } = useRoot()

    function getMenu() {
        setError("")
        setLoading(true)
        const query= {
            query: `query{
                app(id: "${id}") { id, name },
                menus(idApp: "${id}") { id, name, app, entryPoint, logo, parent }              
            }`
        }
        fetchQuery(process.env.REACT_APP_SSO_URI_GRAPHQL, query, true, method).then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setCurrentApplication(data.body.data.app.name)
                setMenus(data.body.data.menus)
                setError("")
            }            
        })
        
        setLoading(false)
    }

    function getParentMenu() {
        setError("")
        setLoading(true)
        const query= {
            query: `query{
                menus(idApp: "${id}", parent: true) { id, name, app, entryPoint, logo, parent }              
            }`
        }

        fetchQuery(process.env.REACT_APP_SSO_URI_GRAPHQL, query, true, method).then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setParentMenus(data.body.data.menus)
                setError("")
            }            
        })
        
        setLoading(false)
    }

    function getSingleMenu(idMenu) {
        setError("")
        setLoading(true)
        const query= {
            query: `query{
                menu(id: "${idMenu}") { id, name, app, entryPoint, logo, parent }              
            }`
        }

        fetchQuery(process.env.REACT_APP_SSO_URI_GRAPHQL, query, true, method).then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setCurrentIdMenu(data.body.data.menu.id)
                setCurrentName(data.body.data.menu.name)
                setCurrentEntry(data.body.data.menu.entryPoint)
                setCurrentLogo(data.body.data.menu.logo)
                setCurrentParent(data.body.data.menu.parent)
                setError("")
            }            
        })
        
        setLoading(false)
    }

    function handleEdit(e){
        setEditMode(true)
        const id = e.target.dataset.id
        getSingleMenu(id)
    }

    function handleDelete(e) {
        if(window.confirm("Are you sure want delete this menu?")) {
            setLoading(true)
            setError("")
            const idMenu = e.target.dataset.id
            fetchQuery(`${URI_API}${idMenu}`, {}, true, "DELETE").then(async(data) => {
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
            setEditMode(false)
            setLoading(false)
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const query = {
            name: nameRef.current.value,
            entryPoint: entryRef.current.value
        }

        if(parentRef.current.value !== "-") query.parent = parentRef.current.value
        if(logoRef.current.value !== "") query.logo = logoRef.current.value

        if(editMode) {
            URI_API = `${URI_API}${currentIdMenu}`
            method = "PUT"
        } else {            
            query.application = id
        }
        fetchQuery(URI_API, query, true, method).then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setError("")
                window.location.reload();
            }
        })
        setEditMode(false)
        setLoading(false)
    }

    useEffect(() => {
        getMenu()
        getParentMenu()
    }, [hasChanged])

    return (
        <>
            <h3 className="mb-4">Setup Menu { currentApplication }</h3>
            {error && <Alert variant="danger">{error}</Alert>} 
            <Row>
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Col md="8">
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" ref={nameRef} autoFocus={true} disabled={loading} required={true} defaultValue={currentName} />
                            </Form.Group>
                        </Col>
                        <Col md="8">
                            <Form.Row>
                                <Col md="6">
                                    <Form.Group>
                                        <Form.Label>Entry Point</Form.Label>
                                        <Form.Control type="text" ref={entryRef} disabled={loading} required={true} defaultValue={currentEntry} />
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group>
                                        <Form.Label>Logo</Form.Label>
                                        <Form.Control type="text" ref={logoRef} disabled={loading} defaultValue={currentLogo} />
                                    </Form.Group>
                                </Col>
                            </Form.Row>
                        </Col>
                        <Col md="8">
                            <Form.Group>
                                <Form.Label>Parent Menu</Form.Label>
                                <Form.Control as="select" ref={parentRef} value={currentParent} onChange={ e => setCurrentParent(e.target.value)}>
                                    <option value="-">Select Menu</option>
                                    {
                                        parentMenus.map(parent => {
                                            return <option key={parent.id} value={parent.name}>{parent.name}</option>
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="8">
                            <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                            { !loading && <Link to="/application" className="btn btn-danger" disabled={loading}>Cancel</Link>}                    
                        </Col>
                    </Form>
                </Col>                
                <Col md="4" style={{ borderLeft: ".25em solid"}}>
                    <h5 className="text-muted mb-4">List Menu { currentApplication }</h5>
                    {
                        menus.length > 0 ?
                        <Card>
                        {
                            menus.map(menu => {
                                if(!menu.parent) {
                                    return <ListMenu key={menu.id} menu={menu} menus={menus} handleDelete={handleDelete} handleEdit={handleEdit}></ListMenu>                        
                                }
                            })
                        }
                        </Card>
                        : 
                        <div className="mt-4 text-weight text-muted col-md-6 text-center">
                            <span>No Data</span>
                        </div>
                    }  
                </Col>            
            </Row>
        </>
    )
}
