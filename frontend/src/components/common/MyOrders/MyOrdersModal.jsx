import React, { useEffect, useState } from "react";
import { X, Package, Clock, CheckCircle } from "lucide-react";
import { Button } from "../Button/Button";
import "./MyOrdersModal.css";

export default function MyOrdersModal({ isOpen, onClose, user }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
    }
  }, [isOpen, user]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="orders-overlay" onClick={(e) => { if (e.target.classList.contains("orders-overlay")) onClose(); }}>
      <div className="orders-modal">
        <div className="orders-header">
          <h2>My Orders {orders.length > 0 && `(${orders.length})`}</h2>
          <button className="orders-close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="orders-body">
          {isLoading ? (
            <div className="orders-loading">Loading your history...</div>
          ) : orders.length === 0 ? (
            <div className="orders-empty">
              <Package size={48} className="orders-empty-icon" />
              <h3>No Orders Yet</h3>
              <p>You haven't placed any orders yet. Time to get some Clover!</p>
              <Button variant="primary" onClick={onClose}>Start Shopping</Button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.order_id} className="order-card">
                  <div className="order-card-header">
                    <span className="order-date">
                      {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                      {order.status === "Pending" ? <Clock size={14} /> : <CheckCircle size={14} />}
                      {order.status}
                    </span>
                  </div>
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.order_item_id} className="order-item-row">
                        <img 
                          src={
                            item.image_path?.startsWith("uploads/") 
                              ? `${import.meta.env.VITE_SERVER_URL}/${item.image_path}` 
                              : item.image_path ? `/${item.image_path}` : "/images/placeholder.jpg"
                          } 
                          alt={item.name} 
                          className="order-item-img"
                        />
                        <div className="order-item-details">
                          <span className="order-item-name">{item.name}</span>
                          {item.category && <span className="order-item-category">{item.category}</span>}
                          {item.description && <span className="order-item-desc">{item.description}</span>}
                          <span className="order-item-qty">Qty: {item.quantity}</span>
                        </div>
                        <div className="order-item-price">
                          ${parseFloat(item.unit_price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-card-footer">
                    <span className="order-address">Shipped to: {order.shipping_address}</span>
                    <strong className="order-total">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} Items | Total: ${parseFloat(order.total_amount).toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
