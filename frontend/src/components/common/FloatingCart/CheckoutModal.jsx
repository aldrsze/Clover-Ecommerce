import React, { useState } from "react";
import { X, CheckCircle, Package } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../Button/Button";
import "./CheckoutModal.css";

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  checkoutItems, 
  totalAmount, 
  onSuccess,
  setIsCartOpen
}) {
  const [shippingAddress, setShippingAddress] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.address || "";
    }
    return "";
  });
  
  const [shippingName, setShippingName] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.name || "";
    }
    return "";
  });

  const [shippingPhone, setShippingPhone] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.phone || "";
    }
    return "";
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to complete your purchase.");
      window.history.pushState({}, "", "/auth");
      window.dispatchEvent(new Event("popstate"));
      onClose();
      setIsCartOpen(false);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems: checkoutItems,
          shippingAddress,
          shippingName,
          shippingPhone,
          totalAmount: totalAmount
        })
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      toast.success("Order placed successfully!");
      onSuccess();
      onClose();
      setIsCartOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItemsCount = checkoutItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="checkout-overlay" onClick={(e) => { if (e.target.classList.contains("checkout-overlay")) onClose(); }}>
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>Secure Checkout</h2>
          <button className="checkout-close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="checkout-body">
          <div className="checkout-section">
            <h3><Package size={18} /> Order Summary</h3>
            <div className="checkout-items-list">
              {checkoutItems.map(item => (
                <div key={item.id} className="checkout-item-row">
                  <span className="checkout-item-name">{item.quantity}x {item.name}</span>
                  <span className="checkout-item-price">${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-summary-total">
              <span>Total ({totalItemsCount} items)</span>
              <strong>${totalAmount.toFixed(2)}</strong>
            </div>
          </div>

          <div className="checkout-section">
            <h3>Shipping Details</h3>
            
            <div className="checkout-input-group">
              <p className="checkout-label">Recipient Name</p>
              <input 
                type="text"
                className="checkout-input"
                placeholder="Enter full name"
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
              />
            </div>

            <div className="checkout-input-group">
              <p className="checkout-label">Phone Number</p>
              <input 
                type="tel"
                className="checkout-input"
                placeholder="Enter phone number"
                value={shippingPhone}
                onChange={(e) => setShippingPhone(e.target.value)}
              />
            </div>

            <div className="checkout-input-group">
              <p className="checkout-label">Delivery Address</p>
              <textarea 
                className="checkout-address-input"
                placeholder="Enter your complete shipping address..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="checkout-footer">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCheckout}
            disabled={isSubmitting || !shippingAddress.trim() || !shippingName.trim() || !shippingPhone.trim()}
          >
            {isSubmitting ? "Processing..." : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} /> Confirm Order
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
