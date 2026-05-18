import React, { useState, useEffect } from 'react';

export default function Header({ currentPage, setCurrentPage }) {
  // New state to track which exact section we are currently looking at
  const [activeSection, setActiveSection] = useState('home');

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
      <div className="container">
        <div className="header-logo-brand" style={{ cursor: 'pointer' }} onClick={(e) => handleNavClick(e, 'home')}>
          <img src="/images/clover-logo.png" alt="Clover Logo" className="brand-logo-img" />
          <h1>Clover</h1>
        </div>
        <nav>
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
      </div>
    </header>
  );
}