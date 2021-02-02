import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Form,Col, Row } from 'react-bootstrap'

export default function DetailJob(props) {
    const { currentJob } = props
    
    return (
        <>
            <Form className="mt-4">
                <Row>
                <Col md="5">
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={currentJob.title} disabled={true} />
                    </Form.Group>                
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} value={currentJob.desc} disabled={true} />
                    </Form.Group>                
                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <br />
                        <Form.Check inline type="radio">
                            <Form.Check.Input type="radio" name="type" id="full" checked={currentJob.type === "Full Time"} disabled={true} />
                            <Form.Check.Label htmlFor="full">Full Time</Form.Check.Label>                                    
                        </Form.Check>
                        <Form.Check inline type="radio">
                            <Form.Check.Input type="radio" name="type" id="part" checked={currentJob.type === "Part Time"} disabled={true} />
                            <Form.Check.Label htmlFor="part">Part Time</Form.Check.Label> 
                        </Form.Check>
                    </Form.Group>                
                    <Form.Row>       
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Minimum Rate</Form.Label>
                                <Form.Control type="number" value={currentJob.minRate} disabled={true}></Form.Control>
                            </Form.Group>                
                        </Col>       
                        <Col md="6">
                            <Form.Group>
                                <Form.Label>Maximum Rate</Form.Label>
                                <Form.Control type="number" value={currentJob.maxRate} disabled={true}></Form.Control>
                            </Form.Group>                
                        </Col>      
                    </Form.Row>
                </Col>
                <Col md="5">
                    <Form.Group>
                        <Form.Label>Requirement</Form.Label>
                        <div id="editor">
                            <ReactMarkdown children={ currentJob.requirement } allowDangerousHtml={true} />                            
                        </div>
                    </Form.Group>                
                </Col>
            </Row>            
            </Form>
        </>
    )
}
