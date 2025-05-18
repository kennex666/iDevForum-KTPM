"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const pathname = usePathname(); 
    const isActive = (path: string) => pathname === path ? 'active' : '';

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
                        <Link className={`nav-link ${isActive('/admin')}`} href="/dashboard">
                            <i className="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive('/users')}`} href="/users">
                            <i className="fas fa-user"></i>
                            <span>Manage Users</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive('/posts')}`} href="/posts">
                            <i className="fas fa-file-alt"></i>
                            <span>Manage Posts</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive('/comments')}`} href="/comments">
                            <i className="fas fa-comments"></i>
                            <span>Manage Comments</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/home">
                            <i className="fas fa-window-maximize"></i>
                            <span>Back to home</span>
                        </a>
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