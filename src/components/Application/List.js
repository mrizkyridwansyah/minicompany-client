import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function List(props) {
    const {
        app,
        handleDelete
    } = props
    const history = useHistory()

    function handleEdit(e) {
        const id = e.target.dataset.id
        history.push(`/application/edit/${id}`)
    }

    function handleMenu(e) {
        const id = e.target.dataset.id
        history.push(`/menu/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{app.name}
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={app.id} onClick={handleDelete}>Delete</Badge>
                    <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={app.id} onClick={handleEdit}>Edit</Badge>
                    <Badge variant="success" style={{float: "right", cursor: "pointer"}} data-id={app.id} onClick={handleMenu}>Menu</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
