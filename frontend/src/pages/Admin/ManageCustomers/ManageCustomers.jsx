import { Bell } from "lucide-react";
import { Button } from "../../../components/common/Button/Button";

export default function ManageCustomers() {
  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <div className="page-header-info">
            <span className="page-path">CRM</span>
            <h1>Customers</h1>
            <p>Manage your customer database and relationships.</p>
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
        <p className="caption">Customer management features coming soon.</p>
      </div>
    </div>
  );
}
