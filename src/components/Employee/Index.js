import React, { useState, useEffect, useRef } from 'react'
import { Form, Col, Button, Card, Alert } from 'react-bootstrap' 
import { Link, useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'

export default function Index() {
    const URI_API = "http://localhost:2100/api/employee"
    const [employees, setEmployees] = useState([])
    const [divisions, setDivisions] = useState([])
    const [departments, setDepartments] = useState([])
    const [hasChanged, setHasChanged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { fetchQuery, logout } = useRoot()
    const keywordRef = useRef()
    const divisionRef = useRef()
    const departmentRef = useRef()
    const history = useHistory()

    async function getEmployees(search = "") {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                employees ${search} { id, employeeId, email, name, status, jobTitle, activeFlag, division, department, resignDate },
                divisions { id, name },
                departments { id, name }
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
                setDivisions(data.body.data.divisions)
                setDepartments(data.body.data.departments)
                setEmployees(data.body.data.employees)
                setError("")
            }            
        })
        setLoading(false)
    }

    function handleSearch(e) {
        e.preventDefault()
        let division = (divisionRef.current.value !== "") ? `, division: "${divisionRef.current.value}"`: ""
        let department = (departmentRef.current.value !== "") ? `, department: "${departmentRef.current.value}"`: ""
        let search = `(keyword: "${keywordRef.current.value}"${division}${department})`
        
        getEmployees(search)
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
        if(window.confirm(`Are you sure want to ${action} this candidate?`)) {
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
        getEmployees()
    }, [hasChanged])

    return (
        <>
            <h3>Employee</h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <Link className="btn btn-primary" to="/employee/add">Add New Employee</Link>
                <Form className="mt-4" onSubmit={handleSearch}>
                    <Form.Row>
                        <Col md="4">
                            <Form.Group>
                                <Form.Control type="text" ref={keywordRef} onChange={handleSearch} disabled={loading} placeholder="Search by Employee ID, Email or Name" ></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="3">
                            <Form.Group>
                                <Form.Control as="select" ref={divisionRef} onChange={handleSearch} >
                                    <option value="">All Division</option>
                                    {
                                        divisions.map(division => {
                                            return <option value={division.name}>{division.name}</option>
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="3">
                            <Form.Group>
                                <Form.Control as="select" ref={departmentRef} onChange={handleSearch} >
                                    <option value="">All Department</option>
                                    {
                                        departments.map(department => {
                                            return <option value={department.name}>{department.name}</option>
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
                        employees.length > 0 ? 
                        <Card style={{ width: '70em' }} className="mt-4">
                            { 
                                employees.map(employee => {
                                    if(employee.id !== sessionStorage.getItem("id")) {
                                        return <List key={employee.id} employee={employee} handleDelete={handleDelete} handleUpdateStatus={handleUpdateStatus}></List>
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
