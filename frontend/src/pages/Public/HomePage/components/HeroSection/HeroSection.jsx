import React from "react";

import { Button } from "../../../../../components/common/Button/Button";

export const HeroSection = ({ setCurrentPage }) => {
  return (
    <section className="hero-section snap-section">
      <div className="container">
        <div className="hero-content-wrapper">
          <div className="hero-text-side animate-on-scroll fade-in-left">
            <h2 className="hero-title">
              Experience <br />
              <span>Pure Delight</span>
            </h2>
            <p className="hero-subtitle">
              Crafting extraordinary coffee and artisan pastries for those who
              appreciate the finer things in life.
            </p>
            <div className="hero-actions">
              <Button
                onClick={() => setCurrentPage("products")}
                style={{ border: "none", cursor: "pointer" }}
              >
                Explore Menu
              </Button>
              <a href="#about" className="btn-secondary">
                Our Story
              </a>
            </div>
          </div>
          <div className="hero-image-side animate-on-scroll fade-in-right">
            <div className="hero-composition">
              <div className="comp-item main">
                <img
                  src="/images/hero/ICED-WHITE-CHOCOLATE-MOCHA-hero.png"
                  alt="Iced White Chocolate Mocha"
                  className="floating-img"
                />
              </div>
              <div className="comp-item sub-1">
                <img
                  src="/images/hero/JAVACHIP-JAVAKULA-hero.png"
                  alt="Javachip Javakula"
                  className="floating-img-alt"
                />
              </div>
              <div className="comp-item sub-2">
                <img
                  src="/images/hero/Strawberry-Milkshake-600x600-hero.png"
                  alt="Strawberry Milkshake"
                  className="floating-img"
                />
              </div>
              <div className="hero-decorative-bg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
