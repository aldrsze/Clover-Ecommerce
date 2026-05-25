import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginForm({ onSwitchView, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!formData.email)    next.email    = "Email is required";
    if (!formData.password) next.password = "Password is required";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      // Clear shake after animation
      setTimeout(() => setErrors((prev) => ({ ...prev })), 500);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Success
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsLoading(false);
      toast.success("Welcome back!");
      onLoginSuccess(data.user);

    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Server error. Please try again later.");
      setIsLoading(false);
    }
  };

  const setField = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  return (
    <>
      <div className="auth-form-header">
        <span className="auth-form-eyebrow">Welcome back</span>
        <h2>
          Sign in
          <em> to your account</em>
        </h2>
        <p>Enter your credentials to continue ordering.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="auth-input-group">
          <label htmlFor="login-email">Email address</label>
          <div className="auth-input-wrapper">
            <input
              id="login-email"
              type="email"
              className={`auth-input${errors.email ? " has-error" : ""}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={setField("email")}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <div className="auth-input-error" role="alert" aria-live="assertive">
              <AlertCircle size={12} />
              {errors.email}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="auth-input-group">
          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className={`auth-input${errors.password ? " has-error" : ""}`}
              placeholder="Your password"
              value={formData.password}
              onChange={setField("password")}
              autoComplete="current-password"
              style={{ paddingRight: "3rem" }}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <div className="auth-input-error" role="alert" aria-live="assertive">
              <AlertCircle size={12} />
              {errors.password}
            </div>
          )}
        </div>



        {/* Submit */}
        <button
          type="submit"
          className={`auth-btn-primary${isLoading ? " is-loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading && <span className="auth-btn-spinner" aria-hidden="true" />}
          {isLoading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      {/* Switch view */}
      <div className="auth-footer">
        Don't have an account?{" "}
        <button type="button" className="auth-link" onClick={onSwitchView}>
          Create one
        </button>
      </div>
    </>
  );
}