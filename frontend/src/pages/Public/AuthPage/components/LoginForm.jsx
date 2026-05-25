import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginForm({ onSwitchView, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(true);
      setTimeout(() => setError(false), 400); // reset shake animation
      return;
    }
    // TODO: Implement actual login logic via API
    console.log("Login with:", formData);
    onLoginSuccess();
  };

  return (
    <>
      <div className="auth-form-header">
        <h2>Sign in to your account</h2>
        <p>Welcome back! Please enter your details.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
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
              className={`auth-input ${error && !formData.password ? 'has-error' : ''}`}
              placeholder="Enter your password"
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
          {error && !formData.password && (
            <div className="auth-input-error" role="alert" aria-live="assertive">
              <AlertCircle size={14} /> Password is required
            </div>
          )}
        </div>

        <button type="submit" className="auth-btn-primary">
          Sign In
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account?{" "}
        <button type="button" className="auth-link" onClick={onSwitchView}>
          Sign up
        </button>
      </div>
    </>
  );
}
