import React from "react";
import { Button } from "../../common/Button/Button";

export const CallToActionSection = ({ setCurrentPage }) => {
  return (
    <section className="call-to-action snap-section">
        <div className="container">
          <div className="section-logo-divider">
            <img src="/images/clover-logo.png" alt="Clover Logo" className="brand-logo-img-small" />
          </div>
          <div className="cta-panel animate-on-scroll">
            
            {/* ── FLOATING BRAND LOGO BACKGROUND EFFECT ── */}
            <div className="cta-floating-bg">
              <div className="bg-clover item-1">
                <img src="/images/clover-logo.png" alt="" aria-hidden="true" />
              </div>
              <div className="bg-clover item-2">
                <img src="/images/clover-logo.png" alt="" aria-hidden="true" />
              </div>
              <div className="bg-clover item-3">
                <img src="/images/clover-logo.png" alt="" aria-hidden="true" />
              </div>
              <div className="bg-clover item-4">
                <img src="/images/clover-logo.png" alt="" aria-hidden="true" />
              </div>
              <div className="bg-clover item-5">
                <img src="/images/clover-logo.png" alt="" aria-hidden="true" />
              </div>
            </div>

            <div className="cta-copy">
              <span className="cta-eyebrow">Your next favorite stop</span>
              <h2>Experience the <br />Clover Difference</h2>
              <p className="cta-description">
                Quality ingredients, bold flavors, and a cozy atmosphere built for slow mornings and easy catch-ups.
              </p>
              <div className="cta-meta-badge">
                <span className="pulse-dot"></span>
                <p className="cta-meta">Open daily — 7:00 AM to 9:00 PM</p>
              </div>
            </div>
            
            <div className="cta-actions">
              <Button onClick={() => setCurrentPage('products')} style={{ border: 'none', cursor: 'pointer' }}>Browse Menu</Button>
              <a href="#contact" className="btn-secondary">Plan Your Visit</a>
            </div>
          </div>
        </div>
      </section>
    );
};