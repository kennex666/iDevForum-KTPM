'use client';
import React from 'react';
import UserTable from '@/components/admin/UserTable';

const ManageUser: React.FC = () => {
    // Mock data following the IUser interface
    const users = [
        {
            _id: '1',
            name: 'John Doe',
            role: 1,
            accountState: 'ACTIVE',
            coverPicture: '/images/covers/cover1.jpg',
            description: 'Senior Developer with 5+ years of experience',
            username: 'johndoe',
            email: 'john.doe@example.com',
            title: 'Senior Developer',
            password: '', // Not displayed in UI
            profilePicture: 'https://picsum.photos/200',
            bio: 'Passionate about web development and new technologies',
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2024-01-15')
        },
        {
            _id: '2',
            name: 'Jane Smith',
            role: 0,
            accountState: 'ACTIVE',
            coverPicture: '/images/covers/cover2.jpg',
            description: 'UI/UX Designer',
            username: 'janesmith',
            email: 'jane.smith@example.com',
            title: 'UI/UX Designer',
            password: '', // Not displayed in UI
            profilePicture: 'https://picsum.photos/200',
            bio: 'Creating beautiful and intuitive user interfaces',
            createdAt: new Date('2023-02-15'),
            updatedAt: new Date('2024-01-20')
        },
        {
            _id: '3',
            name: 'Mike Johnson',
            role: 0,
            accountState: 'BANNED',
            coverPicture: '/images/covers/cover3.jpg',
            description: 'Content Creator',
            username: 'mikejohnson',
            email: 'mike.johnson@example.com',
            title: 'Content Specialist',
            password: '', // Not displayed in UI
            profilePicture: 'https://picsum.photos/200',
            bio: 'Sharing knowledge through engaging content',
            createdAt: new Date('2023-03-20'),
            updatedAt: new Date('2024-01-10')
        },
        {
            _id: '4',
            name: 'Sarah Wilson',
            role: 0,
            accountState: 'WAIT_FOR_ACTIVATION',
            coverPicture: '/images/covers/cover4.jpg',
            description: 'New member',
            username: 'sarahwilson',
            email: 'sarah.wilson@example.com',
            title: 'Frontend Developer',
            password: '', // Not displayed in UI
            profilePicture: 'https://picsum.photos/200',
            bio: 'Learning and growing in web development',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01')
        }
    ];

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
                        <UserTable users={users} />
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