import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory} from 'react-router-dom'

export default function List(props) {

    const {
        candidate,
        handleDelete,
        handleUpdateStatus
    } = props
    const history = useHistory()

    function handleDetail(e) {
        const id = e.target.dataset.id
        history.push(`/candidate/detail/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{candidate.name} ({candidate.email})
                    {/* <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={candidate.id} onClick={handleDetail}>Edit</Badge> */}
                    <Badge variant="success" style={{float: "right", cursor: "pointer"}} data-id={candidate.id} onClick={handleDetail}>Detail</Badge>
                    <Badge variant="secondary" className="mr-2" style={{float: "right" }}data-id={candidate.id}>{candidate.status }</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
