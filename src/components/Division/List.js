import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function List(props) {
    const {
        division,
        handleDelete
    } = props
    const history = useHistory()

    function handleEdit(e) {
        const id = e.target.dataset.id
        history.push(`/division/edit/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{division.name}
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={division.id} onClick={handleDelete}>Delete</Badge>
                    <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={division.id} onClick={handleEdit}>Edit</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
