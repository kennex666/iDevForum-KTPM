'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import PostsTable from '@/components/admin/PotsTable';
import PostReportTable from '@/components/admin/PostReportTable';
import TopicTable from '@/components/admin/TopicTable';

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
    const [activeTab, setActiveTab] = useState<'posts' | 'reports' | 'topics'>('posts');

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
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="text-dark">Posts Management</h3>
                            <div className="btn-group">
                                <button
                                    className={`btn ${activeTab === 'posts' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setActiveTab('posts')}
                                >
                                    <i className="fas fa-file-alt me-2"></i>
                                    All Posts
                                </button>
                                <button
                                    className={`btn px-4 ${activeTab === 'reports' ? 'btn-danger' : 'btn-outline-danger'}`}
                                    onClick={() => setActiveTab('reports')}
                                >
                                    <i className="fas fa-flag me-2"></i>
                                    Reported Posts
                                </button>
                                <button
                                    className={`btn ${activeTab === 'topics' ? 'btn-success' : 'btn-outline-success'}`}
                                    onClick={() => setActiveTab('topics')}
                                >
                                    <i className="fas fa-tags me-2"></i>
                                    Topics
                                </button>
                            </div>
                        </div>

                        {activeTab === 'posts' && <PostsTable posts={posts} />}
                        {activeTab === 'reports' && <PostReportTable />}
                        {activeTab === 'topics' && <TopicTable />}
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