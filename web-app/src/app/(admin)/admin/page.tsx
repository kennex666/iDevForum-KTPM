"use client";

import React from "react";
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
  const mockLineChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Earnings",
        data: [12000, 19000, 3000, 5000, 20000, 30000],
        borderColor: "rgba(78, 115, 223, 1)",
        backgroundColor: "rgba(78, 115, 223, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const mockDoughnutChartData = {
    labels: ["Direct", "Social", "Referral"],
    datasets: [
      {
        data: [55, 30, 15],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc"],
        hoverBackgroundColor: ["#2e59d9", "#17a673", "#2c9faf"],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      },
    ],
  };

  return (
    <div id="wrapper" className="d-flex flex-column min-vh-100">
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <div className="container-fluid">
            <h3 className="text-dark mb-4">Dashboard</h3>
            <div className="row">
              <div className="col-md-6 col-xl-3 mb-4">
                <Card
                  title="Earnings (monthly)"
                  value="$40,000"
                  icon="fas fa-calendar"
                  color="primary"
                />
              </div>
              <div className="col-md-6 col-xl-3 mb-4">
                <Card
                  title="Earnings (annual)"
                  value="$215,000"
                  icon="fas fa-dollar-sign"
                  color="primary"
                />
              </div>
              <div className="col-md-6 col-xl-3 mb-4">
                <Card
                  title="Tasks"
                  value="50%"
                  icon="fas fa-clipboard-list"
                  color="success"
                />
              </div>
              <div className="col-md-6 col-xl-3 mb-4">
                <Card
                  title="Pending Requests"
                  value="18"
                  icon="fas fa-comments"
                  color="warning"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-7 col-xl-8">
              <div className="card shadow mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="text-primary fw-bold m-0">
                    Earnings Overview
                  </h6>
                </div>
                <div className="card-body">
                  <Chart type="line" data={mockLineChartData} />
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-xl-4">
              <div className="card shadow mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="text-primary fw-bold m-0">Revenue Sources</h6>
                </div>
                <div className="card-body">
                  <Chart type="doughnut" data={mockDoughnutChartData} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card shadow mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="text-primary fw-bold m-0">Projects</h6>
                </div>
                <div className="card-body">
                  <ProgressBar progress={70} label="Project 1" />
                  <ProgressBar progress={40} label="Project 2" />
                  <ProgressBar progress={90} label="Project 3" />
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