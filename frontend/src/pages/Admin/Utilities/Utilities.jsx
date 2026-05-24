import { Bell } from "lucide-react";
import { Button } from "../../../components/common/Button/Button";

export default function Utilities() {
  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <div className="page-header-info">
            <span className="page-path">System</span>
            <h1>Utilities</h1>
            <p>System configuration and maintenance tools.</p>
          </div>
          <div className="page-header-actions">
            <Button variant="none" className="notification-trigger">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </Button>
          </div>
        </header>
      </div>
      <div className="view-content">
        <p className="caption">System utilities and settings coming soon.</p>
      </div>
    </div>
  );
}
