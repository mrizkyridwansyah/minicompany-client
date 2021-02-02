import React, { useState, useEffect }  from 'react'
import { useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'

export default function TopBar() {
    const [error, setError] = useState('')
    const [currentUserName, setCurrentUserName] = useState("")
    const [currentUserRole, setCurrentUserRole] = useState("")
    const { logout } = useRoot()
    const history = useHistory()

    async function handleLogOut() {
        try {
            setError("")            
            await logout();
            history.push('/login')
        } catch(err){
            setError(err.message)
            alert(error)
        }
    }

    useEffect(() => {
        setCurrentUserName(sessionStorage.getItem("name"))
        setCurrentUserRole(sessionStorage.getItem("role"))
    }, [])

    return (
        <>
            <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="/">my Apps</a>
                <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> { currentUserName } - { currentUserRole }</a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown" style={{position: "absolute"}}>
                            <a className="dropdown-item" href="/profile">Profile</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" onClick={handleLogOut}>Log Out</a>
                        </div>
                    </li>
                </ul>
            </nav>
        </>
    )
}
