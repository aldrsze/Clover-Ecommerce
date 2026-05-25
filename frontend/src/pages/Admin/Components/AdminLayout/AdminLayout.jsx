import React, { useState } from "react";
import Dashboard from "../../Dashboard/Dashboard";
import Products from "../../ManageProducts/ManageProducts";
import Orders from "../../ManageOrders/ManageOrders";
import ManageCustomers from "../../ManageCustomers/ManageCustomers";
import ManageMessages from "../../ManageMessages/ManageMessages";
import Utilities from "../../Utilities/Utilities";
import { AdminSidebar } from "../AdminSidebar/AdminSidebar";

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
        {activeTab === "Messages" && <ManageMessages />}
        {activeTab === "Utilities" && <Utilities />}
      </main>
    </div>
  );
}
