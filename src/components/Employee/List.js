import React, {useState} from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory} from 'react-router-dom'
import Modal from './Modal'

export default function List(props) {    
    const {
        employee,
        handleDelete,
        handleUpdateStatus
    } = props
    const [show, setShow] = useState(false)
    const [typeModal, setTypeModal] = useState("Resign")
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    const history = useHistory()

    function handleEdit(e) {
        const id = e.target.dataset.id
        history.push(`/employee/edit/${id}`)
    }

    function handleDetail(e) {
        const id = e.target.dataset.id
        history.push(`/employee/detail/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{employee.division} - {employee.name} <strong>({employee.employeeId})</strong>
                    <Badge variant={employee.activeFlag ? "secondary" : "success" } style={{float: "right", cursor: "pointer"}} data-id={employee.id} onClick={handleUpdateStatus}>{employee.activeFlag ? "Disable" : "Activate" }</Badge>
                    <Badge variant="success" className="mr-2" style={{float: "right", cursor: "pointer" }}data-id={employee.id} onClick={handleDetail}>Detail</Badge>
                    {
                        !employee.resignDate &&
                        <Badge variant="danger" className="mr-2" style={{float: "right", cursor: "pointer" }}data-id={employee.id} onClick={handleShow}>Resign</Badge>
                    }
                    <Badge variant="primary" className="mr-2" style={{float: "right", cursor: "pointer" }}data-id={employee.id} onClick={handleEdit}>Edit</Badge>
                </ListGroup.Item>
            </ListGroup>
            <Modal show={show} handleClose={handleClose} id={employee.id} type={typeModal}></Modal>
        </>
    )
}
