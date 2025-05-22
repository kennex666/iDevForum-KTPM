'use client';
import React, { useState, useEffect } from 'react';
import UserTable from '@/components/admin/UserTable';

import axios from 'axios';

import { api, apiParser } from "@/constants/apiConst";


const ManageUser: React.FC = () => {
    // Mock data following the IUser interface
    const [userData, setUserData] = useState([]);
    useEffect(() => {
        const url = apiParser(api.apiPath.user.getAll);
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];
        if (!token) return;
        const fetchUserData = async () => {
            try {
                const response = await axios.get(url,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }

                );
                if(response.data.errorCode !== 200) {
                    console.error("Error fetching users:", response.data.errorMessage);
                    return;
                }
                const data = response.data.data;
                setUserData(data);

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();
    }, []);
    return (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="text-dark mb-0">User Management</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Users</li>
                                </ol>
                            </nav>
                        </div>
                        <UserTable users={userData} />
                    </div>
                </div>
                <footer className="bg-white sticky-footer">
                    <div className="container my-auto">
                        <div className="text-center my-auto copyright">
                            <span>Copyright © iDev4rum 2024</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ManageUser;