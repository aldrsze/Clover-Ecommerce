import React from 'react';

export default function Orders() {
  return (
    <div className="orders-view">
      <header className="page-header">
        <div className="page-header-info">
          <h1>Orders</h1>
          <p>Manage and track your customer orders.</p>
        </div>
      </header>
      
      <div className="empty-state" style={{ textAlign: 'center', padding: '64px 0' }}>
        <p className="caption">No orders found.</p>
      </div>
    </div>
  );
}
