import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Wrench,
  Database,
  BookOpen,
  HelpCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../../../components/common/Button/Button";
import { useMemo, useState } from "react";

const MODAL_CONTENT = {
  help: {
    title: "Help",
    eyebrow: "Need a quick hand?",
    icon: HelpCircle,
    body: [
      "Use the left sidebar to switch between dashboard sections.",
      "Products, orders, customers, and utilities are designed for fast admin tasks.",
      "If a panel looks crowded, reduce the browser zoom or collapse the sidebar width with the window.",
    ],
    highlights: [
      "Refresh buttons reload the current section without leaving the page.",
      "Utilities provides a live snapshot plus local maintenance actions.",
      "Tables and cards are optimized for laptop-sized screens.",
    ],
  },
  docs: {
    title: "Docs",
    eyebrow: "Where things live",
    icon: BookOpen,
    body: [
      "Admin dashboard: overview and quick stats.",
      "Products: catalog, filtering, add/edit/delete actions, and inventory tools.",
      "Orders: search, status filtering, order details, and admin edits.",
      "Customers: customer management with edit and delete controls.",
      "Utilities: snapshot export, cache cleanup, and maintenance status.",
    ],
    highlights: [
      "Shared UI styles are in the admin component and page CSS files.",
      "Data fetching uses the API client with the current token.",
      "Modals are the primary interaction pattern for admin actions.",
    ],
  },
};

export const AdminSidebar = ({ setActiveTab, activeTab }) => {
  const [activeModal, setActiveModal] = useState(null);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Products", icon: Package },
    { name: "Orders", icon: ShoppingCart },
    { name: "Customers", icon: Users },
    { name: "Utilities", icon: Wrench },
  ];

  const modalData = useMemo(() => (activeModal ? MODAL_CONTENT[activeModal] : null), [activeModal]);

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
          </div>

          <div className="footer-meta">
            <div className="meta-links">
              <Button variant="none" className="meta-link meta-link-button" onClick={() => setActiveModal("help")}>
                Help
              </Button>
              <Button variant="none" className="meta-link meta-link-button" onClick={() => setActiveModal("docs")}>
                Docs
              </Button>
            </div>
            <span className="version">Build v1.0.0 - Aldrsze</span>
          </div>
        </div>
      </div>

      {modalData && (
        <div className="sidebar-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="sidebar-modal" role="dialog" aria-modal="true" aria-labelledby="sidebar-modal-title">
            <div className="sidebar-modal-header">
              <div className="sidebar-modal-title-group">
                <div className="sidebar-modal-icon">
                  <modalData.icon size={16} />
                </div>
                <div>
                  <p className="sidebar-modal-eyebrow">{modalData.eyebrow}</p>
                  <h2 id="sidebar-modal-title">{modalData.title}</h2>
                </div>
              </div>

              <Button variant="none" className="sidebar-modal-close" onClick={() => setActiveModal(null)} aria-label="Close modal">
                <X size={16} />
              </Button>
            </div>

            <div className="sidebar-modal-body">
              <div className="sidebar-modal-section">
                {modalData.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <div className="sidebar-modal-section sidebar-modal-section-muted">
                <h3>Quick notes</h3>
                <ul>
                  {modalData.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="sidebar-modal-footer">
              <Button variant="admin-secondary" onClick={() => setActiveModal(null)}>Close</Button>
              <Button variant="admin-primary" onClick={() => setActiveModal(null)}>
                <ExternalLink size={14} />
                <span>Got it</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
