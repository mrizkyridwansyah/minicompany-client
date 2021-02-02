import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function List(props) {
    const { salary } = props
    const history = useHistory()

    function handleEdit(e) {
        const id = e.target.dataset.id
        history.push(`/salary/${salary.employee.id}/edit/${id}`)
    }

    function handleShow(e) {
        const id = e.target.dataset.id
        history.push(`/salary/${salary.employee.id}/show/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item><b>{salary.createAt}</b> as {salary.job} - Rp. {salary.amount.toLocaleString()}
                    <Badge variant="primary" className="mr-2" style={{float: "right", cursor: "pointer" }}data-id={salary.id} onClick={handleEdit}>Edit</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
