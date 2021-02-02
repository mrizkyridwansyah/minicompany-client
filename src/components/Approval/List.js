import React, {useState} from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory} from 'react-router-dom'

export default function List(props) {    
    const { approval } = props
    const history = useHistory()

    function handleDetail(e) {
        const id = e.target.dataset.id
        history.push(`/approval/detail/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item><strong className="mr-2">{approval.activity.createAt}</strong> {approval.activity.type} - {approval.activity.name}
                    <Badge variant="secondary" className="mr-2" style={{float: "right", cursor: "pointer" }}data-id={approval.id} onClick={handleDetail}>Detail</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
