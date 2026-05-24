import { Bell } from "lucide-react";
import { Button } from "../../../components/common/Button/Button";

export default function ManageCustomers() {
  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <h1>Customers</h1>
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
