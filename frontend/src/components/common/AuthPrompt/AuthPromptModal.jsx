import React, { useEffect } from "react";
import { Lock, UserPlus, X } from "lucide-react";
import { Button } from "../Button/Button";
import "./AuthPromptModal.css";

export default function AuthPromptModal({ isOpen, onClose, setCurrentPage }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRedirect = () => {
    onClose();
    window.history.pushState({}, "", "/auth");
    window.dispatchEvent(new Event("popstate"));
  };

  return (
    <div className="auth-prompt-overlay" onClick={(e) => { if (e.target.classList.contains("auth-prompt-overlay")) onClose(); }}>
      <div className="auth-prompt-modal">
        <button className="auth-prompt-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        
        <div className="auth-prompt-content">
          <div className="auth-prompt-icon">
            <Lock size={40} />
          </div>
          <h2>Authentication Required</h2>
          <p>You need to be logged in to access this feature. Please sign in or create a free account to continue.</p>
        </div>

        <div className="auth-prompt-actions">
          <Button variant="secondary" onClick={onClose} className="auth-prompt-cancel">
            Not Now
          </Button>
          <Button variant="primary" onClick={handleRedirect} className="auth-prompt-confirm">
            <UserPlus size={18} /> Sign In / Register
          </Button>
        </div>
      </div>
    </div>
  );
}
