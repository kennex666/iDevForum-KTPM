"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/admin/Card";
import ProgressBar from "@/components/admin/ProgressBar";

import axios from 'axios';

import { api, apiParser } from "@/constants/apiConst";

import { useUser } from "@/context/UserContext";
import { formatDate } from "@/app/utils/datetimeformat";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ type, data }: { type: "doughnut" | "line"; data: any }) => {
  if (type === "doughnut") {
    return <Doughnut data={data} />;
  }
  if (type === "line") {
    return <Line data={data} />;
  }
  return null;
};


interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string; tension?: number;
    fill?: boolean;
  }>;
}


const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("default");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  // const [usersData, setUsersData] = useState([]); // data ban đâu
  // const [postsData, setPostsData] = useState([]); // data ban đâu
  // const [filteredUsersData, setFilteredUsersData] = useState([]); // data để lọc
  // const [filteredPostsData, setFilteredPostsData] = useState([]); // data để lọc
  const [data, setData] = useState({
    users: [],
    posts: [],
    topics: [],
    postsReport: [],
    filteredUsers: [],
    filteredPosts: [],
    filteredTopics: [],
    filteredPostsReport: [],
  });


  const { user } = useUser();

  const getAccessToken = () => {
    const cookie = document.cookie.split("; ").find((row) => row.startsWith("accessToken="));
    return cookie ? cookie.split("=")[1] : null;
  };

  const fetchUserData = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;
      const response = await axios.get(apiParser(api.apiPath.user.getAll), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.errorCode !== 200) {
        console.error("Error fetching users:", response.data.errorMessage);
        return;
      }
      const data = response.data.data;

      setData((prevData) => ({
        ...prevData,
        users: data,
        filteredUsers: data,
      }));

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  const fetchPostData = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const response = await axios.get(apiParser(api.apiPath.post.getAll), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.errorCode !== 200) {
        console.error("Error fetching posts:", response.data.errorMessage);
        return;
      }
      const data = response.data.data;
      console.log("Posts data:", data);
      setData((prevData) => ({
        ...prevData,
        posts: data,
        filteredPosts: data,
      }));

    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  }

  const fetchTopicsData = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;
      const url = apiParser(api.apiPath.topic); // đổi uri
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.errorCode !== 200) {
        console.error("Error fetching topics:", response.data.errorMessage);
        return;
      }
      const data = response.data.data;
      
      setData((prevData) => ({
        ...prevData,
        topics: data,
        filteredTopics: data,
      }));
    } catch (error) {
      console.error("Error fetching topic data:", error);
    }
  }

  const fetchPostsReportData = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;
      
      const url = apiParser(api.apiPath.postReport.getAll);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.errorCode !== 200) {
        console.error("Error fetching posts report:", response.data.errorMessage);
        return;
      }
      const data = response.data.data;
      
      setData((prevData) => ({
        ...prevData,
        postsReport: data,
        filteredPostsReport: data.filter((report: any) => report.state === "PROCESSING"),
      }));
    } catch (error) {
      console.error("Error fetching post report data:", error);
    }
  }



  useEffect(() => {
    fetchUserData();
    fetchPostData();
    fetchTopicsData();
    fetchPostsReportData();
  }, []);


  //////
  const getTimeFilterLabel = (filter: string) => {
    switch (filter) {
      case "default":
        return "Mặc định ( 6 tháng gần đây )";
      case "7days":
        return "7 ngày qua";
      case "30days":
        return "30 ngày qua";
      case "90days":
        return "90 ngày qua";
      case "1year":
        return "1 năm qua";
      case "custom":
        return `${startDate} - ${endDate}`;
      default:
        return "Chọn thời gian";
    }
  };

  const handleApplyDateFilter = () => {
    if (startDate && endDate && isCustomDate) {
      setTimeFilter("custom");
      setShowDateModal(false);

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const newUsersData = data.users.filter((user: any) => {
        const userDate = new Date(user.createdAt)
        return userDate >= start && userDate <= end;
      });
      const newPostsData = data.posts.filter((post: any) => {
        const postDate = new Date(post.createdAt)
        return postDate >= start && postDate <= end;
      });
      const newTopicsData = data.topics.filter((topic: any) => {
        const topicDate = new Date(topic.createdAt);
        return topicDate >= start && topicDate <= end;

      });
      const newPostsReportData = data.postsReport.filter((report: any) => {
        const reportDate = new Date(report.createdAt)
        return reportDate >= start && reportDate <= end;
      });

      setData((prevData) => ({
        ...prevData,
        filteredUsers: newUsersData,
        filteredPosts: newPostsData,
        filteredTopics: newTopicsData,
        filteredPostsReport: newPostsReportData,
      }));
    } else {
      console.log("Filtering data with preset filter:", timeFilter);

      const filtered = getFilteredDataByPresetFilter(timeFilter);
      setData((prevData) => ({
        ...prevData,
        filteredUsers: filtered.filteredUsers,
        filteredPosts: filtered.filteredPosts,
        filteredTopics: filtered.filteredTopics,
        filteredPostsReport: filtered.filteredPostsReport,
      }));
      setShowDateModal(false);

    }
  };



  // lọc data theo options có sẵn
  const getFilteredDataByPresetFilter = (filter: string) => {
    const now = new Date();
    let start: Date;
    switch (filter) {
      case "7days":
        start = new Date(now);
        start.setDate(start.getDate() - 7);
        break;
      case "30days":
        start = new Date(now);
        start.setDate(start.getDate() - 30);
        break;
      case "90days":
        start = new Date(now);
        start.setDate(start.getDate() - 90);
        break;
      case "1year":
        start = new Date(now);
        start.setFullYear(start.getFullYear() - 1);
        break;
      case "default":
      default:
        start = new Date(now);
        start.setMonth(start.getMonth() - 6); // 6 tháng gần nhất
        break;
    }
    start.setHours(0, 0, 0, 0);
    now.setHours(23, 59, 59, 999);

    const filteredUsers = data.users.filter((user: any) => {
      const userDate = new Date(user.createdAt);
      return userDate >= start && userDate <= now;
    });
    const filteredPosts = data.posts.filter((post: any) => {
      const postDate = new Date(post.createdAt);
      return postDate >= start && postDate <= now;
    });
    const filteredTopics = data.topics.filter((topic: any) => {
      const topicDate = new Date(topic.createdAt);
      return topicDate >= start && topicDate <= now;
    });
    const filteredPostsReport = data.postsReport.filter((report: any) => {
      const reportDate = new Date(report.createdAt);
      return reportDate >= start && reportDate <= now;
    });
    return {
      filteredUsers,
      filteredPosts,
      filteredTopics,
      filteredPostsReport,
    }
  }


  const handleRefresh = () => {
    fetchUserData();
    fetchPostData();
    fetchPostsReportData();
    fetchTopicsData();
    setTimeFilter("default");
    setStartDate("");
    setEndDate("");
    setIsCustomDate(false);
    setShowDateModal(false);
  }




  // Hàm tính toán postCount và progress cho mỗi topic
  const getTopicPostCounts = (topics: any[], posts: any[]) => {
    if (!topics.length || !posts.length) {
      return topics.map((topic) => ({
        ...topic,
        postCount: 0,
        progress: 0,
      }));
    }

    // const maxPosts = Math.max(...topics.map((topic) => {
    //   const count = posts.filter((post) => post.tagId === topic.tagId).length;
    //   return count;
    // }), 1); 
    const maxPosts = posts.length;
    console.log("Max posts:", maxPosts);

    return topics.map((topic) => {
      const postCount = posts.filter((post) => post.tagId === topic.tagId).length;
      const progress = Math.min((postCount / maxPosts) * 100, 100);
      return {
        ...topic,
        postCount,
        progress: Number.isNaN(progress) ? 0 : Math.round(progress),
      };
    });
  };



  const mockLineChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "New Users",
        data: [120, 190, 300, 500, 200, 300],
        borderColor: "rgba(78, 115, 223, 1)",
        backgroundColor: "rgba(78, 115, 223, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "New Posts",
        data: [80, 150, 250, 400, 180, 280],
        borderColor: "rgba(28, 200, 138, 1)",
        backgroundColor: "rgba(28, 200, 138, 0.1)",
        tension: 0.4,
        fill: true,
      }
    ],
  };



  const mockDoughnutChartData = {
    labels: ["Questions", "Discussions", "Tutorials"],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc"],
        hoverBackgroundColor: ["#2e59d9", "#17a673", "#2c9faf"],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
        borderWidth: 2,
      },
    ],
  };

  // const getDoughnutChartData = (posts: any[]) => {
  //   const commentCategories = posts.reduce(
  //     (acc: { [key: string]: number }, post) => {
  //       let category = "Others";
  //       const comments = post.totalComments || 0;

  //       if (comments < 10) {
  //         category = "Ít bình luận (< 10)";
  //       } else if (comments >= 10 && comments <= 50) {
  //         category = "Trung bình (10-50)";
  //       } else {
  //         category = "Nhiều bình luận (> 50)";
  //       }

  //       acc[category] = (acc[category] || 0) + 1;
  //       return acc;
  //     },
  //     {}
  //   );
  //   const labels = Object.keys(commentCategories);
  //   const data = Object.values(commentCategories);

  //   if (labels.length === 0) {
  //     return {
  //       labels: ["No Data"],
  //       datasets: [
  //         {
  //           data: [1],
  //           backgroundColor: ["#d3d3d3"],
  //           hoverBackgroundColor: ["#a9a9a9"],
  //           hoverBorderColor: "rgba(234, 236, 244, 1)",
  //           borderWidth: 2,
  //         },
  //       ],
  //     };
  //   }
  //   const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"];
  //   const hoverColors = ["#2e59d9", "#17a673", "#2c9faf", "#f4b619"];

  //   return {
  //     labels,
  //     datasets: [
  //       {
  //         data,
  //         backgroundColor: colors.slice(0, labels.length),
  //         hoverBackgroundColor: hoverColors.slice(0, labels.length),
  //         hoverBorderColor: "rgba(234, 236, 244, 1)",
  //         borderWidth: 2,
  //       },
  //     ],
  //   };
  // };

  const getDoughnutChartData = (posts: any[],reports: any[]) => {
    const totalComments = posts.reduce((sum, post) => sum + (post.totalComments || 0), 0);
    const totalViews = posts.reduce((sum, post) => sum + (post.totalView || 0), 0);
    const totalShares = posts.reduce((sum, post) => sum + (post.totalShare || 0), 0);
    const totalReports = reports.length;

    const totalSum = totalComments + totalViews + totalShares+ totalReports;

    if (totalSum === 0) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#d3d3d3"],
            hoverBackgroundColor: ["#a9a9a9"],
            hoverBorderColor: "rgba(234, 236, 244, 1)",
            borderWidth: 2,
          },
        ],
      };
    }

    const data = [
      totalComments,
      totalViews,
      totalShares,
      totalReports
    ].map(value => (value / totalSum) * 100);

    return {
     labels: ["Total Comments", "Total Views", "Total Shares", "Total Reports"],
      datasets: [
        {
          data,
          backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
          hoverBackgroundColor: ["#2e59d9", "#17a673", "#2c9faf"],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
          borderWidth: 2,
        },
      ],
    };
  };


  const getLineChartData = (): ChartData => {
    const labels: string[] = [];
    const userCounts: number[] = [];
    const postCounts: number[] = [];
    const now = new Date();
    const start = new Date(now);
    
    start.setMonth(now.getMonth() - 5);
    start.setDate(1);
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const monthEnd = i === 5 ? now : new Date(start.getFullYear(), start.getMonth() + i + 1, 0);
      labels.push(monthStart.toLocaleString('default', { month: 'long' }));
      userCounts.push(
        data.filteredUsers.filter((user) => {
          const d = new Date(user.createdAt);
          return d >= monthStart && d <= monthEnd;
        }).length
      );
      postCounts.push(
        data.filteredPosts.filter((post) => {
          const d = new Date(post.createdAt);
          return d >= monthStart && d <= monthEnd;
        }).length
      );
    }
    return {
      labels,
      datasets: [
        { label: "New Users", data: userCounts, borderColor: "rgba(78, 115, 223, 1)", backgroundColor: "rgba(78, 115, 223, 0.1)", tension: 0.4, fill: true },
        { label: "New Posts", data: postCounts, borderColor: "rgba(28, 200, 138, 1)", backgroundColor: "rgba(28, 200, 138, 0.1)", tension: 0.4, fill: true },
      ],
    };
  };



  const handleExport = () => {
    try {
      if (!data.filteredUsers.length && !data.filteredPosts.length) {
        alert("No data to export");
        return;
      }

      const headers = ["Type", "ID", "Created At", "Details"];
      const csvRows = [
        headers,
        ...data.filteredUsers.map((user) => [
          "User",
          user._id || "N/A",
          formatDate(user.createdAt) || "N/A",
          user.username || "N/A",
        ]),
        ...data.filteredPosts.map((post) => [
          "Post",
          post._id || "N/A",
          formatDate(post.createdAt) || "N/A",
          post.title || "N/A",
        ]),
        ...data.filteredTopics.map((topic) => [
          "Topic",
          topic._id || "N/A",
          formatDate(topic.createdAt) || "N/A",
          topic.name || "N/A",
        ]),
        ...data.filteredPostsReport.map((report) => [
          "Report",
          report._id || "N/A",
          formatDate(report.createdAt) || "N/A",
          report.reason || "N/A",
        ]),
      ];

      const csvContent = "\uFEFF" +
        csvRows
          .map((row) =>
            row
              .map((cell) => `"${String(cell).replace(/"/g, '""')}"`) // Escape quotes
              .join(",")
          )
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard-data-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      alert("Export successful!");
    } catch (error) {
      alert("Export failed. Please try again.");
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };



  const getRecentActivities = () => {
    const activities: any[] = [];

    // new user
    data.filteredUsers.forEach((user: any) => {
      activities.push({
        type: "user",
        message: `New user registered: ${user.username || "Unknown User"}`,
        icon: "fas fa-user-plus text-primary",
        createdAt: new Date(user.createdAt),
      });
    });

    // new post
    const topicMap = data.filteredTopics.reduce((acc: { [key: string]: string }, topic: any) => {
      acc[topic._id] = topic.name || "Unknown Topic";
      return acc;
    }, {});

    data.filteredPosts.forEach((post: any) => {
      const topicName = topicMap[post.tagId] || "Unknown Topic";
      activities.push({
        type: "post",
        message: `New post in ${topicName}: "${post.title || "Untitled Post"}"`,
        icon: "fas fa-comment text-success",
        createdAt: new Date(post.createdAt),
      });
    });

    // new comment
    data.filteredPosts.forEach((post: any) => {
      if (post.totalComments > 0) {
        activities.push({
          type: "comment",
          message: `New comment on "${post.title || "Untitled Post"}"`,
          icon: "fas fa-reply text-info",
          createdAt: new Date(post.updatedAt || post.createdAt), // Dùng updatedAt nếu có
        });
      }
    });

    // Sắp xếp theo thời gian 
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Giới hạn tối đa 5 hoạt động
    return activities.slice(0, 5);
  };



  return (
    <div id="wrapper" className="d-flex flex-column min-vh-100 bg-gray-50">
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-dark fw-bold">Dashboard</h3>
              <div className="d-flex gap-3 align-items-center">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={() => setShowDateModal(true)}
                >
                  <i className="fas fa-calendar"></i>
                  {getTimeFilterLabel(timeFilter)}
                  <i className="fas fa-chevron-down"></i>
                </button>
                <div className="d-flex gap-2">
                  <button
                    onClick={handleExport}
                    className="btn btn-primary btn-sm">
                    <i className="fas fa-download me-1"></i> Export
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="btn btn-outline-primary btn-sm">
                    <i className="fas fa-sync-alt me-1"></i> Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Date Filter Modal */}
            {showDateModal && (
              <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Chọn khoảng thời gian</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowDateModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-4">
                        <div className="d-flex flex-column gap-2">
                          {[
                            { value: "default", label: "Mặc định ( 6 tháng gần đây )" },
                            { value: "7days", label: "7 ngày qua" },
                            { value: "30days", label: "30 ngày qua" },
                            { value: "90days", label: "90 ngày qua" },
                            { value: "1year", label: "1 năm qua" }
                          ].map((option) => (
                            <button
                              key={option.value}
                              className={`btn btn-outline-secondary text-start ${timeFilter === option.value ? "active" : ""
                                }`}
                              onClick={() => {
                                setTimeFilter(option.value);
                                setIsCustomDate(false);
                              }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="customDateCheck"
                            checked={isCustomDate}
                            onChange={(e) => setIsCustomDate(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="customDateCheck">
                            Tùy chỉnh khoảng thời gian
                          </label>
                        </div>
                      </div>
                      {isCustomDate && (
                        <div className="row g-3">
                          <div className="col-6">
                            <label className="form-label">Từ ngày</label>
                            <input
                              type="date"
                              className="form-control"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                          <div className="col-6">
                            <label className="form-label">Đến ngày</label>
                            <input
                              type="date"
                              className="form-control"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowDateModal(false)}
                      >
                        Đóng
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleApplyDateFilter}
                        disabled={isCustomDate && (!startDate || !endDate)}
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="row g-4">
              <div className="col-md-6 col-xl-3">
                <Card
                  title="Total Users"
                  value={data.filteredUsers.length}
                  icon="fas fa-users"
                  color="primary"
                // className="h-100 shadow-sm hover-shadow transition-all"
                />
              </div>
              <div className="col-md-6 col-xl-3">
                <Card
                  title="Total Posts"
                  value={data.filteredPosts.length}
                  icon="fas fa-comments"
                  color="success"
                // className="h-100 shadow-sm hover-shadow transition-all"
                />
              </div>
              <div className="col-md-6 col-xl-3">
                <Card
                  title="Active Topics"
                  value={data.filteredTopics.length}
                  icon="fas fa-list"
                  color="info"
                // className="h-100 shadow-sm hover-shadow transition-all"
                />
              </div>
              <div className="col-md-6 col-xl-3">
                <Card
                  title="Pending Reports"
                  value={data.filteredPostsReport.length}
                  icon="fas fa-flag"
                  color="warning"
                // className="h-100 shadow-sm hover-shadow transition-all"
                />
              </div>
            </div>
          </div>
          <div className="row g-4 mt-4">
            <div className="col-lg-7 col-xl-8">
              <div className="card shadow-sm border-0 rounded-lg">
                <div className="card-header bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary fw-bold m-0">
                      Forum Activity Overview
                    </h6>
                    <div className="dropdown">
                      <button className="btn btn-link text-muted" type="button" data-bs-toggle="dropdown">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">View Details</a></li>
                        <li><a className="dropdown-item" href="#">Export Data</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  {/* <Chart type="line" data={mockLineChartData} /> */}
                  <Chart type="line" data={getLineChartData()} />
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-xl-4">
              <div className="card shadow-sm border-0 rounded-lg">
                <div className="card-header bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary fw-bold m-0">Content Distribution</h6>
                    <div className="dropdown">
                      <button className="btn btn-link text-muted" type="button" data-bs-toggle="dropdown">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">View Details</a></li>
                        <li><a className="dropdown-item" href="#">Export Data</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  {/* <Chart type="doughnut" data={mockDoughnutChartData} /> */}
                  <Chart type="doughnut" data={getDoughnutChartData(data.filteredPosts, data.filteredPostsReport)} />
                </div>
              </div>
            </div>
          </div>
          <div className="row g-4 mt-4">
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 rounded-lg">
                <div className="card-header bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary fw-bold m-0">Popular Topics</h6>
                    <div className="dropdown">
                      <button className="btn btn-link text-muted" type="button" data-bs-toggle="dropdown">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">View All Topics</a></li>
                        <li><a className="dropdown-item" href="#">Export Data</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">Web Development</span>
                      <span className="text-muted small">85%</span>
                    </div>
                    <ProgressBar progress={85} label="Web Development" className="mb-3" />
                  </div>
                  {

                    // data.filteredTopics.map((topic: any) => {
                    //   const postCount = data.filteredPosts.filter((post: any) => post.tagId === topic.tagId).length;
                    //   const progress = Math.min((postCount / 100) * 100, 100);
                    //   return (
                    //     <div key={topic._id} className="mb-4">
                    //       <div className="d-flex justify-content-between align-items-center mb-1">
                    //         <span className="text-dark fw-medium">{topic.name}</span>
                    //         <span className="text-muted small">{progress}%</span>
                    //       </div>
                    //       <ProgressBar progress={progress} label={topic.name} className="mb-3" />
                    //     </div>
                    //   );
                    // })
                    data.filteredTopics.length > 0 ? (
                      getTopicPostCounts(data.filteredTopics, data.filteredPosts)
                        .sort((a, b) => b.postCount - a.postCount) // Sắp xếp theo postCount giảm dần
                        .slice(0, 6) // Giới hạn 6 topic
                        .map((topic, index) => (
                          <div key={topic._id || index} className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="text-dark fw-medium">{topic.name || "No name Topic"}</span>
                              <span className="text-muted small">{topic.progress}%</span>
                            </div>
                            <ProgressBar progress={topic.progress} label={topic.name || "Unknown Topic"} className="mb-3" />
                          </div>
                        ))
                    ) : (
                      <p className="text-muted">No topics available</p>
                    )
                  }
                  {/* <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">Mobile Development</span>
                      <span className="text-muted small">70%</span>
                    </div>
                    <ProgressBar progress={70} label="Mobile Development" className="mb-3" />
                  </div> */}
                  {/* <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">Data Science & AI</span>
                      <span className="text-muted small">60%</span>
                    </div>
                    <ProgressBar progress={60} label="Data Science & AI" className="mb-3" />
                  </div> */}
                  {/* <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">DevOps & Cloud</span>
                      <span className="text-muted small">45%</span>
                    </div>
                    <ProgressBar progress={45} label="DevOps & Cloud" />
                  </div> */}
                  {/* <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">UI/UX Design</span>
                      <span className="text-muted small">55%</span>
                    </div>
                    <ProgressBar progress={55} label="UI/UX Design" />
                  </div> */}
                  {/* <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">Cybersecurity</span>
                      <span className="text-muted small">40%</span>
                    </div>
                    <ProgressBar progress={40} label="Cybersecurity" />
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 rounded-lg">
                <div className="card-header bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-primary fw-bold m-0">Recent Activities</h6>
                    <div className="dropdown">
                      <button className="btn btn-link text-muted" type="button" data-bs-toggle="dropdown">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">View All Activities</a></li>
                        <li><a className="dropdown-item" href="#">Export Data</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  {getRecentActivities().length > 0 ? (
                    getRecentActivities().map((activity, index) => (
                      <div
                        key={index}
                        className={`activity-item d-flex align-items-center mb-3 ${index < getRecentActivities().length - 1 ? "pb-3 border-bottom" : ""
                          }`}
                      >
                        <div className={`activity-icon bg-opacity-10 rounded-circle p-2 me-3 ${activity.icon.split("text-")[1]}-bg`}>
                          <i className={activity.icon}></i>
                        </div>
                        <div>
                          <small className="text-muted">{getRelativeTime(activity.createdAt)}</small>
                          <p className="mb-0">{activity.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No recent activities available</p>
                  )}

                  {/* <div className="activity-item d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div className="activity-icon bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-user-plus text-primary"></i>
                    </div>
                    <div>
                      <small className="text-muted">2 minutes ago</small>
                      <p className="mb-0">New user registered: John Doe</p>
                    </div>
                  </div>
                  <div className="activity-item d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div className="activity-icon bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-comment text-success"></i>
                    </div>
                    <div>
                      <small className="text-muted">15 minutes ago</small>
                      <p className="mb-0">New post in Web Development: "React vs Vue"</p>
                    </div>
                  </div>
                  <div className="activity-item d-flex align-items-center">
                    <div className="activity-icon bg-info bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-reply text-info"></i>
                    </div>
                    <div>
                      <small className="text-muted">1 hour ago</small>
                      <p className="mb-0">New comment on "Getting Started with Python"</p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;