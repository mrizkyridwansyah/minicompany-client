import React, { useContext } from 'react'

const RootContext = React.createContext()

export function useRoot() {
    return useContext(RootContext)
} 

function login(username, password) {
    const uri = `${process.env.REACT_APP_SSO_URI_API}/auth/login`
    const query = {
        username: username,
        password: password
    }

    return fetchQuery(uri, query, false, "POST").then(data => {
        if(data.status !== 200) throw new Error(data.body.message)

        sessionStorage.setItem("token",data.body.token)
        sessionStorage.setItem("id",data.body.data.id)
        sessionStorage.setItem("username",data.body.data.username)
        sessionStorage.setItem("name",data.body.data.name)
        sessionStorage.setItem("email",data.body.data.email)
        sessionStorage.setItem("role",data.body.data.role)
        sessionStorage.setItem("employeeId",data.body.data.employeeId)
    })
}

function logout() {
    const uri = `${process.env.REACT_APP_SSO_URI_API}/auth/logout`
    return fetchQuery(uri, {} , true, "POST").then(data => {
        if(data.status !== 200) throw new Error(data.body.message)

        sessionStorage.removeItem("token")
        sessionStorage.removeItem("id")
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("name")
        sessionStorage.removeItem("email")
        sessionStorage.removeItem("role")
        sessionStorage.removeItem("employeeId")
    })

}

function fetchQuery(uri, query, useToken, method) {
    let options = {
        method: method,
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify(query)
    }

    if(useToken) options.headers = { "Content-Type" : "application/json", "Authorization" : `BEARER ${sessionStorage.getItem("token")}`}
    
    return fetch(uri, options).then(res => res.json().then(data => ({ status: res.status, body: data })))
}

export function RootProvider({children}) {
    const value = {
        fetchQuery,
        login,
        logout
    }

    return (
        <RootContext.Provider value={value}>
            {children}
        </RootContext.Provider>  
    )
}
