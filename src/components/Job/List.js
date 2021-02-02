import React, { useState } from 'react'
import { Card, Badge, Button, Collapse } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import { useHistory} from 'react-router-dom'

export default function List(props) {

    const {
        job,
        handleClose,
        handlePublish
    } = props

    const [open, setOpen] = useState(false)
    const history = useHistory()

    function handleEdit(e) {
        const id = e.target.dataset.id
        history.push(`/job/edit/${id}`)
    }

    function gotoQuestion(e) {
        const id = e.target.dataset.id
        history.push(`/qna/list/${id}`)
    }

    function gotoApplications(e) {
        const id = e.target.dataset.id
        history.push(`/applications/list/${id}`)
    }

    return (
        <>
            <Card className="col-md-8 mt-3">
                <Card.Body>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Card.Title>
                                {job.type} - {job.title}
                                {/* Job Action */}
                                { job.closedFlag === "false" && window.location.pathname === "/job" && 
                                <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} onClick={handleClose} data-id={job.id}>Closed</Badge> }
                                { job.publishedFlag === "false" && window.location.pathname === "/job" && job.closedFlag === "false" && 
                                <Badge variant="success" className="ml-2" style={{float: "right", cursor: "pointer"}} onClick={handlePublish} data-id={job.id}>Published</Badge> }
                                { window.location.pathname === "/job" &&
                                <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} onClick={handleEdit} data-id={job.id}>Edit</Badge> }

                                {/* QnA Action */}
                                { window.location.pathname === "/qna" &&
                                <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} onClick={gotoQuestion} data-id={job.id}>Question</Badge> }

                                {/* Job Application Action */}
                                { window.location.pathname === "/applications" &&
                                <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} onClick={gotoApplications} data-id={job.id}>Applications</Badge> 
                                }
                            </Card.Title>
                            <Card.Subtitle className="text-muted mb-2">
                                { job.createAt }
                            </Card.Subtitle>
                            <div style={{wordBreak: 'break-all'}}>
                                <ReactMarkdown source={ job.desc } />
                            </div>
                        </div>
                    </div>
                    <Card.Text>                        
                        <Button variant="link" className="btn-sm" onClick={() => setOpen(prevOpen => !prevOpen)}>
                            {open ? "Hide Details" : "View Details"}
                        </Button>
                    </Card.Text>
                    <Collapse in={open}>
                        <div className="mt-4">
                            <ReactMarkdown children={job.requirement} allowDangerousHtml={true} />
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>      
        </>
    )
}
