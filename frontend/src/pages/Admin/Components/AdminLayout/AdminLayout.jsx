import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Products from "./ManageProducts";
import Orders from "./ManageOrders";
import ManageCustomers from "./ManageCustomers";
import Utilities from "./Utilities";
import { AdminSidebar } from "./Components/AdminSidebar/AdminSidebar";

export default function AdminRoot() {
  const [activeTab, setActiveTab] = useState("Products"); // Default to Products for this task

  return (
    <div className="admin-dashboard">
      <AdminSidebar setActiveTab={setActiveTab} activeTab={activeTab} />

      <main className="main-content">
        {activeTab === "Dashboard" && <Dashboard />}
        {activeTab === "Products" && <Products />}
        {activeTab === "Orders" && <Orders />}
        {activeTab === "Customers" && <ManageCustomers />}
        {activeTab === "Utilities" && <Utilities />}
      </main>
    </div>
  );
}
