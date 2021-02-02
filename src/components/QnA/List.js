import React, {useState} from 'react'
import { ListGroup, Badge, Button, Collapse } from 'react-bootstrap'
import { useHistory} from 'react-router-dom'

export default function List(props) {

    const {
        question,
        handleDelete
    } = props
    const history = useHistory()
    const [open, setOpen] = useState(false)
    function handleEdit(e) {
        const id = e.target.dataset.id
        const idjob = e.target.dataset.idjob
        history.push(`/qna/${idjob}/edit/${id}`)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{question.desc} 
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={question.id} data-idjob={question.jobId} onClick={handleDelete}>Delete</Badge>
                    <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={question.id} data-idjob={question.jobId} onClick={handleEdit}>Edit</Badge>
                    <Badge variant="secondary" style={{float: "right"}}>{question.type}</Badge>
                    <br />                    
                    <Button variant="link" className="btn-sm" onClick={() => setOpen(prevOpen => !prevOpen )}>{open ? "Hide" : "Show"} Options</Button>
                    <Collapse in={open}>
                        <ul>
                            {
                                question.options.length > 0 &&
                                question.options.map(option => {
                                    return <li>
                                            <p className={ option.value === true ? "text-success" : "text-danger"}>{option.desc}</p>
                                        </li>
                                })
                            }
                        </ul>
                    </Collapse>

                </ListGroup.Item>
            </ListGroup>
        </>
    )
}
