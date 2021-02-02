import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory} from 'react-router-dom'

export default function List(props) {

    const {
        user,
        from,
        handleDelete,
        handleUpdateStatus,
        handleChoose
    } = props
    const history = useHistory()

    function handleEdit(e) {
        const id = e.target.dataset.id
        history.push(`/user/edit/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{user.name} ({user.role})
                    { 
                        window.location.pathname.split("/")[1] === "setupapproval" &&  
                        <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={user.id} onClick={handleChoose} >Choose</Badge>
                    }
                    {
                        window.location.pathname.split("/")[1] !== "setupapproval" &&
                        <>
                            <Badge variant={user.activeFlag ? "secondary" : "success"} className="ml-2" style={{float: "right", cursor: "pointer"}} data-status={user.activeFlag} data-id={user.id} onClick={handleUpdateStatus} >{user.activeFlag ? "Disable" : "Activate"}</Badge>
                            <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={user.id} onClick={handleDelete}>Delete</Badge>
                            <Badge variant="primary" style={{float: "right", cursor: "pointer"}} data-id={user.id} onClick={handleEdit}>Edit</Badge>
                        </>
                    }
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
