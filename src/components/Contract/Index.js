import React, { useRef, useState, useEffect } from 'react'
import { Form, Col, Button, Card, Alert } from 'react-bootstrap' 
import { Link, useHistory, useParams } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'

export default function Index() {
    const { idemployee } = useParams()
    const URI_API = `${process.env.REACT_APP_HRIS_URI_API}/division`
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [contracts, setContracts] = useState([])
    const [currentEmployee, setCurrentEmployee] = useState({})
    const { fetchQuery, logout } = useRoot()
    const history = useHistory()

    function getContracts() {
        setLoading(true)
        setError("")
        const query = {
            query : `query { employeeContracts (id: "${idemployee}") { id, employee { id, employeeId, name }, dateFrom, dateUntil, activeFlag } }`
        }
        console.log(query)
        fetchQuery(process.env.REACT_APP_HRIS_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            console.log(data)
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setContracts(data.body.data.employeeContracts)
                setError("")
            }            
        })
        setLoading(false)
    }

    function getCurrentEmployee() {
        setError("")
        setLoading(true)

        const query = {
            query : `query {
                employee (id: "${idemployee}") { id, employeeId, name, status }
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
                setCurrentEmployee(data.body.data.employee)
                setError("")
            }            
        })
        setLoading(false)
    }

    useEffect(() => {
        getContracts()
        getCurrentEmployee()
    }, [])

    return (
        <>
            <h3>Contract { currentEmployee.name }</h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                {
                    currentEmployee.status !== "Permanent" &&
                    <Link to={`/contract/${idemployee}/add`} className="btn btn-primary">Add New Contract</Link>
                }
                <Link to={`/employee/detail/${idemployee}`} className="btn btn-danger ml-2">Back</Link>
                {
                    contracts.length > 0 ?
                    <Card style={{ width: "30em"}} className="mt-4">
                        {
                            contracts.map(contract => {
                                return <List key={contract.id} contract={contract} statusEmployee={currentEmployee.status}></List>
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
