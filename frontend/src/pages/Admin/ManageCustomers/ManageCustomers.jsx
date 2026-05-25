import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Loader2,
  Mail,
  Pencil,
  Phone,
  RefreshCw,
  Save,
  Search,
  Trash,
  Users,
  X,
} from "lucide-react";
import { Button } from "../../../components/common/Button/Button";
import { customerService } from "../../../api/customerService";
import toast from "react-hot-toast";
import "./ManageCustomers.css";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No orders yet";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

function EditCustomerModal({ customer, formData, setFormData, onClose, onSave, isSaving }) {
  return (
    <div className="admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal customer-modal">
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-eyebrow">Edit customer</p>
            <h2>{customer.first_name} {customer.last_name}</h2>
          </div>
          <Button variant="none" className="admin-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </Button>
        </div>

        <div className="admin-modal-body">
          <div className="form-grid two-col">
            <label className="field">
              <span>First name</span>
              <input
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="First name"
              />
            </label>
            <label className="field">
              <span>Last name</span>
              <input
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last name"
              />
            </label>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="name@example.com"
            />
          </label>

          <label className="field">
            <span>Phone number</span>
            <input
              value={formData.phoneNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="09xx xxx xxxx"
            />
          </label>
        </div>

        <div className="admin-modal-actions">
          <Button variant="admin-secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="admin-primary" onClick={onSave} disabled={isSaving}>
            {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
            <span>{isSaving ? "Saving" : "Save changes"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeleteCustomerModal({ customer, onClose, onConfirm, isDeleting }) {
  return (
    <div className="admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal delete-modal">
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-eyebrow danger">Delete customer</p>
            <h2>{customer.first_name} {customer.last_name}</h2>
          </div>
          <Button variant="none" className="admin-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </Button>
        </div>

        <div className="admin-modal-body">
          <p className="delete-warning">
            This will permanently remove the customer record. Their orders will remain, but the customer reference will be cleared.
          </p>
          <div className="delete-preview">
            <strong>{customer.first_name} {customer.last_name}</strong>
            <span>{customer.email}</span>
          </div>
        </div>

        <div className="admin-modal-actions">
          <Button variant="admin-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="admin-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? <Loader2 size={16} className="spin" /> : <Trash size={16} />}
            <span>{isDeleting ? "Deleting" : "Delete customer"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCustomers = async (showSpinner = true) => {
    try {
      if (showSpinner) setIsLoading(true);
      else setIsRefreshing(true);

      const data = await customerService.getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.message || "Failed to load customers.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomers(true);
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      const searchable = [
        customer.first_name,
        customer.last_name,
        customer.email,
        customer.phone_number,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [customers, searchQuery]);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((customer) => Number(customer.order_count || 0) > 0).length;
  const dormantCustomers = totalCustomers - activeCustomers;
  const totalRevenue = customers.reduce((sum, customer) => sum + Number(customer.total_spent || 0), 0);

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.first_name || "",
      lastName: customer.last_name || "",
      email: customer.email || "",
      phoneNumber: customer.phone_number || "",
    });
  };

  const handleSaveCustomer = async () => {
    if (!editingCustomer) return;

    try {
      setIsSaving(true);

      const response = await customerService.updateCustomer(editingCustomer.customer_id, formData);
      const updatedCustomer = response?.customer || {
        ...editingCustomer,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
      };

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.customer_id === editingCustomer.customer_id
            ? { ...customer, ...updatedCustomer }
            : customer,
        ),
      );
      setEditingCustomer(null);
      toast.success("Customer updated successfully.");
    } catch (err) {
      toast.error(err?.message || "Failed to update customer.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;

    try {
      setIsDeleting(true);
      await customerService.deleteCustomer(deletingCustomer.customer_id);
      setCustomers((prev) => prev.filter((customer) => customer.customer_id !== deletingCustomer.customer_id));
      setDeletingCustomer(null);
      toast.success("Customer deleted successfully.");
    } catch (err) {
      toast.error(err?.message || "Failed to delete customer.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <h1>Customers</h1>

          <div className="quick-stats-bar" style={{ padding: 0 }}>
            <div className="stat-card">
              <div className="stat-icon"><Users size={14} /></div>
              <div className="stat-info">
                <span className="stat-value">{totalCustomers}</span>
                <span className="stat-label">Total Customers</span>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon"><Mail size={14} /></div>
              <div className="stat-info">
                <span className="stat-value">{activeCustomers}</span>
                <span className="stat-label">Customers with Orders</span>
              </div>
            </div>
            <div className="stat-card danger">
              <div className="stat-icon"><CalendarDays size={14} /></div>
              <div className="stat-info">
                <span className="stat-value">{dormantCustomers}</span>
                <span className="stat-label">No Orders Yet</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Phone size={14} /></div>
              <div className="stat-info">
                <span className="stat-value">{formatCurrency(totalRevenue)}</span>
                <span className="stat-label">Lifetime Revenue</span>
              </div>
            </div>
          </div>

          <div className="page-header-actions">
            <Button variant="admin-secondary" onClick={() => loadCustomers(false)} disabled={isRefreshing}>
              {isRefreshing ? <Loader2 size={16} className="spin" /> : <RefreshCw size={16} />}
              <span>{isRefreshing ? "Refreshing" : "Refresh"}</span>
            </Button>
          </div>
        </header>
      </div>

      <div className="view-content">
        <div className="table-search-bar customer-toolbar">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="admin-table customers-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Spent</th>
                <th>Joined</th>
                <th>Last Order</th>
                <th style={{ width: "100px" }}></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8">
                    <div className="table-state">
                      <Loader2 size={18} className="spin" />
                      <span>Loading customers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="table-state empty">
                      <Users size={18} />
                      <div>
                        <strong>No customers found</strong>
                        <p>Try a different search term.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td><span className="sku">#{customer.customer_id}</span></td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {`${customer.first_name?.[0] || "?"}${customer.last_name?.[0] || ""}`.toUpperCase()}
                        </div>
                        <div className="customer-info">
                          <strong>{customer.first_name} {customer.last_name}</strong>
                          <span>{customer.order_count || 0} order{Number(customer.order_count) === 1 ? "" : "s"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-stack">
                        <span><Mail size={14} /> {customer.email}</span>
                        <span><Phone size={14} /> {customer.phone_number || "No phone"}</span>
                      </div>
                    </td>
                    <td>{customer.order_count || 0}</td>
                    <td>{formatCurrency(customer.total_spent)}</td>
                    <td>{formatDate(customer.created_at)}</td>
                    <td>{formatDateTime(customer.last_order_at)}</td>
                    <td>
                      <div className="table-actions">
                        <Button variant="text" className="action-edit" title="Edit customer" onClick={() => openEditModal(customer)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="text" className="action-delete" title="Delete customer" onClick={() => setDeletingCustomer(customer)}>
                          <Trash size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setEditingCustomer(null)}
          onSave={handleSaveCustomer}
          isSaving={isSaving}
        />
      )}

      {deletingCustomer && (
        <DeleteCustomerModal
          customer={deletingCustomer}
          onClose={() => setDeletingCustomer(null)}
          onConfirm={handleDeleteCustomer}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}