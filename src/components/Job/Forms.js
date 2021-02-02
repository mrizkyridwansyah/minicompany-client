import React, { useRef, useState, useEffect } from 'react'
import { Form,Col, Button, Alert, Row } from 'react-bootstrap'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import ReactQuill from 'react-quill'

export default function Forms() {
    let URI_API = "http://localhost:2000/api/job/"
    let method = "POST"
    const { type, id } = useParams()
    const [loading, setLoading] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const [error, setError] = useState("")        
    const [currentTitle, setCurrentTitle] = useState("")
    const [currentDesc, setCurrentDesc] = useState("")
    const [currentFullTime, setCurrentFullTime] = useState()
    const [currentPartTime, setCurrentPartTime] = useState()
    const [currentRequirement, setCurrentRequirement] = useState("")
    const [currentMinRate, setCurrentMinRate] = useState()
    const [currentMaxRate, setCurrentMaxRate] = useState()
    const [roles, setRoles] = useState([])
    const titleRef = useRef()
    const descRef = useRef()
    const fullRef = useRef()
    const minRef = useRef()
    const maxRef = useRef()
    const requirementRef = useRef()
    const history = useHistory()
    const { fetchQuery, logout } = useRoot()
    const modules = {
        toolbar: [
          [{ 'font': [] }, { 'size': [] }],
          [ 'bold', 'italic', 'underline', 'strike' ],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'super' }, { 'script': 'sub' }],
          [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
          [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
          [ 'direction', { 'align': [] }],
          [ 'link', 'image', 'video', 'formula' ],
          [ 'clean' ]
        ]
      }
      
    useEffect(() => {
        if(type === "edit") {
            setError("")
            setLoading(true)
            const query = {
                query : `query {
                    job (id: "${id}") { id, title, desc, requirement, type, minRate, maxRate }
                }`
            }
    
            fetchQuery(process.env.REACT_APP_REQRUITMENT_URI_GRAPHQL, query, true, "POST").then(async(data) => {
                if(data.status !== 200) {
                    if(data.status === 403) {
                        await logout()
                        history.push("/login")
                    } 
                    setError(data.body.message)
                } else {
                    setCurrentTitle(data.body.data.job.title)
                    setCurrentDesc(data.body.data.job.desc)
                    setCurrentRequirement(data.body.data.job.requirement)
                    setCurrentFullTime(data.body.data.job.type === "Full Time")
                    setCurrentPartTime(data.body.data.job.type === "Part Time")
                    setCurrentMinRate(data.body.data.job.minRate)
                    setCurrentMaxRate(data.body.data.job.maxRate)
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
        
        const typeJob = fullRef.current.checked ? "Full Time" : "Part Time"
        const query = {
            title: titleRef.current.value,
            desc: descRef.current.value,
            requirement: requirementRef.current.state.value,
            type: typeJob,
            minRate: minRef.current.value,
            maxRate: maxRef.current.value
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
                history.push("/job")
            }
        })

        setLoading(false)
    }


    return (
        <>
            <h3>{ type.charAt(0).toUpperCase() + type.slice(1) } Job</h3>
            { error && <Alert variant="danger">{error}</Alert>}
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Row>
                    <Col md="5">
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" ref={titleRef} defaultValue={currentTitle} autoFocus={true} disabled={loading} required={true} />
                        </Form.Group>                
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} ref={descRef} defaultValue={currentDesc} disabled={loading} required={true} />
                        </Form.Group>                
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <br />
                            <Form.Check inline type="radio">
                                <Form.Check.Input type="radio" name="type" id="full" ref={fullRef} defaultChecked={currentFullTime} />
                                <Form.Check.Label htmlFor="full">Full Time</Form.Check.Label>                                    
                            </Form.Check>
                            <Form.Check inline type="radio">
                                <Form.Check.Input type="radio" name="type" id="part" defaultChecked={currentPartTime} />
                                <Form.Check.Label htmlFor="part">Part Time</Form.Check.Label> 
                            </Form.Check>
                        </Form.Group>                
                        <Form.Row>       
                            <Col md="6">
                                <Form.Group>
                                    <Form.Label>Minimum Rate</Form.Label>
                                    <Form.Control type="number" ref={minRef} defaultValue={currentMinRate}></Form.Control>
                                </Form.Group>                
                            </Col>       
                            <Col md="6">
                                <Form.Group>
                                    <Form.Label>Maximum Rate</Form.Label>
                                    <Form.Control type="number" ref={maxRef} defaultValue={currentMaxRate}></Form.Control>
                                </Form.Group>                
                            </Col>      
                        </Form.Row>
                    </Col>
                    <Col md="5">
                        <Form.Group>
                            <Form.Label>Requirement</Form.Label>
                            <div id="editor">
                                <ReactQuill modules={modules} ref={requirementRef} value={currentRequirement}></ReactQuill>
                            </div>
                        </Form.Group>                
                    </Col>
                </Row>
                <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                { !loading && <Link to="/job" className="btn btn-danger" disabled={loading}>Cancel</Link>}                    
            </Form>
        </>
    )
}
