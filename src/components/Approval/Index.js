import React, { useState, useEffect, useRef } from 'react'
import { Form, Col, Button, Card, Alert } from 'react-bootstrap' 
import { useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'


export default function Index() {
    const URI_API = `${process.env.REACT_APP_HRIS_URI_API}/approval/`
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [hasChanged, setHasChanged] = useState(false)
    const [approvals, setApprovals] = useState([])
    const { fetchQuery, logout } = useRoot()
    const keywordRef = useRef()
    const statusRef = useRef()
    const typeRef = useRef()
    const history = useHistory()

    function handleDelete(e) {
        e.preventDefault()
        setError("")
        setLoading(true)
        if(window.confirm("Are you sure want to delete this activity")){
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
        else {
            setLoading(false)
        }
    }

    async function getApprovals(search = "") {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                approvals (userId: "${sessionStorage.getItem("id")}") {
                    id,    
                    userId,
                    level,
                    approvedFlag,
                    approvedDate,
                    notes,    
                    activity { id, name, dateFrom, dateUntil, createAt, type, notes, reimburse { id } }
                }
            }`
        }

        fetchQuery(process.env.REACT_APP_HRIS_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            console.log(data)
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setApprovals(data.body.data.approvals)
                setError("")
            }            
        })
        setLoading(false)
    }

    useEffect(() => {
        getApprovals()
    }, [hasChanged])

    return (
        <>
            <h3>Approval</h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                {                        
                    approvals.length > 0 ? 
                    <Card style={{ width: '40em' }} className="mt-4">
                        { 
                            approvals.map(approval => {
                                return <List key={approval.id} approval={approval}></List>
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
