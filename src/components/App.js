import React from 'react'
import { RootProvider } from '../RootContext'
import PrivateRoute from './PrivateRoute';
import Topbar from './Navigation/TopBar'
import SideBar from './Navigation/Navbar'
import Home from './Home'
import Login from './Login'
import Application from './Application/Index'
import FormApplication from './Application/Forms'
import FormMenu from './Application/Menu'
import Role from './Role/Index'
import FormRole from './Role/Forms'
import FormAccess from './Role/FormAccess'
import User from './User/Index'
import FormUser from './User/Forms'
import Profile from './User/Profile'
import Job from './Job/Index'
import FormJob from './Job/Forms'
import FormJobApplication from './JobApplication/FormApplication'
import QnA from './QnA/Index'
import FormQnA from './QnA/Forms'
import Candidate from './Candidate/Index'
import FormCandidate from './Candidate/Forms'
import Division from './Division/Index'
import FormDivision from './Division/Forms'
import Department from './Department/Index'
import FormDepartment from './Department/Forms'
import Employee from './Employee/Index'
import FormEmployee from './Employee/Forms'
import Contract from './Contract/Index'
import FormContract from './Contract/Forms'
import Salary from './Salary/Index'
import FormSalary from './Salary/Forms'
import Activity from './Activity/Index'
import FormActivity from './Activity/Forms'
import Approval from './Approval/Index'
import FormApproval from './Approval/Forms'
import SetupApproval from './SetupApproval/Index'
import FormSetupApproval from './SetupApproval/Forms'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <RootProvider>
          <Switch>
            {/* Login SSO Route */}
            <PrivateRoute exact path="/" component={{ topbar: Topbar, sidebar: SideBar, content: Home}}></PrivateRoute>
            <PrivateRoute exact path="/application" component={{ topbar: Topbar, sidebar: SideBar, content: Application}}></PrivateRoute>
            <PrivateRoute path="/application/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormApplication}}></PrivateRoute>
            <PrivateRoute path="/menu/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormMenu}}></PrivateRoute>
            <PrivateRoute exact path="/role" component={{ topbar: Topbar, sidebar: SideBar, content: Role}}></PrivateRoute>
            <PrivateRoute path="/role/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormRole}}></PrivateRoute>
            <PrivateRoute path="/access" component={{ topbar: Topbar, sidebar: SideBar, content: FormAccess}}></PrivateRoute>
            <PrivateRoute exact path="/user" component={{ topbar: Topbar, sidebar: SideBar, content: User}}></PrivateRoute>
            <PrivateRoute path="/user/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormUser}}></PrivateRoute>
            <PrivateRoute path="/profile" component={{ topbar: Topbar, sidebar: SideBar, content: Profile}}></PrivateRoute>
            <Route path="/login" component={Login}></Route>
            {/* E-Reqruitment Route */}
            <PrivateRoute exact path="/job" component={{ topbar: Topbar, sidebar: SideBar, content: Job}}></PrivateRoute>
            <PrivateRoute path="/job/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormJob}}></PrivateRoute>
            <PrivateRoute exact path="/qna" component={{ topbar: Topbar, sidebar: SideBar, content: Job}}></PrivateRoute>
            <PrivateRoute path="/qna/list/:idjob" component={{ topbar: Topbar, sidebar: SideBar, content: QnA}}></PrivateRoute>
            <PrivateRoute path="/qna/:idjob/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormQnA}}></PrivateRoute>
            <PrivateRoute exact path="/candidate" component={{ topbar: Topbar, sidebar: SideBar, content: Candidate}}></PrivateRoute>
            <PrivateRoute path="/candidate/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormCandidate}}></PrivateRoute>
            <PrivateRoute exact path="/applications" component={{ topbar: Topbar, sidebar: SideBar, content: Job}}></PrivateRoute>
            <PrivateRoute path="/applications/list/:idjob" component={{ topbar: Topbar, sidebar: SideBar, content: FormJobApplication}}></PrivateRoute>
            {/* HRIS Route  */}
            <PrivateRoute exact path="/division" component={{ topbar: Topbar, sidebar: SideBar, content: Division}}></PrivateRoute>
            <PrivateRoute path="/division/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormDivision}}></PrivateRoute>
            <PrivateRoute exact path="/department" component={{ topbar: Topbar, sidebar: SideBar, content: Department}}></PrivateRoute>
            <PrivateRoute path="/department/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormDepartment}}></PrivateRoute>
            <PrivateRoute exact path="/employee" component={{ topbar: Topbar, sidebar: SideBar, content: Employee}}></PrivateRoute>
            <PrivateRoute path="/employee/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormEmployee}}></PrivateRoute>
            <PrivateRoute exact path="/contract/:idemployee" component={{ topbar: Topbar, sidebar: SideBar, content: Contract}}></PrivateRoute>
            <PrivateRoute path="/contract/:idemployee/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormContract}}></PrivateRoute>
            <PrivateRoute exact path="/salary/:idemployee" component={{ topbar: Topbar, sidebar: SideBar, content: Salary}}></PrivateRoute>
            <PrivateRoute path="/salary/:idemployee/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormSalary}}></PrivateRoute>
            <PrivateRoute exact path="/activity" component={{ topbar: Topbar, sidebar: SideBar, content: Activity}}></PrivateRoute>
            <PrivateRoute path="/activity/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormActivity}}></PrivateRoute>
            <PrivateRoute exact path="/approval" component={{ topbar: Topbar, sidebar: SideBar, content: Approval}}></PrivateRoute>
            <PrivateRoute path="/approval/detail/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormApproval}}></PrivateRoute>
            <PrivateRoute exact path="/setupapproval" component={{ topbar: Topbar, sidebar: SideBar, content: SetupApproval}}></PrivateRoute>
            <PrivateRoute path="/setupapproval/:type/:id?" component={{ topbar: Topbar, sidebar: SideBar, content: FormSetupApproval}}></PrivateRoute>
          </Switch>
        </RootProvider>
      </Router>
    </>
  );
}

export default App;
