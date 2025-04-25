'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import PostsTable from '@/components/admin/PotsTable';

interface Post {
    _id: string;
    postId: string;
    title: string;
    description: string;
    content: string;
    url: string;
    status: string;
    totalComments: number;
    totalUpvote: number;
    totalDownvote: number;
    totalShare: number;
    totalView: number;
    userId: string;
    tagId: string;
    createdAt: string;
    updatedAt: string;
}

const ManagePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3002');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                if (result.errorCode === 200) {
                    setPosts(result.data);
                    console.log(result.data);
                } else {
                    console.error('Error fetching data:', result.errorMessage);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        <h3 className="text-dark mb-4">Posts Management</h3>
                        <PostsTable posts={posts} />
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

export default ManagePosts;