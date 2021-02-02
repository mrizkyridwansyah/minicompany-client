import React, { useState } from 'react'
import { ListGroup, Badge, Collapse } from 'react-bootstrap'

export default function ListMenu(props) {
    const {
        menu,
        menus,
        handleDelete,
        handleEdit
    } = props
    const [open, setOpen] = useState(false)
    const childMenus = menus.filter(x => x.parent === menu.name )
    console.log(childMenus)

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>{menu.name}
                    <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} onClick={handleDelete} data-id={menu.id}>Delete</Badge>
                    <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} onClick={handleEdit} data-id={menu.id}>Edit</Badge>
                    <Badge variant="secondary" className="ml-2" style={{float: "right", cursor: "pointer"}} onClick={() => setOpen(prevOpen => !prevOpen) }>{open ? "Hide" : "Show"} Detail</Badge>
                    <Collapse in={open}>
                        <ul className="mt-2">
                            {
                                childMenus.map(child => {
                                    return <li key={child.id}>{ child.name }
                                        <Badge variant="danger" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={child.id} onClick={handleDelete}>Delete</Badge>
                                        <Badge variant="primary" className="ml-2" style={{float: "right", cursor: "pointer"}} data-id={child.id} onClick={handleEdit}>Edit</Badge>
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
