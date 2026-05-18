import React, { useEffect } from 'react';

export default function Home({ setCurrentPage }) {
  useEffect(() => {
    // Exact scroll-reveal animation observer ported from main.js
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      animationObserver.observe(el);
    });

    return () => animationObserver.disconnect();
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <main className="home-page-content" id="home">
      <div className="container">
        
        {/* HERO SECTION — Fully Restored with 3-Image Composite Layout */}
        <section className="hero-section">
          <div className="hero-content-wrapper">
            <div className="hero-text-side animate-on-scroll fade-in-left">
              <h2 className="hero-title">Experience <br /><span>Pure Delight</span></h2>
              <p className="hero-subtitle">Crafting extraordinary coffee and artisan pastries for those who appreciate the finer things in life.</p>
              <div className="hero-actions">
                <button onClick={() => setCurrentPage('products')} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>Explore Menu</button>
                <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="btn-secondary">Our Story</a>
              </div>
            </div>
            <div className="hero-image-side animate-on-scroll fade-in-right">
              <div className="hero-composition">
                <div className="comp-item main">
                  <img src="/images/ICED-WHITE-CHOCOLATE-MOCHA-removebg.png" alt="Iced White Chocolate Mocha" className="floating-img" />
                </div>
                <div className="comp-item sub-1">
                  <img src="/images/JAVACHIP-JAVAKULA-removebg.png" alt="Javachip Javakula" className="floating-img-alt" />
                </div>
                <div className="comp-item sub-2">
                  <img src="/images/Strawberry-Milkshake-600x600-removebg.png" alt="Strawberry Milkshake" className="floating-img" />
                </div>
                <div className="hero-decorative-bg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* BESTSELLERS SECTION — Restored 3-Item Catalog */}
        <section className="featured-products" id="bestsellers">
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
        </section>

        {/* CALL TO ACTION */}
        <section className="call-to-action">
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
              <button onClick={() => setCurrentPage('products')} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>Browse Menu</button>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="btn-secondary">Plan Your Visit</a>
            </div>
          </div>
        </section>

        {/* ABOUT US SECTION — Fully Restored Text & Values */}
        <section id="about" className="about-us-container">
          <div className="about-content-wrapper">
            <div className="about-image-side animate-on-scroll fade-in-left">
              <div className="text-composition">
                <div className="large-about-logo">
                  <img src="/images/clover-logo.png" alt="Clover Logo" className="brand-logo-img-large animated-logo" />
                </div>
                <h1 className="animated-clover-text">
                  <span>C</span><span>l</span><span>o</span><span>v</span><span>e</span><span>r</span>
                </h1>
                <div className="text-decorative-glow"></div>
              </div>
            </div>
            <div className="about-text-side animate-on-scroll fade-in-right">
              <h2>The Art of Brewing & Baking</h2>
              <p className="lead-text">At Clover, we believe that the simplest ingredients, when handled with passion and precision, create the most extraordinary experiences.</p>
              
              <div className="about-values">
                <div className="value-item">
                  <h3>Pure Origins</h3>
                  <p>We source only the finest coffee beans and organic ingredients from sustainable farms around the globe.</p>
                </div>
                <div className="value-item">
                  <h3>Artisan Craft</h3>
                  <p>Every pastry is hand-rolled and every cup is meticulously brewed by our master baristas.</p>
                </div>
                <div className="value-item">
                  <h3>Community Heart</h3>
                  <p>More than a shop, Clover is a space for connection, creativity, and quiet moments of joy.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION — Fully Restored Contact Specifications */}
        <section id="contact" className="contact-section">
          <div className="contact-text-side animate-on-scroll fade-in-left">
            <h2>Get in Touch</h2>
            <p className="contact-lead">Have a question or need assistance? We'd love to hear from you. Drop us a line or visit our shop.</p>
            
            <div class="contact-info-list">
              <div class="info-item">
                <strong>Location</strong>
                <p>27 Maginhawa Street, Diliman, Quezon City, Metro Manila, Philippines 1101</p>
              </div>
              <div class="info-item">
                <strong>Phone</strong>
                <p>+63 917 845 2731</p>
              </div>
              <div class="info-item">
                <strong>Email</strong>
                <p>hello@clovercoffee.ph</p>
              </div>
              <div class="info-item">
                <strong>Business Hours</strong>
                <p>Monday - Sunday: 7:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>

          <div className="contact-form-side animate-on-scroll fade-in-right">
            <form className="boutique-contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Full Name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="email@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          </div>
        </section>

      </div>
    </main>
  );
}