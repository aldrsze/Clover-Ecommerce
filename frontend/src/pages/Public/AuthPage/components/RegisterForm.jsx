import React, { useState, useMemo } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

/* Password strength: 0-4 */
function getStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_CLASSES = ["", "active-weak", "active-fair", "active-good", "active-strong"];

export default function RegisterForm({ onSwitchView, onRegisterSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [agreed, setAgreed]             = useState(false);
  const [formData, setFormData]         = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const strength = useMemo(() => getStrength(formData.password), [formData.password]);

  const validate = () => {
    const next = {};
    if (!formData.firstName)              next.firstName = "Required";
    if (!formData.lastName)               next.lastName  = "Required";
    if (!formData.email)                  next.email     = "Email is required";
    if (!formData.password)               next.password  = "Password is required";
    else if (formData.password.length < 8) next.password = "At least 8 characters";
    if (!agreed)                          next.agreed    = "Please accept the terms";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      setTimeout(() => setErrors((prev) => ({ ...prev })), 500);
      return;
    }
    setIsLoading(true);
    // TODO: replace with actual API call
    await new Promise((r) => setTimeout(r, 1100));
    console.log("Register with:", formData);
    setIsLoading(false);
    onRegisterSuccess();
  };

  const setField = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  return (
    <>
      <div className="auth-form-header">
        <span className="auth-form-eyebrow">Join the community</span>
        <h2>
          Create
          <em> your account</em>
        </h2>
        <p>Start ordering our signature treats today.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Name row */}
        <div className="auth-name-grid">
          <div className="auth-input-group">
            <label htmlFor="reg-first">First name</label>
            <div className="auth-input-wrapper">
              <input
                id="reg-first"
                type="text"
                className={`auth-input${errors.firstName ? " has-error" : ""}`}
                placeholder="Jane"
                value={formData.firstName}
                onChange={setField("firstName")}
                autoComplete="given-name"
              />
            </div>
            {errors.firstName && (
              <div className="auth-input-error" role="alert" aria-live="assertive">
                <AlertCircle size={12} />
                {errors.firstName}
              </div>
            )}
          </div>

          <div className="auth-input-group">
            <label htmlFor="reg-last">Last name</label>
            <div className="auth-input-wrapper">
              <input
                id="reg-last"
                type="text"
                className={`auth-input${errors.lastName ? " has-error" : ""}`}
                placeholder="Doe"
                value={formData.lastName}
                onChange={setField("lastName")}
                autoComplete="family-name"
              />
            </div>
            {errors.lastName && (
              <div className="auth-input-error" role="alert" aria-live="assertive">
                <AlertCircle size={12} />
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="auth-input-group">
          <label htmlFor="reg-email">Email address</label>
          <div className="auth-input-wrapper">
            <input
              id="reg-email"
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
          <label htmlFor="reg-password">Password</label>
          <div className="auth-input-wrapper">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              className={`auth-input${errors.password ? " has-error" : ""}`}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={setField("password")}
              autoComplete="new-password"
              style={{ paddingRight: "48px" }}
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

          {/* Strength meter */}
          {formData.password && (
            <div className="auth-password-meta">
              <div className="auth-strength-bar" role="meter" aria-label="Password strength" aria-valuenow={strength} aria-valuemin={0} aria-valuemax={4}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`auth-strength-segment${i <= strength ? ` ${STRENGTH_CLASSES[strength]}` : ""}`}
                  />
                ))}
              </div>
              {strength > 0 && (
                <span className="auth-password-hint">
                  {STRENGTH_LABELS[strength]}
                </span>
              )}
            </div>
          )}

          {errors.password && (
            <div className="auth-input-error" role="alert" aria-live="assertive">
              <AlertCircle size={12} />
              {errors.password}
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="auth-input-group" style={{ marginBottom: "24px" }}>
          <label className="auth-checkbox-group" style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              className="auth-checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: null }));
              }}
              id="reg-terms"
            />
            <span className="auth-checkbox-label" style={{ fontWeight: "normal", fontSize: "12px" }}>
              I agree to the{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
              {" "}and{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            </span>
          </label>
          {errors.agreed && (
            <div className="auth-input-error" role="alert" aria-live="assertive">
              <AlertCircle size={12} />
              {errors.agreed}
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
          {isLoading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      {/* Switch view */}
      <div className="auth-footer">
        Already have an account?{" "}
        <button type="button" className="auth-link" onClick={onSwitchView}>
          Sign in
        </button>
      </div>
    </>
  );
}