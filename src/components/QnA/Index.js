import React, { useState, useEffect, useRef } from 'react'
import { Form, Col, Button, Card, Alert } from 'react-bootstrap' 
import { Link, useHistory, useParams } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import List from './List'

export default function Index() {
    const URI_API = `${process.env.REACT_APP_REQRUITMENT_URI_API}/question`
    const [questions, setQuestions] = useState([])
    const [hasChanged, setHasChanged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { fetchQuery, logout } = useRoot()
    const keywordRef = useRef()
    const typeRef = useRef()
    const history = useHistory()
    const { idjob } = useParams()

    async function getQuestions(search = "") {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                questions ${search} { id, jobId, job { title }, type, desc, weight, options { id, desc, value } }
            }`
        }

        fetchQuery(process.env.REACT_APP_REQRUITMENT_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            console.log(data)
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setQuestions(data.body.data.questions)
                setError("")
            }            
        })
        setLoading(false)
    }

    function handleSearch(e) {
        e.preventDefault()
        let type = (typeRef.current.value !== "") ? `, type: ${typeRef.current.value}`: ""
        let search = `(keyword: "${keywordRef.current.value}",jobId: "${idjob}" ${type})`
        getQuestions(search)
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

    useEffect(() => {
        getQuestions()
    }, [hasChanged])

    return (
        <>
            <h3>Question & Answer</h3>
            <div className="mt-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <Link to={ `/qna/${idjob}/add` } className="btn btn-primary">Add New Question</Link>
                <Form className="mt-4" onSubmit={handleSearch}>
                    <Form.Row>
                        <Col md="5">
                            <Form.Group>
                                <Form.Control type="text" ref={keywordRef} onChange={handleSearch} disabled={loading} placeholder="Search by Description or Weight"></Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md="2">
                            <Form.Group>
                                <Form.Control as="select" ref={typeRef} onChange={handleSearch} >
                                    <option value="">All Type</option>
                                    <option value="Single">Single Answer</option>
                                    <option value="Multiple">Multiple Answer</option>
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
                        questions.length > 0 ?
                        <> 
                            <h5 className="mt-4">Job {questions[0].job.title}</h5>
                            <Card className="mt-3 col-md-8">
                            { 
                                questions.map(question => {
                                    if(question.id !== sessionStorage.getItem("id")) {
                                        return <List key={question.id} question={question} handleDelete={handleDelete}></List>
                                    }
                                }) 
                            }
                        </Card>
                        </>
                        : 
                        <div className="mt-4 text-weight text-muted col-md-6 text-center">
                            <span>No Data</span>
                        </div>
                    }
            </div>
        </>
    )
}
