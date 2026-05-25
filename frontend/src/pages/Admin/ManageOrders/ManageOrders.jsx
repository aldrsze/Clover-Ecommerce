import { Bell } from "lucide-react";
import { Button } from "../../../components/common/Button/Button";

export default function Orders() {
  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <h1>Orders</h1>
          <div className="page-header-actions">
            <Button variant="none" className="notification-trigger">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </Button>
          </div>
        </header>
      </div>

      <div className="view-content">
          <p className="caption">No orders found.</p>
      </div>
    </div>
  );
}
