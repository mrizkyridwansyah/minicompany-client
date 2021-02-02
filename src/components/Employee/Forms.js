import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Col, Row, Alert, Badge } from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useRoot } from '../../RootContext'

export default function Forms() {
    let URI_API = `${process.env.REACT_APP_HRIS_URI_API}/employee/`
    let method = "POST"
    const { type, id } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [divisions, setDivisions] = useState([])
    const [departments, setDepartments] = useState([])
    const [users, setUsers] = useState([])
    const [currentEmployee, setCurrentEmployee] = useState({})
    const [currentDivision, setCurrentDivision] = useState("")
    const [currentDepartment, setCurrentDepartment] = useState("")
    const [currentStatus, setCurrentStatus] = useState("")
    const [currentUser, setCurrentUser] = useState("")
    const { fetchQuery, logout } = useRoot()
    const history = useHistory()
    const nameRef = useRef()
    const citizenRef = useRef()
    const foreignRef = useRef()
    const identityNumberRef = useRef()
    const emailRef = useRef()
    const placeOfBirthRef = useRef()
    const dateOfBirthRef = useRef()
    const addressRef = useRef()
    const subDistrictRef = useRef()
    const districtRef = useRef()
    const provinceRef = useRef()
    const phoneRef = useRef()
    const accountBankRef = useRef()
    const joinDateRef = useRef()
    const statusRef = useRef()
    const jobTitleRef = useRef()
    const divisionRef = useRef()
    const departmentRef = useRef()
    const userRef = useRef()

    async function getSetData() {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
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
                usersForEmployee ${search} { id, username, name, email, role, activeFlag }
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
                setUsers(data.body.data.usersForEmployee)
                setError("")
            }            
        })
        setLoading(type === "detail")
    }

    function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true) 
        
        const nationality = citizenRef.current.checked ? "Citizen" : "Foreign Nationals"
        let query = {
            identityNumber: identityNumberRef.current.value,
            email: emailRef.current.value,
            name: nameRef.current.value,
            placeOfBirth: placeOfBirthRef.current.value,
            dateOfBirth: dateOfBirthRef.current.value,
            nationality: nationality,
            division: divisionRef.current.value,
            department: departmentRef.current.value,
            accountBank: accountBankRef.current.value,
            jobTitle: jobTitleRef.current.value,
            joinDate: joinDateRef.current.value,
            status: statusRef.current.value,
            user: userRef.current.value
        }

        if(addressRef.current.value !== "") query.identityAddress = addressRef.current.value
        if(subDistrictRef.current.value !== "") query.identitySubDistrict = subDistrictRef.current.value
        if(districtRef.current.value !== "") query.identityDistrict = districtRef.current.value
        if(provinceRef.current.value !== "") query.identityProvince = provinceRef.current.value
        if(phoneRef.current.value !== "") query.phoneNumber = phoneRef.current.value

        if(type === "edit") {
            URI_API = `${URI_API}${id}`
            method = "PUT"
        }

        fetchQuery(URI_API, query, true, method).then(async(result) => {
            if(result.status !== 200) {
                if(result.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(result.body.message)
            } else {
                fetchQuery(`${process.env.REACT_APP_SSO_URI_API}/user/update-employee/${userRef.current.value}`, { employeeId: result.body._id}, true, "PUT").then(async(data) => {
                    if(data.status !== 200) {
                        if(data.status === 403) {
                            await logout()
                            history.push("/login")
                        } 
                        setError(data.body.message)
                    } else {
                        setError("")
                        history.push("/employee")
                    }
                })
            }
        })

        setLoading(false)
    }

    function getCurrentEmployee() {
        setError("")
        setLoading(true)

        const query = {
            query : `query {
                employee (id: "${id}") { id, employeeId, name, nationality, identityNumber, email, placeOfBirth, dateOfBirth, identityAddress, identitySubDistrict, identityDistricts, identityProvince, phoneNumber, accountBank, joinDate, status, jobTitle, division, department, usernameEmployee }
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
                setCurrentEmployee(data.body.data.employee)
                setCurrentStatus(data.body.data.employee.status)
                setCurrentDivision(data.body.data.employee.division)
                setCurrentDepartment(data.body.data.employee.department)
                setCurrentUser(data.body.data.employee.usernameEmployee)
                getUsers(`(employeeId: "${data.body.data.employee.id }")`)
                setError("")
            }            
        })
        setLoading(false)
    }

    function handleContract(e) {
        const id = e.target.dataset.id
        history.push(`/contract/${id}`)
    }

    function handleSalary(e) {
        const id = e.target.dataset.id
        history.push(`/salary/${id}`)
    }

    useEffect(() => {
        getSetData()
        getUsers()
        if(type !== "add") {
            getCurrentEmployee()
        } 
    }, [])
    
    return (
        <>
            <h3>{ type.charAt(0).toUpperCase() + type.slice(1) } Employee</h3>
            {
                type === "detail" &&
                <div>
                    <Badge variant="primary" style={{ cursor: "pointer"}} data-id={currentEmployee.id} onClick={handleContract}>Contract</Badge>
                    <Badge variant="primary" className="ml-2" data-id={currentEmployee.id} style={{ cursor: "pointer"}} onClick={handleSalary}>Salary</Badge>
                    <Badge variant="danger" className="ml-2" data-id={currentEmployee.id} style={{ cursor: "pointer"}} onClick={() => { history.push("/employee")}}>Back</Badge>
                    <br />
                </div>
            }
            { error && <Alert variant="danger">{error}</Alert>} 
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Col md="8">
                    <Form.Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" ref={nameRef} autoFocus={true} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.name : ""} required={true} ></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>User Employee</Form.Label>
                                <Form.Control as="select" ref={userRef} disabled={loading} value={currentUser} required={true} onChange={(e) => setCurrentUser(e.target.value)}>
                                    <option value="" hidden>Select User</option>
                                    {
                                        users.map(user => {
                                            return <option value={user.username}>{user.username} - ({user.role})</option>
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Group as={Row}>
                        <Form.Label column md="3">Nationality</Form.Label>
                        <br />
                        <Form.Check inline type="radio" className="mr-4">
                            <Form.Check.Input type="radio" name="type" id="citizen" ref={citizenRef} disabled={loading} defaultChecked={Object.keys(currentEmployee).length > 0 ? currentEmployee.nationality === "Citizen" : true} />
                            <Form.Check.Label htmlFor="citizen">Citizen</Form.Check.Label>                                    
                        </Form.Check>
                        <Form.Check inline type="radio">
                            <Form.Check.Input type="radio" name="type" id="foreign" ref={foreignRef} disabled={loading} defaultChecked={Object.keys(currentEmployee).length > 0 ? currentEmployee.nationality === "Foreign Nationals" : false} />
                            <Form.Check.Label htmlFor="foreign">Foreign Nationals</Form.Check.Label> 
                        </Form.Check>
                    </Form.Group>                
                    <Form.Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Identity Number</Form.Label>
                                <Form.Control type="text" ref={identityNumberRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.identityNumber : ""} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.email : ""} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Place of Birth</Form.Label>
                                <Form.Control type="text" ref={placeOfBirthRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.placeOfBirth : ""} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date" ref={dateOfBirthRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.dateOfBirth : ""} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Group>
                        <Form.Label>Identity Address</Form.Label>
                        <Form.Control as="textarea" ref={addressRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.identityAddress : ""}></Form.Control>
                    </Form.Group>
                    <Form.Row>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>Identity Sub-District</Form.Label>
                                <Form.Control type="text" ref={subDistrictRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.identitySubDistrict : ""}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>Identity District</Form.Label>
                                <Form.Control type="text" ref={districtRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.identityDistrict : ""}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>Identity Province</Form.Label>
                                <Form.Control type="text" ref={provinceRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.identityProvince : ""}></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type="text" ref={phoneRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.phoneNumber : ""}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>Account Bank</Form.Label>
                                <Form.Control type="text" ref={accountBankRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.accountBank : ""} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>Join Date</Form.Label>
                                <Form.Control type="date" ref={joinDateRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.joinDate : ""} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>Employment Status</Form.Label>
                                <Form.Control as="select" ref={statusRef} disabled={loading} value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} required={true}>
                                    <option value="Contract">Contract</option>
                                    <option value="Permanent">Permanent</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="8">
                            <Form.Group>
                                <Form.Label>Job Title</Form.Label>
                                <Form.Control type="text" ref={jobTitleRef} disabled={loading} defaultValue={Object.keys(currentEmployee).length > 0 ? currentEmployee.jobTitle : ""} required={true}></Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Division</Form.Label>
                                <Form.Control as="select" ref={divisionRef} disabled={loading} value={currentDivision} required={true} onChange={(e) => setCurrentDivision(e.target.value)}>
                                    <option value="" hidden>Select Division</option>
                                    {
                                        divisions.map(division => {
                                            return <option value={division.name}>{division.name}</option>
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Department</Form.Label>
                                <Form.Control as="select" ref={departmentRef} disabled={loading} value={currentDepartment} required={true} onChange={(e) => setCurrentDepartment(e.target.value)}>
                                    <option value="" hidden>Select Department</option>
                                    {
                                        departments.map(department => {
                                            return <option value={department.name}>{department.name}</option>
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    {/* <Form.Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Photo</Form.Label>
                                <FilePond onupdatefiles={submitImages} allowMultiple={false} files={photos} ref={photoRef}></FilePond>
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Curriculum Vitae</Form.Label>
                                <FilePond onupdatefiles={submitImages} allowMultiple={false} files={files} ref={cvRef}></FilePond>
                            </Form.Group>
                        </Col>
                    </Form.Row> */}
                    { type !== "detail" &&
                        <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                    }
                    { !loading && <Link to="/employee" className="btn btn-danger" disabled={loading}>Cancel</Link>}                    
                </Col>
            </Form>
        </>
    )
}
