import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory} from 'react-router-dom'

export default function List(props) {

    const {
        reference,
        user,
        handleDelete
    } = props
    const history = useHistory()

    function handleEdit(e) {
        const id = e.target.dataset.id
        history.push(`/setupapproval/edit/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{user.name} - {user.username}
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={reference.id} onClick={handleDelete}>Delete</Badge>
                    <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={reference.id} onClick={handleEdit}>Edit</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
