import React, {useState} from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory} from 'react-router-dom'

export default function List(props) {    
    const {
        activity,
        handleDelete
    } = props
    const history = useHistory()

    function handleEdit(e) {
        const id = e.target.dataset.id
        history.push(`/activity/edit/${id}`)
    }

    function handleDetail(e) {
        const id = e.target.dataset.id
        history.push(`/activity/detail/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item><strong className="mr-2">{activity.createAt}</strong> {activity.type} - {activity.name}  <strong className="ml-2">({activity.status})</strong>                
                    <Badge variant="danger" style={{float: "right", cursor: "pointer" }}data-id={activity.id} onClick={handleDelete}>Delete</Badge>
                    <Badge variant="primary" className="mr-2" style={{float: "right", cursor: "pointer" }}data-id={activity.id} onClick={handleEdit}>Edit</Badge>
                    <Badge variant="secondary" className="mr-2" style={{float: "right", cursor: "pointer" }}data-id={activity.id} onClick={handleDetail}>Detail</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
