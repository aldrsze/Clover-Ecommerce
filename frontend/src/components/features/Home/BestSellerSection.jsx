import React from "react";

export const BestSellerSection = ({ setCurrentPage }) => {
  return (
    <section className="featured-products snap-section" id="bestsellers">
        <div className="container">
          <div className="section-logo-divider">
            <img src="/images/clover-logo.png" alt="Clover Logo" className="brand-logo-img-small" />
          </div>
          <h2>Our Bestsellers</h2>
          <div className="featured-grid">
            <article className="featured-card animate-on-scroll">
              <div className="product-tag">Breakfast</div>
              <div className="product-image-container">
                <img src="/images/BIG-BREAKFAST-3.jpg" alt="The Big Breakfast" />
              </div>
              <div className="product-info">
                <h3>The Big Breakfast</h3>
                <p>Our signature morning plate with farm-fresh eggs and artisanal toast.</p>
                <span className="price">₱295.00</span>
                <button onClick={() => setCurrentPage('products')} className="btn-secondary" style={{ border: 'none', cursor: 'pointer', display: 'block', width: '100%', marginTop: '10px' }}>View Details</button>
              </div>
            </article>

            <article className="featured-card animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
              <div className="product-tag">Pastries</div>
              <div className="product-image-container">
                <img src="/images/Blueberry-Cheesecake-600x600.jpg" alt="Blueberry Cheesecake" />
              </div>
              <div className="product-info">
                <h3>Blueberry Cheesecake</h3>
                <p>Creamy NY-style cheesecake topped with wild mountain blueberries.</p>
                <span className="price">₱230.00</span>
                <button onClick={() => setCurrentPage('products')} className="btn-secondary" style={{ border: 'none', cursor: 'pointer', display: 'block', width: '100%', marginTop: '10px' }}>View Details</button>
              </div>
            </article>

            <article className="featured-card animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
              <div className="product-tag">Beverages</div>
              <div className="product-image-container">
                <img src="/images/ICED-WHITE-CHOCOLATE-MOCHA-removebg.png" alt="Iced White Chocolate Mocha" />
              </div>
              <div className="product-info">
                <h3>White Chocolate Mocha</h3>
                <p>Premium espresso swirled with velvet white chocolate over ice.</p>
                <span className="price">₱450.00</span>
                <button onClick={() => setCurrentPage('products')} className="btn-secondary" style={{ border: 'none', cursor: 'pointer', display: 'block', width: '100%', marginTop: '10px' }}>View Details</button>
              </div>
            </article>
          </div>
        </div>
      </section>
    );
};