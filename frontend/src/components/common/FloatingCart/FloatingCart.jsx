import React, { useEffect, useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../Button/Button";
import CheckoutModal from "./CheckoutModal";
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

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [checkoutSuccessCallback, setCheckoutSuccessCallback] = useState(() => {});
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
    }
  };

  const handleOpenCheckoutAll = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to complete your purchase.");
      window.history.pushState({}, "", "/auth");
      window.dispatchEvent(new Event("popstate"));
      setIsCartOpen(false);
      return;
    }
    
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    
    setCheckoutItems(cart);
    setCheckoutTotal(totalPrice);
    setCheckoutSuccessCallback(() => clearCart);
    setIsCheckoutModalOpen(true);
  };

  const handleBuySingle = (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to complete your purchase.");
      window.history.pushState({}, "", "/auth");
      window.dispatchEvent(new Event("popstate"));
      setIsCartOpen(false);
      return;
    }

    setCheckoutItems([item]);
    setCheckoutTotal((parseFloat(item.price) || 0) * item.quantity);
    setCheckoutSuccessCallback(() => () => removeFromCart(item.id));
    setIsCheckoutModalOpen(true);
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

      <div className={`cart-offcanvas ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <div className="cart-header-left">
            <h2>Your Cart ({cartCount})</h2>
          </div>
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
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                          variant="secondary" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => handleBuySingle(item)}
                        >
                          Buy
                        </Button>
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

            <Button 
              variant="primary"
              className="btn-block-sm"
              style={{ padding: "16px", fontSize: "1.05rem" }}
              onClick={handleOpenCheckoutAll}
              disabled={cart.length === 0}
            >
              Checkout All
            </Button>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        checkoutItems={checkoutItems}
        totalAmount={checkoutTotal}
        onSuccess={checkoutSuccessCallback}
        setIsCartOpen={setIsCartOpen}
      />
    </>
  );
}
