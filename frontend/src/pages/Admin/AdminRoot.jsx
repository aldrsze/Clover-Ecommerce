import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Wrench,
  LogOut,
  Bell,
  Settings,
  Database,
  ShieldCheck,
  Cloud
} from 'lucide-react';
import './Admin.css';
import Dashboard from './Dashboard';
import Products from './Products';
import Orders from './Orders';

export default function AdminRoot() {
  const [activeTab, setActiveTab] = useState('Products'); // Default to Products for this task

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Products', icon: Package },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Customers', icon: Users },
    { name: 'Utilities', icon: Wrench },
  ];

  return (
    <div className="admin-dashboard">
      <style>{`
        html, body, #root { 
          margin: 0 !important; 
          padding: 0 !important; 
          width: 100vw !important; 
          height: 100vh !important;
          max-width: 100vw !important;
          border: none !important;
        }
      `}</style>
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/images/clover-logo.png" alt="Clover Logo" className="sidebar-logo" />
          <span>Clover Admin</span>
        </div>
        
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.name}
                  className={`nav-item ${activeTab === item.name ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(item.name)}
                >
                  <Icon strokeWidth={2} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="system-health">
              <div className="health-item">
                <div className="health-label">
                  <Database size={12} />
                  <span>Database</span>
                </div>
                <span className="health-status status-ok">Connected</span>
              </div>
              <div className="health-item">
                <div className="health-label">
                  <Cloud size={12} />
                  <span>API Gateway</span>
                </div>
                <span className="health-status status-ok">99.9%</span>
              </div>
            </div>

            <div className="system-status">
              <div className="label-group">
                <span className="status-title">Monthly Sales Goal</span>
                <span className="status-value">75%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '75%' }}></div>
              </div>
              
              <div className="label-group" style={{ marginTop: '12px' }}>
                <span className="status-title">Storage Usage</span>
                <span className="status-value">42.8 GB / 100 GB</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '42.8%', backgroundColor: '#737373' }}></div>
              </div>
            </div>

            <div className="user-profile-container">
              <div className="user-profile">
                <div className="user-avatar">AJ</div>
                <div className="user-info">
                  <span className="user-name">Aldrin J.</span>
                  <span className="user-role">Super Admin</span>
                </div>
                <button className="profile-settings">
                  <Settings size={14} />
                </button>
              </div>
            </div>

            <div className="sidebar-actions">
              <button className="action-item logout">
                <LogOut size={16} strokeWidth={2} />
                <span>Sign Out</span>
              </button>
              <button className="action-item security">
                <ShieldCheck size={16} strokeWidth={2} />
                <span>Security</span>
              </button>
            </div>

            <div className="footer-meta">
              <div className="meta-links">
                <a href="#" className="meta-link">Help</a>
                <a href="#" className="meta-link">Docs</a>
                <a href="#" className="meta-link">API</a>
              </div>
              <span className="version">Build v1.0.4 - Production</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="main-header-actions">
          <button className="notification-trigger">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
        </div>
        {activeTab === 'Dashboard' && <Dashboard />}
        {activeTab === 'Products' && <Products />}
        {activeTab === 'Orders' && <Orders />}
        {activeTab === 'Customers' && <div className="page-header"><h1>Customers</h1><p>Manage your customers here.</p></div>}
        {activeTab === 'Utilities' && <div className="page-header"><h1>Utilities</h1><p>System settings and utilities.</p></div>}
      </main>
    </div>
  );
}
