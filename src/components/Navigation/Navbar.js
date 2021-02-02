import React from 'react'
import { Nav } from 'react-bootstrap'
import '../../App.css';

export default function Navigation() {
    return (
        // <>
        //     <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse" id="sidebarMenu" style={{overflowY : "auto"}}>
        //         <div className="sidebar-sticky">
        //             <ul className="nav flex-column">
        //                 <li className="nav-item">
        //                     <Nav.Link>
        //                         <i className="fa fa-bar-chart fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Dashboard</span>
        //                     </Nav.Link>
        //                 </li>
        //             </ul>
        //             {/* Recruitment */}
        //             {/* <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
        //                 <span>E-Reqruitment</span>
        //             </h6>
        //             <ul className="nav flex-column">
        //                 <li className="nav-item">
        //                     <Nav.Link href="/job">
        //                         <i className="fa fa-database fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Job</span>
        //                     </Nav.Link>
        //                 </li>
        //                 <li className="nav-item">
        //                     <Nav.Link href="/qna">
        //                         <i className="fa fa-question-circle fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Setup Online Test</span>
        //                     </Nav.Link>
        //                 </li>
        //                 <li className="nav-item">
        //                     <Nav.Link href="/candidate">
        //                         <i className="fa fa-users fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Candidate</span>
        //                     </Nav.Link>
        //                 </li>
        //                 <li className="nav-item">
        //                     <Nav.Link href="/applications">
        //                         <i className="fa fa-archive fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Applications</span>
        //                     </Nav.Link>
        //                 </li>
        //             </ul> */}
        //             {/* HRIS */}
        //             {/* <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
        //                 <span>Human Resource</span>
        //             </h6>
        //             <ul className="nav flex-column">
        //                 <li className="nav-item">
        //                     <Nav.Link href="/employee">
        //                         <i className="fa fa-users fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Employee</span>
        //                     </Nav.Link>
        //                 </li>
        //                 <li className="nav-item">
        //                     <Nav.Link href="/activity">
        //                         <i className="fa fa-th-list fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Activity</span>
        //                     </Nav.Link>
        //                 </li>
        //                 <li className="nav-item">
        //                     <Nav.Link href="/approval">
        //                         <i className="fa fa-check-circle fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Approval</span>
        //                     </Nav.Link>
        //                 </li>
        //             </ul> */}
        //             {/* Accounting */}
        //             <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
        //                 <span>Accounting</span>
        //             </h6>
        //             <ul className="nav flex-column">
        //                 <li className="nav-item">
        //                     <Nav.Link>
        //                         <i className="fa fa-bank fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Account</span>
        //                     </Nav.Link>
        //                 </li>
        //                 <li className="nav-item">
        //                     <Nav.Link>
        //                         <i className="fa fa-link fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Link Account</span>
        //                     </Nav.Link>
        //                 </li>
        //                 <li className="nav-item">
        //                     <Nav.Link>
        //                         <i className="fa fa-check-circle fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Closing</span>
        //                     </Nav.Link>
        //                 </li>
        //                 <li className="nav-item">
        //                     <Nav.Link>
        //                         <i className="fa fa-file-text fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Report</span>
        //                     </Nav.Link>
        //                 </li>
        //             </ul>
        //             {/* HRIS Setup */}
        //             {/* <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
        //                 <span>Setup Human Resource</span>
        //             </h6>
        //             <ul className="nav flex-column">
        //                 <li className="nav-item">
        //                     <Nav.Link href="/division">
        //                         <i className="fa fa-database fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Division</span>
        //                     </Nav.Link>
        //                 </li>
        //                 <li className="nav-item">
        //                     <Nav.Link href="/department">
        //                         <i className="fa fa-database fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Department</span>
        //                     </Nav.Link>
        //                 </li>
        //                 <li className="nav-item">
        //                     <Nav.Link href="/setupapproval">
        //                         <i className="fa fa-cog fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Approval</span>
        //                     </Nav.Link>
        //                 </li>
        //             </ul> */}
        //             {/* Setting */}
        //             <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
        //                 <span>Settings (Sys-Master)</span>
        //             </h6>
        //             <ul className="nav flex-column">
        //                 {/* <li className="nav-item">
        //                     <Nav.Link href="/application">
        //                         <i className="fa fa-cog fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Application</span>
        //                     </Nav.Link>
        //                 </li> */}
        //                 <li className="nav-item">
        //                     <Nav.Link href="/role">
        //                         <i className="fa fa-cog fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Role</span>
        //                     </Nav.Link>
        //                 </li>
        //                 {/* <li className="nav-item">
        //                     <Nav.Link href="/access">
        //                         <i className="fa fa-cog fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Access Role</span>
        //                     </Nav.Link>
        //                 </li> */}
        //                 <li className="nav-item">
        //                     <Nav.Link href="/user">
        //                         <i className="fa fa-user fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">User</span>
        //                     </Nav.Link>
        //                 </li>
        //             </ul>
        //         </div>
        //     </nav>                    
        // </>
        <>
            <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse" id="sidebarMenu" style={{overflowY : "auto"}}>
                <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-bar-chart fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Dashboard</span>
                            </Nav.Link>
                        </li>
                    </ul>
                    {/* Cash Book */}
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
                        <span>Cash Book</span>
                    </h6>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-indent fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Penerimaan</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-outdent fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Pengeluaran</span>
                            </Nav.Link>
                        </li>
                    </ul>
                    {/* Pembelian */}
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
                        <span>Pembelian</span>
                    </h6>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-bank fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Pemasok</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-shopping-cart fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Pesanan</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-indent fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Penerimaan</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-undo fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Retur</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-book fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Faktur</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-usd fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Pembayaran</span>
                            </Nav.Link>
                        </li>
                    </ul>
                    {/* Penjualan */}
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
                        <span>Penjualan</span>
                    </h6>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-bank fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Pelanggan</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-outdent fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Pengiriman</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-undo fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Retur</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-book fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Faktur</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-usd fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Penerimaan</span>
                            </Nav.Link>
                        </li>
                    </ul>
                    {/* Accounting */}
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
                        <span>Accounting</span>
                    </h6>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-bank fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Account</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-book fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Jurnal</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-check-circle fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Closing</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-file-text fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Report</span>
                            </Nav.Link>
                        </li>
                    </ul>
                    {/* Persediaan */}
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
                        <span>Persediaan</span>
                    </h6>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-cog fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Satuan Barang</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link>
                                <i className="fa fa-archive fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Barang</span>
                            </Nav.Link>
                        </li>
                    </ul>
                    {/* Setting Perusahaan */}
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
                        <span>Setup Perusahaan</span>
                    </h6>
                    <ul className="nav flex-column">
                        {/* <li className="nav-item">
                            <Nav.Link href="/role">
                                <i className="fa fa-cog fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Data Perusahaan</span>
                            </Nav.Link>
                        </li> */}
                        <li className="nav-item">
                            <Nav.Link href="/role">
                                <i className="fa fa-database fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Project</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link href="/role">
                                <i className="fa fa-list-ol fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Numerator</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link href="/role">
                                <i className="fa fa-cog fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Params</span>
                            </Nav.Link>
                        </li>
                    </ul>
                    {/* Setting */}
                    <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted">
                        <span>Settings (Sys-Master)</span>
                    </h6>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Nav.Link href="/role">
                                <i className="fa fa-cog fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">Role</span>
                            </Nav.Link>
                        </li>
                        <li className="nav-item">
                            <Nav.Link href="/user">
                                <i className="fa fa-user fa-fw fa-lg" aria-hidden="true"></i>&nbsp; <span className="text-weight">User</span>
                            </Nav.Link>
                        </li>
                    </ul>
                </div>
            </nav>                    
        </>
    )
}
