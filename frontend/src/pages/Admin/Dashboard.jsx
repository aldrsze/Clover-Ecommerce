import React from 'react';
import { Bell, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <div className="page-header-info">
            <span className="page-path">Overview</span>
            <h1>Dashboard</h1>
            <p>Welcome to your Clover Admin dashboard.</p>
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
        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          <div className="metric-item">
            <div className="caption">Total Sales</div>
            <div style={{ fontSize: '24px', fontWeight: '600' }}>$12,450.00</div>
          </div>
          <div className="metric-item">
            <div className="caption">Orders</div>
            <div style={{ fontSize: '24px', fontWeight: '600' }}>156</div>
          </div>
          <div className="metric-item">
            <div className="caption">Customers</div>
            <div style={{ fontSize: '24px', fontWeight: '600' }}>2,840</div>
          </div>
        </div>
        
        <hr className="divider" />
        
        <section>
          <h2>Recent Activity</h2>
          <p className="caption">No recent activity to show.</p>
        </section>
      </div>
    </div>
  );
}
