import React, { useEffect, useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../Button/Button";
import "./FloatingCart.css";

export default function FloatingCart({ 
  cart, 
  cartCount, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  isCartOpen, 
  setIsCartOpen 
}) {
  const totalPrice = cart.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    return acc + (price * item.quantity);
  }, 0);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.address || "";
    }
    return "";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close when clicking outside (on the overlay)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("cart-overlay")) {
      setIsCartOpen(false);
      setIsCheckingOut(false);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to complete your purchase.");
      window.history.pushState({}, "", "/auth");
      window.dispatchEvent(new Event("popstate"));
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
          cartItems: cart,
          shippingAddress,
          totalAmount: totalPrice
        })
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      toast.success("Order placed successfully!");
      clearCart();
      setIsCheckingOut(false);
      setIsCartOpen(false); // optionally close the cart since it's empty now
    } catch (error) {
      console.error(error);
      toast.error("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isCartOpen]);

  return (
    <>
      {/* ── FLOATING ACTION BUTTON ── */}
      <button 
        className={`cart-fab ${cartCount > 0 ? "has-items" : ""} ${isCartOpen ? "hidden" : ""}`}
        onClick={() => setIsCartOpen(true)}
        aria-label="Open Cart"
      >
        <ShoppingCart size={24} />
        {cartCount > 0 && <span className="cart-fab-badge">{cartCount}</span>}
      </button>

      {/* ── OVERLAY ── */}
      <div 
        className={`cart-overlay ${isCartOpen ? "open" : ""}`} 
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* ── OFF-CANVAS CART PANEL ── */}
      <div className={`cart-offcanvas ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart ({cartCount})</h2>
          <button 
            className="cart-close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            <X size={24} />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart size={48} className="cart-empty-icon" />
              <p>Your cart is empty.</p>
              <Button 
                variant="secondary"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    <img 
                      src={
                        item.image?.startsWith("uploads/")
                          ? `http://localhost:5000/${item.image}`
                          : item.image 
                            ? `/${item.image}` 
                            : "/images/placeholder.jpg"
                      }
                      alt={item.name} 
                    />
                  </div>
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    {item.category && <span className="cart-item-category">{item.category}</span>}
                    {item.description && <span className="cart-item-desc">{item.description}</span>}
                    <span className="cart-item-price">${parseFloat(item.price).toFixed(2)}</span>
                    <div className="cart-item-controls">
                      <div className="quantity-toggle">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>

            {isCheckingOut ? (
              <div className="checkout-form" style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                <textarea 
                  placeholder="Enter your shipping address..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", minHeight: "80px", fontFamily: "inherit" }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button 
                    variant="secondary"
                    className="btn-block-sm"
                    style={{ padding: "12px", flex: 1 }}
                    onClick={() => setIsCheckingOut(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary"
                    className="btn-block-sm"
                    style={{ padding: "12px", flex: 1 }}
                    onClick={handleCheckout}
                    disabled={isSubmitting || !shippingAddress.trim()}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Order"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="primary"
                className="btn-block-sm"
                style={{ padding: "16px", fontSize: "1.05rem" }}
                onClick={() => setIsCheckingOut(true)}
              >
                Checkout
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
