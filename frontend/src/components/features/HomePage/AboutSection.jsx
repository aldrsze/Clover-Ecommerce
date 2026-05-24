import React from "react";

export const AboutSection = ( {setCurrentPage} ) => {
  return (
    <section id="about" className="about-us-container snap-section">
      <div className="container">
        <div className="about-content-wrapper">
          <div className="animate-on-scroll fade-in-left">
            <div className="text-composition">
              <div className="large-about-logo">
                <img
                  src="/images/clover-logo.png"
                  alt="Clover Logo"
                  className="brand-logo-img-large animated-logo"
                />
              </div>
              <h1 className="animated-clover-text">
                <span>C</span>
                <span>l</span>
                <span>o</span>
                <span>v</span>
                <span>e</span>
                <span>r</span>
              </h1>
              <div className="text-decorative-glow"></div>
            </div>
          </div>
          <div className="about-text-side animate-on-scroll fade-in-right">
            <h2>The Art of Brewing & Baking</h2>
            <p className="lead-text">
              At Clover, we believe that the simplest ingredients, when handled
              with passion and precision, create the most extraordinary
              experiences.
            </p>

            <div className="about-values">
              <div className="value-item">
                <h3>Pure Origins</h3>
                <p>
                  We source only the finest coffee beans and organic ingredients
                  from sustainable farms around the globe.
                </p>
              </div>
              <div className="value-item">
                <h3>Artisan Craft</h3>
                <p>
                  Every pastry is hand-rolled and every cup is meticulously
                  brewed by our master baristas.
                </p>
              </div>
              <div className="value-item">
                <h3>Community Heart</h3>
                <p>
                  More than a shop, Clover is a space for connection,
                  creativity, and quiet moments of joy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
