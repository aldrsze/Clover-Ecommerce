import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Clock3,
  Eye,
  Filter,
  Loader2,
  Mail,
  MapPin,
  Package,
  Pencil,
  RefreshCw,
  Search,
  ShoppingCart,
  Truck,
  Trash,
  User,
  X,
} from "lucide-react";
import { Button } from "../../../components/common/Button/Button";
import { orderService } from "../../../api/orderService";
import "./ManageOrders.css";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];

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
    : "-";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const getCustomerName = (order) => {
  const fullName = `${order.first_name || ""} ${order.last_name || ""}`.trim();
  return fullName || `Customer #${order.customer_id || "—"}`;
};

function OrderDetailModal({ order, onClose, onEdit }) {
  if (!order) return null;

  const totalItems = (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <div className="admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal order-detail-modal">
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-eyebrow">Order details</p>
            <h2>#{order.order_id}</h2>
          </div>
          <Button variant="none" className="admin-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </Button>
        </div>

        <div className="admin-modal-body order-detail-body">
          <div className="order-detail-grid">
            <div className="order-detail-panel">
              <span className="detail-label"><User size={14} /> Customer</span>
              <strong>{getCustomerName(order)}</strong>
              <span><Mail size={14} /> {order.email || "No email"}</span>
              <span>{order.phone_number || "No phone"}</span>
            </div>

            <div className="order-detail-panel">
              <span className="detail-label"><MapPin size={14} /> Shipping</span>
              <strong>{order.status}</strong>
              <span>{order.shipping_address || "No shipping address provided"}</span>
            </div>

            <div className="order-detail-panel">
              <span className="detail-label"><CalendarDays size={14} /> Timeline</span>
              <strong>{formatDate(order.created_at)}</strong>
              <span>{formatDateTime(order.created_at)}</span>
            </div>

            <div className="order-detail-panel">
              <span className="detail-label"><ShoppingCart size={14} /> Summary</span>
              <strong>{totalItems} item{totalItems === 1 ? "" : "s"}</strong>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          <div className="order-items-list">
            <div className="order-items-list-header">
              <h3>Items</h3>
              <span>{(order.items || []).length} line item{(order.items || []).length === 1 ? "" : "s"}</span>
            </div>

            {(order.items || []).length === 0 ? (
              <div className="table-state empty compact">
                <Package size={18} />
                <div>
                  <strong>No items</strong>
                  <p>This order has no attached products.</p>
                </div>
              </div>
            ) : (
              order.items.map((item) => (
                <div key={item.order_item_id} className="order-item-row admin-order-item">
                  <img
                    src={
                      item.image_path?.startsWith("uploads/")
                        ? `http://localhost:5000/${item.image_path}`
                        : item.image_path
                          ? `/${item.image_path}`
                          : "/images/placeholder.jpg"
                    }
                    alt={item.name}
                    className="order-item-img"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.jpg";
                    }}
                  />
                  <div className="order-item-details">
                    <span className="order-item-name">{item.name}</span>
                    {item.category && <span className="order-item-category">{item.category}</span>}
                    {item.description && <span className="order-item-desc">{item.description}</span>}
                    <span className="order-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <div className="order-item-price">{formatCurrency(Number(item.unit_price || 0) * Number(item.quantity || 0))}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-modal-actions">
          <Button variant="admin-secondary" onClick={onClose}>Close</Button>
          <Button variant="admin-primary" onClick={() => onEdit(order)}>
            <Pencil size={16} />
            <span>Edit order</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditOrderModal({ order, formData, setFormData, onClose, onSave, isSaving }) {
  if (!order) return null;

  return (
    <div className="admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal order-edit-modal">
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-eyebrow">Edit order</p>
            <h2>#{order.order_id}</h2>
          </div>
          <Button variant="none" className="admin-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </Button>
        </div>

        <div className="admin-modal-body">
          <label className="field">
            <span>Status</span>
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Shipping address</span>
            <textarea
              rows="4"
              value={formData.shippingAddress}
              readOnly
              style={{ cursor: "not-allowed", backgroundColor: "var(--admin-secondary)" }}
              placeholder="Shipping address"
            />
          </label>
        </div>

        <div className="admin-modal-actions">
          <Button variant="admin-secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button variant="admin-primary" onClick={onSave} disabled={isSaving}>
            {isSaving ? <Loader2 size={16} className="spin" /> : <CheckCircle size={16} />}
            <span>{isSaving ? "Saving" : "Save changes"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeleteOrderModal({ order, onClose, onConfirm, isDeleting }) {
  if (!order) return null;

  return (
    <div className="admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal delete-modal">
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-eyebrow danger">Delete order</p>
            <h2>#{order.order_id}</h2>
          </div>
          <Button variant="none" className="admin-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </Button>
        </div>

        <div className="admin-modal-body">
          <p className="delete-warning">
            This permanently removes the order and its items. Use this only if the record should not be kept.
          </p>
          <div className="delete-preview">
            <strong>{getCustomerName(order)}</strong>
            <span>{order.status} • {formatCurrency(order.total_amount)}</span>
          </div>
        </div>

        <div className="admin-modal-actions">
          <Button variant="admin-secondary" onClick={onClose} disabled={isDeleting}>Cancel</Button>
          <Button variant="admin-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? <Loader2 size={16} className="spin" /> : <Trash size={16} />}
            <span>{isDeleting ? "Deleting" : "Delete order"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [customerFilter, setCustomerFilter] = useState("");
  const [minTotalFilter, setMinTotalFilter] = useState("");
  const [maxTotalFilter, setMaxTotalFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [formData, setFormData] = useState({ status: "Pending", shippingAddress: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadOrders = async (showSpinner = true) => {
    try {
      if (showSpinner) setIsLoading(true);
      else setIsRefreshing(true);

      setError("");
      const data = await orderService.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load orders.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders(true);
  }, []);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const customerQuery = customerFilter.trim().toLowerCase();
    const minTotal = minTotalFilter === "" ? null : Number(minTotalFilter);
    const maxTotal = maxTotalFilter === "" ? null : Number(maxTotalFilter);
    const dateFrom = dateFromFilter ? new Date(`${dateFromFilter}T00:00:00`) : null;
    const dateTo = dateToFilter ? new Date(`${dateToFilter}T23:59:59.999`) : null;

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      const orderTotal = Number(order.total_amount || 0);
      const orderDate = order.created_at ? new Date(order.created_at) : null;
      const matchesCustomer =
        !customerQuery ||
        [getCustomerName(order), order.email, order.phone_number, String(order.customer_id || "")]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(customerQuery);
      const matchesMinTotal = minTotal === null || Number.isNaN(minTotal) || orderTotal >= minTotal;
      const matchesMaxTotal = maxTotal === null || Number.isNaN(maxTotal) || orderTotal <= maxTotal;
      const matchesDateFrom = !dateFrom || (orderDate && orderDate >= dateFrom);
      const matchesDateTo = !dateTo || (orderDate && orderDate <= dateTo);

      if (!query) {
        return matchesStatus && matchesCustomer && matchesMinTotal && matchesMaxTotal && matchesDateFrom && matchesDateTo;
      }

      const searchable = [
        String(order.order_id),
        getCustomerName(order),
        order.email,
        order.phone_number,
        order.shipping_address,
        order.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        matchesCustomer &&
        matchesMinTotal &&
        matchesMaxTotal &&
        matchesDateFrom &&
        matchesDateTo &&
        searchable.includes(query)
      );
    });
  }, [orders, searchQuery, statusFilter, customerFilter, minTotalFilter, maxTotalFilter, dateFromFilter, dateToFilter]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const completedOrders = orders.filter((order) => order.status === "Completed").length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCustomerFilter("");
    setMinTotalFilter("");
    setMaxTotalFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setIsFilterPanelOpen(false);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setFormData({
      status: order.status || "Pending",
      shippingAddress: order.shipping_address || "",
    });
  };

  const handleSaveOrder = async () => {
    if (!editingOrder) return;

    try {
      setIsSaving(true);
      setError("");

      const response = await orderService.updateOrder(editingOrder.order_id, formData);
      const updatedOrder = response?.order || {
        ...editingOrder,
        status: formData.status,
        shipping_address: formData.shippingAddress,
      };

      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === editingOrder.order_id
            ? { ...order, ...updatedOrder }
            : order,
        ),
      );

      if (selectedOrder?.order_id === editingOrder.order_id) {
        setSelectedOrder((prev) => prev ? { ...prev, ...updatedOrder } : prev);
      }

      setEditingOrder(null);
    } catch (err) {
      setError(err?.message || "Failed to update order.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!deletingOrder) return;

    try {
      setIsDeleting(true);
      setError("");
      await orderService.deleteOrder(deletingOrder.order_id);
      setOrders((prev) => prev.filter((order) => order.order_id !== deletingOrder.order_id));
      if (selectedOrder?.order_id === deletingOrder.order_id) {
        setSelectedOrder(null);
      }
      setDeletingOrder(null);
    } catch (err) {
      setError(err?.message || "Failed to delete order.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <h1>Orders</h1>

          <div className="quick-stats-bar" style={{ padding: 0 }}>
            <div className="stat-card">
              <div className="stat-icon"><Package size={14} /></div>
              <div className="stat-info">
                <span className="stat-value">{totalOrders}</span>
                <span className="stat-label">Total Orders</span>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon"><Clock3 size={14} /></div>
              <div className="stat-info">
                <span className="stat-value">{pendingOrders}</span>
                <span className="stat-label">Pending Orders</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><CheckCircle size={14} /></div>
              <div className="stat-info">
                <span className="stat-value">{completedOrders}</span>
                <span className="stat-label">Completed Orders</span>
              </div>
            </div>
            <div className="stat-card danger">
              <div className="stat-icon"><ShoppingCart size={14} /></div>
              <div className="stat-info">
                <span className="stat-value">{formatCurrency(totalRevenue)}</span>
                <span className="stat-label">Revenue</span>
              </div>
            </div>
          </div>

          <div className="page-header-actions">
            <Button variant="admin-secondary" onClick={() => loadOrders(false)} disabled={isRefreshing}>
              {isRefreshing ? <Loader2 size={16} className="spin" /> : <RefreshCw size={16} />}
              <span>{isRefreshing ? "Refreshing" : "Refresh"}</span>
            </Button>
          </div>
        </header>
      </div>

      <div className="view-content">
        <div className="table-search-bar order-toolbar">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search orders by ID, customer, status, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="action-buttons">
            <label className="status-filter field compact">
              <span>Status</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <Button
              variant="admin-secondary"
              onClick={() => setIsFilterPanelOpen((prev) => !prev)}
              title="Toggle more filters"
              className={isFilterPanelOpen ? "is-active" : ""}
            >
              <Filter size={16} />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        {isFilterPanelOpen && (
          <div className="order-filters-panel">
            <div className="order-filters-grid">
              <label className="field compact">
                <span>Customer</span>
                <input
                  type="text"
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  placeholder="Name, email, phone, or ID"
                />
              </label>
              <label className="field compact">
                <span>Min total</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={minTotalFilter}
                  onChange={(e) => setMinTotalFilter(e.target.value)}
                  placeholder="0.00"
                />
              </label>
              <label className="field compact">
                <span>Max total</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxTotalFilter}
                  onChange={(e) => setMaxTotalFilter(e.target.value)}
                  placeholder="0.00"
                />
              </label>
              <label className="field compact">
                <span>From</span>
                <input
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => setDateFromFilter(e.target.value)}
                />
              </label>
              <label className="field compact">
                <span>To</span>
                <input
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => setDateToFilter(e.target.value)}
                />
              </label>
            </div>

            <div className="order-filters-footer">
              <Button variant="admin-secondary" onClick={handleClearFilters}>
                Reset filters
              </Button>
            </div>
          </div>
        )}

        {error && <div className="admin-alert error">{error}</div>}

        <div className="table-container">
          <table className="admin-table orders-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ width: "120px" }}></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7">
                    <div className="table-state">
                      <Loader2 size={18} className="spin" />
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="table-state empty">
                      <Package size={18} />
                      <div>
                        <strong>No orders found</strong>
                        <p>Try a different search or status filter.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td><span className="sku">#{order.order_id}</span></td>
                    <td>
                      <div className="customer-cell order-customer-cell">
                        <div className="customer-avatar order-avatar">
                          {(order.first_name?.[0] || "?") + (order.last_name?.[0] || "")}
                        </div>
                        <div className="customer-info">
                          <strong>{getCustomerName(order)}</strong>
                          <span>{order.email || "No email"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="order-quantity-stack">
                        <strong>{order.total_quantity || 0} item{Number(order.total_quantity) === 1 ? "" : "s"}</strong>
                        <span>{order.items?.length || 0} line item{Number(order.items?.length || 0) === 1 ? "" : "s"}</span>
                      </div>
                    </td>
                    <td>{formatCurrency(order.total_amount)}</td>
                    <td>
                      <span className={`status-badge order-status-badge ${String(order.status || "").toLowerCase()}`}>
                        {order.status === "Pending" && <Clock3 size={12} />}
                        {order.status === "Completed" && <CheckCircle size={12} />}
                        {order.status === "Shipped" && <Truck size={12} />}
                        {order.status === "Cancelled" && <X size={12} />}
                        {order.status === "Processing" && <Loader2 size={12} className="spin" />}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>
                      <div className="table-actions">
                        <Button variant="text" className="action-edit" title="View order" onClick={() => setSelectedOrder(order)}>
                          <Eye size={16} />
                        </Button>
                        <Button variant="text" className="action-edit" title="Edit order" onClick={() => openEditModal(order)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="text" className="action-delete" title="Delete order" onClick={() => setDeletingOrder(order)}>
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

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onEdit={(order) => {
            setSelectedOrder(null);
            openEditModal(order);
          }}
        />
      )}

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setEditingOrder(null)}
          onSave={handleSaveOrder}
          isSaving={isSaving}
        />
      )}

      {deletingOrder && (
        <DeleteOrderModal
          order={deletingOrder}
          onClose={() => setDeletingOrder(null)}
          onConfirm={handleDeleteOrder}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
