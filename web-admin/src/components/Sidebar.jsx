import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <nav className="navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0">
            <div className="container-fluid d-flex flex-column p-0">
                <a className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="#">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-laugh-wink"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">
                        <span>iDev4rum</span>
                    </div>
                </a>
                <hr className="sidebar-divider my-0" />
                <ul className="navbar-nav text-light" id="accordionSidebar">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/dashboard">
                            <i className="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/profile">
                            <i className="fas fa-user"></i>
                            <span>Profile</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/manage-user">
                            <i className="fas fa-table"></i>
                            <span>Table</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">
                            <i className="far fa-user-circle"></i>
                            <span>Login</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">
                            <i className="fas fa-user-circle"></i>
                            <span>Register</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/forgot-password">
                            <i className="fas fa-key"></i>
                            <span>Forgotten Password</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/404">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>Page Not Found</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/blank">
                            <i className="fas fa-window-maximize"></i>
                            <span>Blank Page</span>
                        </Link>
                    </li>
                </ul>
                <div className="text-center d-none d-md-inline">
                    <button className="btn rounded-circle border-0" id="sidebarToggle" type="button"></button>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;