"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/admin/Card";
import ProgressBar from "@/components/admin/ProgressBar";
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

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("default");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

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
    if (startDate && endDate) {
      setTimeFilter("custom");
      setShowDateModal(false);
      // Thực hiện lọc dữ liệu ở đây
      console.log("Filtering data from", startDate, "to", endDate);
    }
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
                  <button className="btn btn-primary btn-sm">
                    <i className="fas fa-download me-1"></i> Export
                  </button>
                  <button className="btn btn-outline-primary btn-sm">
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
                              className={`btn btn-outline-secondary text-start ${
                                timeFilter === option.value ? "active" : ""
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
                  value="1,234"
                  icon="fas fa-users"
                  color="primary"
                  className="h-100 shadow-sm hover-shadow transition-all"
                />
              </div>
              <div className="col-md-6 col-xl-3">
                <Card
                  title="Total Posts"
                  value="5,678"
                  icon="fas fa-comments"
                  color="success"
                  className="h-100 shadow-sm hover-shadow transition-all"
                />
              </div>
              <div className="col-md-6 col-xl-3">
                <Card
                  title="Active Topics"
                  value="89"
                  icon="fas fa-list"
                  color="info"
                  className="h-100 shadow-sm hover-shadow transition-all"
                />
              </div>
              <div className="col-md-6 col-xl-3">
                <Card
                  title="Pending Reports"
                  value="12"
                  icon="fas fa-flag"
                  color="warning"
                  className="h-100 shadow-sm hover-shadow transition-all"
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
                  <Chart type="line" data={mockLineChartData} />
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
                  <Chart type="doughnut" data={mockDoughnutChartData} />
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
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">Mobile Development</span>
                      <span className="text-muted small">70%</span>
                    </div>
                    <ProgressBar progress={70} label="Mobile Development" className="mb-3" />
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">Data Science & AI</span>
                      <span className="text-muted small">60%</span>
                    </div>
                    <ProgressBar progress={60} label="Data Science & AI" className="mb-3" />
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">DevOps & Cloud</span>
                      <span className="text-muted small">45%</span>
                    </div>
                    <ProgressBar progress={45} label="DevOps & Cloud" />
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">UI/UX Design</span>
                      <span className="text-muted small">55%</span>
                    </div>
                    <ProgressBar progress={55} label="UI/UX Design" />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-dark fw-medium">Cybersecurity</span>
                      <span className="text-muted small">40%</span>
                    </div>
                    <ProgressBar progress={40} label="Cybersecurity" />
                  </div>
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
                  <div className="activity-item d-flex align-items-center mb-3 pb-3 border-bottom">
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
                  </div>
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