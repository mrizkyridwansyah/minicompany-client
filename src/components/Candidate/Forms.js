import React, { useRef, useState, useEffect } from 'react'
import { Form,Col, Badge, Image, Row, Button } from 'react-bootstrap'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useRoot } from '../../RootContext'
import DetailOnlineTest from './OnlineTest'

export default function Forms() {
    const { type, id } = useParams()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [currentCandidate, setCurrentCandidate] = useState({})
    const [detailTest, setDetailTest] = useState([])
    const [prevUrl, setPrevUrl] = useState("")
    const history = useHistory()
    const { fetchQuery, logout } = useRoot()

    function getCandidate() {
        setError("")
        setLoading(true)
        const query = {
            query: `query {
                candidate (id: "${id}") {
                    id,
                    identityNumber,
                    email,
                    name,
                    placeOfBirth,
                    dateOfBirth,
                    identityAddress,
                    identitySubDistrict,
                    identityDistricts,
                    identityProvince,
                    nationality,
                    photo,
                    cv,
                    status    
                }
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
                setError("")
                setCurrentCandidate(data.body.data.candidate)
            }            
        })

        setLoading(false)
    }

    function getOnlineResultDetail(appId) {
        setError("")
        setLoading(true)
        const query = {
            query: `query {
                onlineTestDetail (id: "${appId}") {
                    id,
                    applicationId,
                    questionId,
                    question,
                    answerId,
                    answer,
                    value
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
                setDetailTest(data.body.data.onlineTestDetail)
            }            
        })

        setLoading(false)
    }

    useEffect(() => {
        getCandidate()
        if(window.location.search) {
            getOnlineResultDetail(window.location.search.split("=")[2])
            setPrevUrl(window.location.search.split("&")[0].substring(6))
        } else {
            setPrevUrl("/candidate")
        }
    }, [])


    return (
        <>
            <h3>
                { type.charAt(0).toUpperCase() + type.slice(1) } Candidate
                {
                    currentCandidate.status && 
                    <Badge variant={currentCandidate.status === "Accepted" ? "success" : currentCandidate.status === "Refused" ? "danger" : "secondary"} className="ml-5">{currentCandidate.status}</Badge>
                }
            </h3>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="applications-tab" data-toggle="tab" href="#applications" role="tab" aria-controls="applications" aria-selected="true">General Information</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="detail-job-tab" data-toggle="tab" href="#detail-job" role="tab" aria-controls="detail-job" aria-selected="false">Detail Online Test</a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="applications" role="tabpanel" aria-labelledby="applications-tab">
                    <Row>
                        <Col md="5">
                            <Form className="mt-4">
                                <Form.Group>
                                    <Form.Label>Identity Number</Form.Label>
                                    <Form.Control type="text" defaultValue={currentCandidate.identityNumber ? currentCandidate.identityNumber : "" } autoFocus={true} disabled={!loading} required={true} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" defaultValue={currentCandidate.name ? currentCandidate.name : "" } disabled={!loading} required={true} />
                                </Form.Group>
                                <Form.Row>       
                                    <Col md="6">
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" defaultValue={currentCandidate.email ? currentCandidate.email : "" } disabled={!loading} required={true} />
                                        </Form.Group>                
                                    </Col>       
                                    <Col md="6">
                                        <Form.Group>
                                            <Form.Label>Nationality</Form.Label>
                                            <br />
                                            <Form.Check inline type="radio">
                                                <Form.Check.Input type="radio" name="type" id="citizen" defaultChecked={currentCandidate.nationality && currentCandidate.nationality === "WNI" } disabled={!loading} />
                                                <Form.Check.Label htmlFor="citizen">Citizen</Form.Check.Label>                                    
                                            </Form.Check>
                                            <Form.Check inline type="radio">
                                                <Form.Check.Input type="radio" name="type" id="foreigner" defaultChecked={currentCandidate.nationality && currentCandidate.nationality === "WNA"} disabled={!loading} />
                                                <Form.Check.Label htmlFor="foreigner">Foreigner</Form.Check.Label> 
                                            </Form.Check>
                                        </Form.Group>                
                                    </Col>      
                                </Form.Row>
                                <Form.Row>       
                                    <Col md="6">
                                        <Form.Group>
                                            <Form.Label>Place of Birth</Form.Label>
                                            <Form.Control type="text" defaultValue={currentCandidate.placeOfBirth ? currentCandidate.placeOfBirth : "" } disabled={!loading} required={true} />
                                        </Form.Group>                
                                    </Col>       
                                    <Col md="6">
                                        <Form.Group>
                                            <Form.Label>Date of Birth</Form.Label>
                                            <Form.Control type="date" defaultValue={currentCandidate.dateOfBirth ? currentCandidate.dateOfBirth : "" } disabled={!loading} required={true} />
                                        </Form.Group>                
                                    </Col>      
                                </Form.Row>
                                <Form.Group>
                                    <Form.Label>Identity Address</Form.Label>
                                    <Form.Control as="textarea" defaultValue={currentCandidate.identityAddress ? currentCandidate.identityAddress : ""} disabled={!loading} required={true} />
                                </Form.Group>
                                <Form.Row>       
                                    <Col md="4">
                                        <Form.Group>
                                            <Form.Label>Subdistrict</Form.Label>
                                            <Form.Control type="text" defaultValue={currentCandidate.identitySubDistrict ? currentCandidate.identitySubDistrict : ""} disabled={!loading} />
                                        </Form.Group>                
                                    </Col>       
                                    <Col md="4">
                                        <Form.Group>
                                            <Form.Label>District</Form.Label>
                                            <Form.Control type="text" defaultValue={currentCandidate.identityDistricts ? currentCandidate.identityDistricts : ""} disabled={!loading} />
                                        </Form.Group>                
                                    </Col>      
                                    <Col md="4">
                                        <Form.Group>
                                            <Form.Label>Province</Form.Label>
                                            <Form.Control type="text" defaultValue={currentCandidate.identityProvince ? currentCandidate.identityProvince : ""} disabled={!loading} />
                                        </Form.Group>                
                                    </Col>      
                                </Form.Row>
                            </Form>
                        </Col>
                        <Col md="5">
                            <Image src="../../logo512.png" className="rounded" alt="..." />
                            <br />
                            <a href={currentCandidate.cv && currentCandidate.cv !== null ? currentCandidate.cv : "#" } download={currentCandidate.cv && currentCandidate.cv !== null ? `CV ${currentCandidate.name}` : null }>
                                <i className="fa fa-download fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Curriculum Vitae</span>
                            </a>
                        </Col>
                    </Row>                
                </div>
                <div className="tab-pane fade" id="detail-job" role="tabpanel" aria-labelledby="detail-job-tab">
                    {
                        detailTest.length > 0 ? 
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <td style={{width: "3em"}}>No.</td>
                                    <td>Question</td>
                                    <td>Answer</td>
                                    <td style={{width: "5em"}}>Score</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    detailTest.map((detail, index) => {
                                        return <DetailOnlineTest key={detail.id} detailTest={detail} no={index}></DetailOnlineTest>
                                    })  
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3"><strong>Total Score</strong></td>
                                    <td><strong>{detailTest.reduce((acc, detail) => acc + detail.value, 0)}</strong></td>
                                </tr>
                            </tfoot>
                        </table>                        
                        : 
                        <div className="mt-4 text-weight text-muted col-md-6 text-center">
                            <span>No Data</span>
                        </div>
                    }
                </div>
            </div>    
            <Link to={prevUrl} className="btn btn-danger" disabled={!loading}>Back</Link>                    
        </>
    )
}
