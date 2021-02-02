import React, { useRef, useState, useEffect } from 'react'
import { Form,Col, Button, Alert, Row } from 'react-bootstrap'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import Async from 'async'
import FormOption from './FormsOption'

export default function Forms() {
    let URI_API = "http://localhost:2000/api/question/"
    let method = "POST"
    const { type, id, idjob } = useParams()
    const [loading, setLoading] = useState(false)
    const [hasChanged, setHasChanged] = useState(false)
    const [error, setError] = useState("")    
    const [options, setOptions] = useState([])
    const [currentDesc, setCurrentDesc] = useState("")
    const [currentSingle, setCurrentSingle] = useState()
    const [currentMultiple, setCurrentMultiple] = useState()
    const [currentValue, setCurrentValue] = useState()
    const descRef = useRef()
    const singleRef = useRef()
    const valueRef = useRef()
    const history = useHistory()
    const { fetchQuery, logout } = useRoot()

    useEffect(() => {
        if(type === "edit") {
            setError("")
            setLoading(true)
            const query = {
                query : `query {
                        question (id: "${id}") { id, jobId, type, desc, weight, options { desc, value }
                    }
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
                    setError("")
                    setCurrentValue(data.body.data.question.weight)
                    setCurrentDesc(data.body.data.question.desc)
                    setCurrentSingle(data.body.data.question.type === "Single")
                    setCurrentMultiple(data.body.data.question.type === "Multiple")
                    setOptions(data.body.data.question.options)
                }            
            })
            setLoading(false)
        }
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const typeQuestion = singleRef.current.checked ? "Single" : "Multiple"
        let newOptions = []
        Async.forEach(options, (option) => {
            const index = options.indexOf(option)
            const desc = document.querySelector(`div.list-option.col-md-8[data-index="${index}"`).childNodes[0].childNodes[1].value
            const isCorrect = document.querySelector(`div.list-option.col-md-4[data-index="${index}"`).childNodes[0].childNodes[1].childNodes[0].checked

            newOptions.push({ desc: desc, value: isCorrect })
        })

        const query = {
            jobId: idjob,
            type: typeQuestion,
            desc: descRef.current.value,
            weight: valueRef.current.value,
            createBy: sessionStorage.getItem("id"),
            updateBy: sessionStorage.getItem("id"),
            options: newOptions
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
                history.push(`/qna/list/${idjob}`)
            }
        })

        setLoading(false)
    }

    function handleAddOption() {
        const newObject = { desc: "", value: false }
        setOptions(prevOptions => [...prevOptions, newObject ])
    }

    async function handleDeleteOption(e) {
        const index = e.target.dataset.index  
        Async.forEach(document.querySelectorAll(`div.list-option[data-index="${index}"]`), (list) => {
            list.remove()
        }, function (err) {
            if(err) setError(err.message)
            setOptions(prevOptions => prevOptions.filter((val, ind) => ind != index))
        })        
    }

    return (
        <>
            <h3>{ type.charAt(0).toUpperCase() + type.slice(1) } Question & Answer</h3>
            { error && <Alert variant="danger">{error}</Alert>}
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Col md="12">
                    <Row>
                        <Col md="8">
                            <h5 className="mb-3">Question</h5>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" row="3" ref={descRef} defaultValue={currentDesc} autoFocus={true} disabled={loading} required={true} />
                            </Form.Group>                
                            <Form.Row>       
                                <Col md="6">
                                    <Form.Group>
                                        <Form.Label>Type</Form.Label>
                                        <br />
                                        <Form.Check inline type="radio">
                                            <Form.Check.Input type="radio" name="type" id="single" ref={singleRef} defaultChecked={currentSingle} disabled={loading} />
                                            <Form.Check.Label htmlFor="single">Single</Form.Check.Label>                                    
                                        </Form.Check>
                                        <Form.Check inline type="radio">
                                            <Form.Check.Input type="radio" name="type" id="multiple" defaultChecked={currentMultiple} disabled={loading} />
                                            <Form.Check.Label htmlFor="multiple">Multiple</Form.Check.Label> 
                                        </Form.Check>
                                    </Form.Group>                
                                </Col>       
                                <Col md="6">
                                    <Form.Group>
                                        <Form.Label>Value</Form.Label>
                                        <Form.Control type="number" ref={valueRef} min="0" max="100" defaultValue={currentValue} disabled={loading} required={true} />
                                    </Form.Group>                
                                </Col>      
                            </Form.Row>
                            <hr />
                            <h5 className="mb-3">Answers</h5>
                            <Button className="mb-3" variant="link" type="button" onClick={handleAddOption}>Add Answer</Button>
                            <Form.Row id="form-option">
                                { 
                                    options.map((option, index) => {
                                        return <FormOption key={index} id={index} handleDeleteOption={handleDeleteOption} option={option}></FormOption>
                                    })
                                }
                            </Form.Row>
                        </Col>
                    </Row>
                    <Button type="submit" className="mr-2" disabled={loading}>Submit</Button>
                    { !loading && <Link to={`/qna/list/${idjob}`} className="btn btn-danger" disabled={loading}>Cancel</Link>}                    
                </Col>
            </Form>
        </>
    )
}
