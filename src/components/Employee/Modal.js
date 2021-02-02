import React, { useRef } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'

export default function ModalResign({show, handleClose, id}) {
    const URI_API = `http://localhost:2100/api/employee/resign/${id}`
    const dateRef = useRef()
    const history = useHistory()
    const { fetchQuery, logout } = useRoot()

    function handleSubmit(e) {
        e.preventDefault()
        fetchQuery(URI_API, { resignDate: dateRef.current.value }, true, "PUT").then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                alert(data.body.message)
            } else {
                window.location.reload()
            }            
        })
    }
    
    return (
        <>
            <Modal size="md" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Resign</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Resign Date</Form.Label>
                            <Form.Control type="date" ref={dateRef} required={true}></Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit">Save</Button>
                    </Form>
                </Modal.Body>
            </Modal>            
        </>
    )
}
