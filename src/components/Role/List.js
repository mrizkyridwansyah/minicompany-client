import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function List(props) {
    const {
        role,
        handleDelete
    } = props
    const history = useHistory()

    function handleEdit(e){
        const id = e.target.dataset.id
        history.push(`/role/edit/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{role.name}
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={role.id} onClick={handleDelete}>Delete</Badge>
                    <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={role.id} onClick={handleEdit}>Edit</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
