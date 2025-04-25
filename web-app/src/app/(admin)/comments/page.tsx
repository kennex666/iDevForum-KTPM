"use client";

import React, { useState,useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import Table from '@/components/admin/CommentTable';

const ManageUser = () => {
    const [allItems, setAllItems] = useState([]);
    const [items, setItems] = useState([]);
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                if (result.errorCode === 200) {
                    setItems(result.data);
                    setAllItems(result.data);
                } else {
                    console.error('Error fetching data:', result.errorMessage);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleViewAll = () => {
        setItems(allItems);
    };

    const handleViewNegative = () => {
        // Giả lập bình luận tiêu cực bằng cách lọc các bình luận có từ khóa tiêu cực
        const negativeComments = allItems.filter(item => 
            item.content.toLowerCase().includes('mới') || 
            item.content.toLowerCase().includes('chưa') ||
            item.content.toLowerCase().includes('lỗi')
        );
        setItems(negativeComments);
    };

    const handleFilterByDate = (days: number) => {
        const today = new Date();
        const filteredItems = allItems.filter(item => {
            const commentDate = new Date(item.commentDate);
            const diffTime = Math.abs(today.getTime() - commentDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= days;
        });
        setItems(filteredItems);
        setShowFilter(false);
    };

    return (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        <div className="d-flex justify-content-between align-items-center py-4">
                            <div className="d-flex gap-3">
                                <button 
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                    onClick={handleViewAll}
                                >
                                    <i className="fas fa-list"></i>
                                    Xem tất cả
                                </button>
                                <button 
                                    className="btn btn-danger d-flex align-items-center gap-2"
                                    onClick={handleViewNegative}
                                >
                                    <i className="fas fa-exclamation-triangle"></i>
                                    Bình luận tiêu cực
                                </button>
                            </div>
                            <div className="d-flex gap-2 relative">
                                <button 
                                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                                    onClick={() => setShowFilter(!showFilter)}
                                >
                                    <i className="fas fa-filter"></i>
                                    Lọc
                                </button>
                                {showFilter && (
                                    <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                        <div className="py-1" role="menu" aria-orientation="vertical">
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleFilterByDate(7)}
                                            >
                                                Trong 7 ngày qua
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleFilterByDate(30)}
                                            >
                                                Trong 30 ngày qua
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleFilterByDate(90)}
                                            >
                                                Trong 90 ngày qua
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Table items={items} />
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