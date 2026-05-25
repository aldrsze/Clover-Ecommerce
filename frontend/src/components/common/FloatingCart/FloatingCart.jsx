import React, { useEffect } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import "./FloatingCart.css";

export default function FloatingCart({ 
  cart, 
  cartCount, 
  removeFromCart, 
  updateQuantity, 
  isCartOpen, 
  setIsCartOpen 
}) {
  const totalPrice = cart.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    return acc + (price * item.quantity);
  }, 0);

  // Close when clicking outside (on the overlay)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("cart-overlay")) {
      setIsCartOpen(false);
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
              <button 
                className="cart-empty-btn"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.product_id} className="cart-item">
                  <div className="cart-item-img">
                    <img 
                      src={item.image_url ? `http://localhost:5000${item.image_url}` : "/images/placeholder.jpg"} 
                      alt={item.name} 
                    />
                  </div>
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span className="cart-item-price">${parseFloat(item.price).toFixed(2)}</span>
                    <div className="cart-item-controls">
                      <div className="quantity-toggle">
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.product_id)}
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
            <button 
              className="cart-checkout-btn"
              onClick={() => {
                alert("Checkout functionality coming soon!");
                setIsCartOpen(false);
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
