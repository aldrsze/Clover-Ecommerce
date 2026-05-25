import React, { useEffect } from "react";
import { LogOut, X } from "lucide-react";
import { Button } from "../Button/Button";
import "./LogoutModal.css";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay" onClick={(e) => { if (e.target.classList.contains("logout-modal-overlay")) onClose(); }}>
      <div className="logout-modal">
        <button className="logout-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        
        <div className="logout-content">
          <div className="logout-icon">
            <LogOut size={40} />
          </div>
          <h2>Log Out</h2>
          <p>Are you sure you want to end your current session? You will need to sign in again to access your account.</p>
        </div>

        <div className="logout-actions">
          <Button variant="secondary" onClick={onClose} className="logout-cancel">
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} className="logout-confirm" style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}>
            Yes, log out
          </Button>
        </div>
      </div>
    </div>
  );
}
