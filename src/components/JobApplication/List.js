import React from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import { useHistory} from 'react-router-dom'

export default function List(props) {

    const {
        application,
        prevUrl,
        handleStatus
    } = props

    const candidate = application.candidate
    const history = useHistory()

    function handleDetail(e) {
        const id = e.target.dataset.id        
        const applicationId = e.target.dataset.app        
        history.push(`/candidate/detail/${id}?from=${prevUrl}&app=${applicationId}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{candidate.name} ({candidate.email})
                    {
                        candidate.status === "Registered" && 
                        <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={candidate.id} data-app={application.id} data-status="Interviewed" onClick={handleStatus}>Call Interview</Badge>
                    }
                    {
                        candidate.status === "Interviewed" && 
                        <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={candidate.id} data-app={application.id} data-status="On Review" onClick={handleStatus}>On Review</Badge>
                    }
                    {
                        candidate.status === "On Review" &&
                        <> 
                            <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={candidate.id} data-status="Refuse" data-app={application.id} onClick={handleStatus}>Refuse</Badge>
                            <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={candidate.id} data-status="Accept" data-app={application.id} onClick={handleStatus}>Accept</Badge>
                        </>
                    }
                    <Badge variant="success" style={{float: "right", cursor: "pointer"}} data-id={candidate.id} data-app={application.id} onClick={handleDetail}>Detail</Badge>
                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
