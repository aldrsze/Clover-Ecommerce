import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function RegisterForm({ onSwitchView, onRegisterSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: "", 
    lastName: "",
    email: "", 
    password: "" 
  });
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || formData.password.length < 8) {
      setError(true);
      setTimeout(() => setError(false), 400);
      return;
    }
    // TODO: Implement actual registration logic via API
    console.log("Register with:", formData);
    onRegisterSuccess();
  };

  return (
    <>
      <div className="auth-form-header">
        <h2>Create an account</h2>
        <p>Join Clover to start ordering our signature treats.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="auth-input-group">
            <label htmlFor="firstName">First name</label>
            <div className="auth-input-wrapper">
              <input
                id="firstName"
                type="text"
                className={`auth-input ${error && !formData.firstName ? 'has-error' : ''}`}
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            {error && !formData.firstName && (
              <div className="auth-input-error" role="alert" aria-live="assertive">
                <AlertCircle size={14} /> Required
              </div>
            )}
          </div>
          <div className="auth-input-group">
            <label htmlFor="lastName">Last name</label>
            <div className="auth-input-wrapper">
              <input
                id="lastName"
                type="text"
                className={`auth-input ${error && !formData.lastName ? 'has-error' : ''}`}
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            {error && !formData.lastName && (
              <div className="auth-input-error" role="alert" aria-live="assertive">
                <AlertCircle size={14} /> Required
              </div>
            )}
          </div>
        </div>

        <div className="auth-input-group">
          <label htmlFor="email">Email</label>
          <div className="auth-input-wrapper">
            <input
              id="email"
              type="email"
              className={`auth-input ${error && !formData.email ? 'has-error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          {error && !formData.email && (
            <div className="auth-input-error" role="alert" aria-live="assertive">
              <AlertCircle size={14} /> Email is required
            </div>
          )}
        </div>

        <div className="auth-input-group">
          <label htmlFor="password">Password</label>
          <div className="auth-input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`auth-input ${error && (!formData.password || formData.password.length < 8) ? 'has-error' : ''}`}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              className={`auth-password-toggle ${showPassword ? 'is-visible' : ''}`}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Blueprint: Password requirements visible BEFORE submit */}
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Must be at least 8 characters.
          </div>
          {error && (!formData.password || formData.password.length < 8) && (
            <div className="auth-input-error" role="alert" aria-live="assertive">
              <AlertCircle size={14} /> Invalid password
            </div>
          )}
        </div>

        <button type="submit" className="auth-btn-primary" style={{ marginTop: '16px' }}>
          Create account
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?{" "}
        <button type="button" className="auth-link" onClick={onSwitchView}>
          Sign in
        </button>
      </div>
    </>
  );
}
