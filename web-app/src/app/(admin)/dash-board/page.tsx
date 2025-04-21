"use client";

import Navbar from "@/components/admin/Navbar";
import Card from "@/components/admin/Card";
import React from "react";

function Dashboard() {
  const activeTab = "dashboard";
  return (
    <div className="container-fluid d-flex flex-column p-0">
      <Navbar />
      <div className="container-fluid flex-grow-1 d-flex flex-column p-4">
        <h3 className="text-2xl text-gray-800 font-bold mb-4">Dashboard</h3>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 xl:w-1/4 px-2 mb-4">
            <Card title="Total Users" value="1,234" icon="users" color="primary" />
          </div>
          <div className="w-full md:w-1/2 xl:w-1/4 px-2 mb-4">
            <Card title="Total Users" value="1,234" icon="users" color="primary" />
          </div>
          <div className="w-full md:w-1/2 xl:w-1/4 px-2 mb-4">
            <Card title="Total Users" value="1,234" icon="users" color="primary" />
          </div>
          <div className="w-full md:w-1/2 xl:w-1/4 px-2 mb-4">
            <Card title="Total Users" value="1,234" icon="users" color="primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;