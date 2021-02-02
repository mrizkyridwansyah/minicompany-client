import React, { useState, useEffect, useRef } from 'react'
import { Card, Alert } from 'react-bootstrap' 
import { Link, useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'

export default function Index() {
    const URI_API = `${process.env.REACT_APP_HRIS_URI_API}/approval/setup`
    const [levels, setLevels] = useState([])
    const [references, setReferences] = useState([])
    const [users, setUsers] = useState([])
    const [error, setError] = useState("")
    const [hasChanged, setHasChanged] = useState(false)
    const { fetchQuery, logout } = useRoot()
    const history = useHistory()

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

    function handleDelete(e) {
        e.preventDefault()
        if(window.confirm("Are you sure want to delete this data?")) {
            const id = e.target.dataset.id
            console.log(`${URI_API}/${id}`)
            fetchQuery(`${URI_API}/${id}`, {}, true, "DELETE").then(async(data) => {
                if(data.status !== 200) {
                    if(data.status === 403) {
                        await logout()
                        history.push("/login")
                    } 
                    setError(data.body.message)
                } else {
                    window.location.reload()
                    // setHasChanged(!hasChanged)
                    setError("")
                }            
            })
        }
    }

    async function getUsers(search = "") {
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
                getReference()
                setError("")
            }            
        })
    }

    async function getReference(search = "") {
        setError("")
        const query = {
            query : `query { approvalReferences ${search} { id, userId, level } }`
        }
        fetchQuery(process.env.REACT_APP_HRIS_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setReferences(data.body.data.approvalReferences)
                setError("")
            }            
        })
    }

    useEffect(() => {
        getLevels()
        getUsers()
    }, [])

    return (
        <>
            <h3>Setup Approval</h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <Link to="/setupapproval/add" className="btn btn-primary">Add New Reference</Link>
                {                        
                    levels.length > 0 ? 
                        levels.map(level => {
                            return <>
                                <h4 className="mt-4">Level {level}</h4>
                                <Card style={{ width: '50em' }} className="mt-2 mb-4">
                                {
                                    references.filter(ref => ref.level === level).map(reference => {                       
                                        return <List key={reference.id} reference={reference} user={users.filter(x=> x.id === reference.userId)[0] } handleDelete={handleDelete}></List>
                                    }) 
                                }
                                </Card>
                            </>
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
