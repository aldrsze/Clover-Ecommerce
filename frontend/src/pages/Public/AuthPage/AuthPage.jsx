import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import "./AuthPage.css";

export default function AuthPage({ setCurrentPage, setUser }) {
  const [view, setView] = useState("login");

  const goHome = (userObj) => {
    if (userObj && setUser) {
      setUser(userObj);
    }
    window.history.pushState({}, "", "/");
    setCurrentPage("home");
  };

  return (
    <div className="auth-page">
      {/* Mobile-only header — visible below lg */}
      <div
        className="auth-mobile-header"
        onClick={goHome}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && goHome()}
        aria-label="Go to Clover homepage"
      >
        <img src="/images/brand/clover-logo.png" alt="Clover" />
        <span>Clover</span>
      </div>

      {/* ── BRAND PANEL ────────────────────────────────────────────────── */}
      <div className="auth-brand-panel">
        <div
          className="auth-brand-header"
          onClick={goHome}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && goHome()}
          aria-label="Go to Clover homepage"
        >
          <img src="/images/brand/clover-logo.png" alt="Clover Logo" />
          <h1>Clover</h1>
        </div>

        {/* ── FLOATING BRAND LOGO BACKGROUND EFFECT ── */}
        <div className="auth-floating-bg" aria-hidden="true">
          <div className="auth-bg-clover item-1">
            <img src="/images/brand/clover-logo.png" alt="" />
          </div>
          <div className="auth-bg-clover item-2">
            <img src="/images/brand/clover-logo.png" alt="" />
          </div>
          <div className="auth-bg-clover item-3">
            <img src="/images/brand/clover-logo.png" alt="" />
          </div>
          <div className="auth-bg-clover item-4">
            <img src="/images/brand/clover-logo.png" alt="" />
          </div>
          <div className="auth-bg-clover item-5">
            <img src="/images/brand/clover-logo.png" alt="" />
          </div>
        </div>

        <div className="auth-brand-content">
          <span className="auth-brand-eyebrow">Artisan Bakery &amp; Coffee</span>
          <h2>
            Fresh pastries,
            <em>delivered.</em>
          </h2>
          <p>
            Join Clover to order our signature cinnamon rolls and artisanal
            treats. Experience quality in every bite, every time.
          </p>

          <div className="auth-brand-badges">
            <div className="auth-badge">
              <span className="auth-badge-dot"></span>
              <span>Open Daily</span>
            </div>
            <div className="auth-badge">
              <span className="auth-badge-dot"></span>
              <span>Free Delivery</span>
            </div>
          </div>
        </div>

        <div className="auth-brand-footer">
          © {new Date().getFullYear()} Clover
        </div>
      </div>

      {/* ── FORM PANEL ─────────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        <button className="auth-back-btn" onClick={() => goHome()} aria-label="Back to Home">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
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