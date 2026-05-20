import React from 'react';

export default function Orders() {
  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <div className="page-header-info">
            <h1>Orders</h1>
            <p>Manage and track your customer orders.</p>
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
