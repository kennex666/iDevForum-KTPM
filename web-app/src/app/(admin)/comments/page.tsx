"use client";

import React, { useState,useEffect } from 'react';
import Table from '@/components/admin/CommentTable';
import { api, apiParser } from '@/constants/apiConst';
import axios from 'axios';   

const ManageUser = () => {
    const [allItems, setAllItems] = useState([]);
    const [items, setItems] = useState([]);
    const [commentNegative, setCommentNegative] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const fetchDataNegative = async () => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];
        if (!token) return;
        try {
            const response = await axios(
                apiParser(api.apiPath.comment) + '/bad',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                }
            )
            const result = response.data;
            if (result.errorCode === 200) {
                setCommentNegative(result.data);
            } else {
                console.error('Error fetching data:', result.errorMessage);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiParser(api.apiPath.comment), {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const result = response.data;
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


        fetchDataNegative();
        fetchData();
    }, []);

    const handleViewAll = () => {
        setItems(allItems);
    };

    const handleViewNegative = () => {
        fetchDataNegative();
        setItems(commentNegative);
    };

    const handleFilterByDate = (days: number) => {
        const now = new Date();
    
        const filteredItems = allItems.filter((item: { createdAt: string }) => {
            const createdDate = new Date(item.createdAt);
            const diffTime = now.getTime() - createdDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24); 
            return diffDays <= days; // Chỉ lấy các bình luận trong khoảng thời gian đã chỉ định
        });
    
        setItems(filteredItems);
        setShowFilter(false);
    };

    const handleDeleteComment = async (commentId: string) => {
		const token = document.cookie
				.split("; ")
				.find((row) => row.startsWith("accessToken="))
				?.split("=")[1];
		if (!token) return;
        try {
            const response = await axios(`${apiParser(api.apiPath.comment)}/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            console.log(response);
            const result = response.data;
            if (result.errorCode === 200) {
                const updatedItems = allItems.filter((item) => item._id !== commentId);
                setAllItems(updatedItems);
                setItems(updatedItems);
                setCommentNegative((prev) => prev.filter((item) => item._id !== commentId));
            } else {
                console.error('Error deleting comment:', result.errorMessage);
            }
        }
        catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (isLoading) {
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="text-lg font-semibold">Đang tải dữ liệu, vui lòng chờ...</p>
            </div>
        </div>;
    }
    
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
                        <Table items={items} handleDeleteComment={handleDeleteComment} />
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