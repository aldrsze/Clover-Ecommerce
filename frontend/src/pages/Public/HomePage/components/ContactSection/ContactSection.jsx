import React, { useState } from "react";
import { Button } from "../../../../../components/common/Button/Button";
import { contactService } from "../../../../../api/contactService";

export const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await contactService.submitMessage(formData);
      setSuccessMsg("Your message has been sent successfully. We'll be in touch!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setErrorMsg("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section snap-section">
      <div className="container">
        <div className="contact-layout-wrapper">
          <div className="contact-text-side animate-on-scroll fade-in-left">
            <h2>Get in Touch</h2>
            <p className="contact-lead">
              Have a question or need assistance? We'd love to hear from you.
              Drop us a line or visit our shop.
            </p>

            <div className="contact-info-list">
              <div className="info-item">
                <strong>Location</strong>
                <p>
                  27 Maginhawa Street, Diliman, Quezon City, Metro Manila,
                  Philippines 1101
                </p>
              </div>
              <div className="info-item">
                <strong>Phone</strong>
                <p>+63 917 845 2731</p>
              </div>
              <div className="info-item">
                <strong>Email</strong>
                <p>hello@clovercoffee.ph</p>
              </div>
              <div className="info-item">
                <strong>Business Hours</strong>
                <p>Monday - Sunday: 7:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>

          <div className="contact-form-side animate-on-scroll fade-in-right">
            <form
              className="boutique-contact-form"
              onSubmit={handleSubmit}
            >
              {successMsg && (
                <div style={{ padding: "12px", marginBottom: "16px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "6px", fontSize: "14px" }}>
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div style={{ padding: "12px", marginBottom: "16px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "6px", fontSize: "14px" }}>
                  {errorMsg}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={loading}
                  required
                ></textarea>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
