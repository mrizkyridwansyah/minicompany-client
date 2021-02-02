import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function List(props) {
    const { contract, statusEmployee } = props
    const history = useHistory()

    function handleEdit(e) {
        const id = e.target.dataset.id
        history.push(`/contract/${contract.employee.id}/edit/${id}`)
    }

    function handleShow(e) {
        const id = e.target.dataset.id
        history.push(`/contract/${contract.employee.id}/show/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item><b>From :</b> {contract.dateFrom} <b>Until :</b> {contract.dateUntil}
                    {
                        statusEmployee !== "Permanent" &&
                        <Badge variant="primary" className="mr-2" style={{float: "right", cursor: "pointer" }}data-id={contract.id} onClick={handleEdit}>Edit</Badge>
                    }
                    <Badge variant="success" style={{float: "right", cursor: "pointer" }}data-id={contract.id} onClick={handleShow}>Show</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
