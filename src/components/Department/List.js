import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function List(props) {
    const {
        department,
        handleDelete
    } = props
    const history = useHistory()

    function handleEdit(e) {
        const id = e.target.dataset.id
        history.push(`/department/edit/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{department.name}
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={department.id} onClick={handleDelete}>Delete</Badge>
                    <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={department.id} onClick={handleEdit}>Edit</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
