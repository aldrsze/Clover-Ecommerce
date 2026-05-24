import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Wrench,
  LogOut,
  Settings,
  Database,
  ShieldCheck,
  Cloud,
} from "lucide-react";
import { Button } from "../../../../components/common/Button/Button";

export const AdminSidebar = ({ setActiveTab, activeTab }) => {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Products", icon: Package },
    { name: "Orders", icon: ShoppingCart },
    { name: "Customers", icon: Users },
    { name: "Utilities", icon: Wrench },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <img
          src="/images/brand/clover-logo.png"
          alt="Clover Logo"
          className="admin-sidebar-logo"
        />
        <span>Clover Admin</span>
      </div>

      <div className="admin-sidebar-content">
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant="admin-secondary"
                className={`nav-item ${activeTab === item.name ? "is-active" : ""}`}
                onClick={() => setActiveTab(item.name)}
              >
                <Icon strokeWidth={2} />
                <span>{item.name}</span>
              </Button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
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
              <div className="progress-bar-fill" style={{ width: "75%" }}></div>
            </div>

            <div className="label-group" style={{ marginTop: "12px" }}>
              <span className="status-title">Storage Usage</span>
              <span className="status-value">42.8 GB / 100 GB</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: "42.8%", backgroundColor: "#737373" }}
              ></div>
            </div>
          </div>

          <div className="user-profile-container">
            <div className="user-profile">
              <div className="user-avatar">AJ</div>
              <div className="user-info">
                <span className="user-name">Aldrin J.</span>
                <span className="user-role">Super Admin</span>
              </div>
              <Button variant="none" className="profile-settings">
                <Settings size={14} />
              </Button>
            </div>
          </div>

          <div className="admin-sidebar-actions">
            <Button variant="admin-secondary" className="action-item logout">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
            <Button variant="admin-secondary" className="action-item security">
              <ShieldCheck size={16} />
              <span>Security</span>
            </Button>
          </div>

          <div className="footer-meta">
            <div className="meta-links">
              <a href="#" className="meta-link">
                Help
              </a>
              <a href="#" className="meta-link">
                Docs
              </a>
              <a href="#" className="meta-link">
                API
              </a>
            </div>
            <span className="version">Build v1.0.4 - Production</span>
          </div>
        </div>
      </div>
    </div>
  );
};
