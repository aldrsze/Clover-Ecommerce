import React, { useState, useEffect } from 'react';

export default function Header({ currentPage, setCurrentPage, cartCount }) {
  // New state to track which exact section we are currently looking at
  const [activeSection, setActiveSection] = useState('home');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // ── SCROLL SPY FOR NAVIGATION HIGHLIGHTS ──
  useEffect(() => {
    // If we are on the products page, keep Products highlighted
    if (currentPage === 'products') {
      setActiveSection('products');
      return;
    }

    const handleScroll = () => {
      // List of section IDs to track on the Home page
      const sections = ['home', 'about', 'contact'];
      let current = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          // Get the section's position. 150px offset accounts for the height of your sticky header.
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    // Call once to set initial state on load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const resetScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (sectionId === 'products') {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }

      setCurrentPage('products');
      resetScrollTop();
      requestAnimationFrame(resetScrollTop);
    } else {
      setCurrentPage('home');
      // Wait briefly for the home page component to mount before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  };

  return (
    <header>
      <div className="container header-grid">
        <div className="header-left">
          <div className="header-logo-brand" style={{ cursor: 'pointer' }} onClick={(e) => handleNavClick(e, 'home')}>
            <img src="/images/clover-logo.png" alt="Clover Logo" className="brand-logo-img" />
            <h1>Clover</h1>
          </div>
        </div>

        <nav className="header-center">
          <ul>
            <li>
              <a href="#home" className={activeSection === 'home' ? 'is-active' : ''} onClick={(e) => handleNavClick(e, 'home')}>Home</a>
            </li>
            <li>
              <a href="#products" className={activeSection === 'products' ? 'is-active' : ''} onClick={(e) => handleNavClick(e, 'products')}>Products</a>
            </li>
            <li>
              <a href="#about" className={activeSection === 'about' ? 'is-active' : ''} onClick={(e) => handleNavClick(e, 'about')}>About</a>
            </li>
            <li>
              <a href="#contact" className={activeSection === 'contact' ? 'is-active' : ''} onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
            </li>
          </ul>
        </nav>

        <div className="header-right">
          <div className={`search-wrapper ${isSearchActive ? 'active' : ''}`}>
            <button className="icon-btn search-trigger" onClick={() => setIsSearchActive(!isSearchActive)} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <input type="text" placeholder="Search our menu..." className="search-input" autoFocus={isSearchActive} />
          </div>

          <button className="icon-btn cart-btn" onClick={() => setCurrentPage('products')} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}