import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import "./AuthPage.css";

export default function AuthPage({ setCurrentPage }) {
  const [view, setView] = useState("login"); // "login" or "register"

  // If the user lands here, we probably don't want the regular header/footer
  // Our App.jsx handles layout based on currentPage. 
  // However, we need a way to go back home.
  const goHome = () => {
    window.history.pushState({}, "", "/");
    setCurrentPage("home");
  };

  return (
    <div className="auth-page">
      {/* Mobile-only header (hidden on lg+) */}
      <div className="auth-mobile-header" onClick={goHome} style={{ cursor: 'pointer' }}>
        <img src="/images/brand/clover-logo.png" alt="Clover" />
        <span style={{ fontWeight: 700, fontSize: '18px' }}>Clover</span>
      </div>

      {/* Brand Panel (left side on lg+) */}
      <div className="auth-brand-panel">
        <div className="auth-brand-header" onClick={goHome} style={{ cursor: 'pointer' }}>
          <img src="/images/brand/clover-logo.png" alt="Clover Logo" />
          <h1>Clover</h1>
        </div>
        <div className="auth-brand-content">
          <h2>Fresh pastries, delivered to your door.</h2>
          <p>
            Join Clover to order our signature cinnamon rolls and artisanal treats. 
            Experience quality in every bite.
          </p>
        </div>
        <div className="auth-brand-footer" style={{ fontSize: '13px', opacity: 0.6 }}>
          © {new Date().getFullYear()} Clover Bakery. All rights reserved.
        </div>
      </div>

      {/* Form Panel (right side on lg+, full width on sm/md) */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          {view === "login" ? (
            <LoginForm 
              onSwitchView={() => setView("register")} 
              onLoginSuccess={goHome}
            />
          ) : (
            <RegisterForm 
              onSwitchView={() => setView("login")} 
              onRegisterSuccess={goHome}
            />
          )}
        </div>
      </div>
    </div>
  );
}
