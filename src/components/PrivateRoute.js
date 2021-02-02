import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export default function PrivateRoute({ component: Component, ...rest}) {    
    return (
        <Route
        {...rest}
            render={props => {
                    return sessionStorage.getItem('token') !== null ? 
                    <>
                        <Component.topbar {...props} />
                        <div className="container-fluid mb-5" style={{overflowY: "auto"}}>
                            <div className="row mb-5">
                                <Component.sidebar {...props} />
                                <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
                                    <div className="row" style={{minHeight: "80vh"}}>
                                        <div className="col-md-12">
                                            <div className="mt-5">
                                                <Component.content {...props} />
                                            </div>
                                        </div>
                                    </div>
                                </main>
                            </div>
                        </div>
                        <footer className="mastfoot text-center bg-dark mb-0 py-1" style={{position: "fixed"}}>
                            <div className="inner">
                            <p>Cover template for <a href="https://getbootstrap.com/">Bootstrap</a>, by <a href="https://www.instagram.com/mrizkyridwansyah">M. Rizky Ridwansyah</a>.</p>
                            </div>
                        </footer>
                    </>
                    : <Redirect to="/login" />
                }
            }
        >
        </Route>
    )
}
