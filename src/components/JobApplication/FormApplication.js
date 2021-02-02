import React, {useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import List from './List'
import DetailJob from './DetailJob'
import { useParams, useHistory } from 'react-router-dom'
import { useRoot } from '../../RootContext'

export default function FormApplication() {
    const URI_API = `${process.env.REACT_APP_REQRUITMENT_URI_API}/application/updatestatus`
    const { idjob } = useParams()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [currentJob, setCurrentJob] = useState({})
    const [jobApplications, setJobApplications] = useState([])
    const history = useHistory()
    const { fetchQuery, logout } = useRoot()

    function getData() {
        setError("")
        setLoading(false)
        const query = {
            query: `query {
                jobApplications (jobId: "${idjob}"){ 
                    id, 
                    candidate { id, email, name, status } 
                },
                job (id: "${idjob}") { title, desc, requirement, type, minRate, maxRate }
            }`
        }

        fetchQuery(process.env.REACT_APP_REQRUITMENT_URI_GRAPHQL, query, true, "POST").then(async(data) => {
            if(data.status !== 200) {
                if(data.status === 403) {
                    await logout()
                    history.push("/login")
                } 
                setError(data.body.message)
            } else {
                setCurrentJob(data.body.data.job)
                setJobApplications(data.body.data.jobApplications)
                setError("")
            }            
        })
        setLoading(false)
    }

    function handleStatus(e) {
        if(window.confirm(`Are you sure want to update this job application?`)) {
            const status = e.target.dataset.status
            const applicationId = e.target.dataset.app        

            setLoading(true)
            setError("")
            fetchQuery(`${URI_API}/${applicationId}`, { status: status }, true, "PUT").then(async(data) => {
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
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <h3 className="mb-3">Job Application</h3>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="applications-tab" data-toggle="tab" href="#applications" role="tab" aria-controls="applications" aria-selected="true">Applications</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="detail-job-tab" data-toggle="tab" href="#detail-job" role="tab" aria-controls="detail-job" aria-selected="false">Detail Job</a>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="applications" role="tabpanel" aria-labelledby="applications-tab">
                {                        
                        jobApplications.length > 0 ? 
                        <Card style={{ width: '40em' }} className="mt-4">
                            { 
                                jobApplications.map(application => {
                                    return <List key={application.id} application={application} prevUrl={window.location.pathname} handleStatus={handleStatus}></List>
                                })
                            }
                        </Card>
                        : 
                        <div className="mt-4 text-weight text-muted col-md-6 text-center">
                            <span>No Data</span>
                        </div>
                    }
                </div>
                <div className="tab-pane fade" id="detail-job" role="tabpanel" aria-labelledby="detail-job-tab">
                    <DetailJob key={idjob} currentJob={currentJob} ></DetailJob>
                </div>
            </div>    
        </>
    )
}
