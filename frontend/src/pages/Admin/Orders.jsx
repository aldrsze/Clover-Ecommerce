import React from 'react';
import { Bell } from 'lucide-react';

export default function Orders() {
  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <div className="page-header-info">
            <span className="page-path">Sales</span>
            <h1>Orders</h1>
            <p>Manage and track your customer orders.</p>
          </div>
          <div className="page-header-actions">
            <button className="notification-trigger">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>
          </div>
        </header>
      </div>
      
      <div className="view-content">
        <div className="empty-state" style={{ textAlign: 'center', padding: '64px 0' }}>
          <p className="caption">No orders found.</p>
        </div>
      </div>
    </div>
  );
}
