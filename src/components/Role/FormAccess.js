import React, { useState, useEffect, useRef } from 'react'
import { Form, Button, Alert, Badge } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'

export default function FormAccess() {
    const URI_API = `${process.env.REACT_APP_SSO_URI_API}/access`
    const [applications, setApplications] = useState([])
    const [roles, setRoles] = useState([])
    const [access, setStateAccess] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { fetchQuery, logout } = useRoot()
    const history = useHistory()

    useEffect(() => {
        getRolesApplication()
    }, [])

    async function getRolesApplication() {
        setError("")
        setLoading(true)
        const query = {
            query : `query {
                roles { id, name },
                apps { id, name, menu { id, name, parent } }
                accessRole {id, role, app, menu }
            }`
        }

        fetchQuery(process.env.REACT_APP_SSO_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setStateAccess(data.body.data.accessRole)
                setRoles(data.body.data.roles)
                setApplications(data.body.data.apps)
                setError("")
            }            
        })
        setLoading(false)
    }

    function handleSubmit(e) {
        e.preventDefault()       
        setError("")
        setLoading(true) 
        const jml = e.target.length
        let arrAccess = []
        for(let i = 0; i < jml - 1; i++) {
            if(e.target[i].name === "menu[]") {
                const role = e.target[i].dataset.role            
                const app = e.target[i].dataset.app
                const isChecked = e.target[i].checked
                const menu = e.target[i].value
                if(isChecked) {
                    arrAccess.push({
                        role: role,
                        app: app,
                        menu: menu 
                    })
                }
            }
        }        
        const query = { data: arrAccess }
        fetchQuery(URI_API, query, true, "POST").then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setError("")
                window.location.reload()
            }
        })
        setLoading(false)
    }

    function setChecked(role, app, menu) {
        return access.filter(x => x.role === role && x.app === app && x.menu === menu).length > 0
    }
    
    function setCheckedRole(e) {
        document.querySelectorAll("input[name='menu[]']").forEach(x => {
            if(x.dataset.role === e.target.dataset.role) {
                x.checked = e.target.checked
            }
        })
        // return ackcess.filter(x => x.role === role && x.app === app && x.menu === menu).length > 0
    }

    return (
        <>
            <h3 className="mb-4">Setup Access Role</h3>
            { error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
            <table className="table table-bordered table-hover text-center wrap-center">
                <thead>
                    <tr>
                        <td rowSpan="3" colSpan="2">#</td>
                        {
                            applications.map(application => {                                                  
                                return <td colSpan={application.menu.filter(x=> x.parent !== null).length} key={application.id} style={{whiteSpace:"nowrap"}}>{application.name}</td>
                            })
                        }
                    </tr>
                    <tr>
                        {
                            applications.map(application => {
                                const menus = application.menu
                                { if(menus.length === 0)  return <td></td> }
                                return menus.map(menu => {   
                                    { if(menu.parent === null) return <td colSpan={menus.filter(x => x.parent === menu.name).length } key={menu.id} style={{whiteSpace:"nowrap"}}>{menu.name}</td>
                                    }
                                })
                            })
                        }
                    </tr>
                    <tr>
                        {
                            applications.map(application => {
                                const menus = application.menu
                                { if(menus.length === 0)  return <td></td> }
                                return menus.map(menu => {   
                                    { if(menu.parent !== null) return <td style={{whiteSpace:"nowrap"}} key={menu.id}>{menu.name}</td>
                                    }
                                })
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        roles.map(role => {
                            return <tr>
                                <td style={{whiteSpace: "nowrap"}}>{role.name}</td>
                                <td>
                                    <input type="checkbox" style={{marginLeft: "0"}} className="form-check-input position-static" data-role={role.name} onChange={setCheckedRole}></input>
                                </td>
                                { 
                                    applications.map(application => { 
                                        return application.menu.map((menu, index) => {
                                            { if(menu.parent !== null) return <td>
                                                <Form.Check data-role={role.name} data-app={application.name} value={menu.name} name="menu[]" defaultChecked={setChecked(role.name, application.name, menu.name)}></Form.Check>
                                            </td> }
                                        }) 
                                    })
                                } 
                            </tr>
                        })
                    }
                </tbody>
                <tfoot>

                </tfoot>
            </table>
            <Button type="submit" disabled={loading}>Mapping Access</Button>
            </Form>
        </>
    )
}
