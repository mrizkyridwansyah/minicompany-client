import React from 'react'
import { Form,Col, Button, Alert, Row, Badge } from 'react-bootstrap'

export default function FormsOption(props) {
    const { 
        id,
        option,
        handleDeleteOption
    } = props

    return (
        <>           
            <Col md="8" className="list-option" data-index={id}>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" row="3" autoFocus={true} required={true} defaultValue={option.desc} />
                </Form.Group>                
            </Col>
            <Col md="4" className="list-option" data-index={id}>
                <Form.Group>
                    <br />
                    <Form.Check inline type="radio">
                        <Form.Check.Input type="checkbox" name="value" id={`correct_${id}`} defaultChecked={option.value} />
                        <Form.Check.Label htmlFor={`correct_${id}`}>Correct Answer</Form.Check.Label>                                    
                    </Form.Check>
                    <Badge variant="danger" onClick={handleDeleteOption} style={{cursor: "pointer"}} data-index={id} >Delete</Badge>
                </Form.Group>   
            </Col>
        </>
    )
}
