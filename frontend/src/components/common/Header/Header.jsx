import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';

export default function Header({ currentPage, setCurrentPage, cartCount }) {
  const [activeSection, setActiveSection] = useState('home');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // ── SCROLL SPY FOR NAVIGATION HIGHLIGHTS ──
  useEffect(() => {
    if (currentPage === 'products') {
      setActiveSection('products');
      return;
    }

    const handleScroll = () => {
      const sections = ['home', 'about', 'contact'];
      let current = 'home';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const smoothScrollTo = (targetY, duration = 1000) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();
    const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();

    // Products — switch page and hard reset to top
    if (sectionId === 'products') {
      setCurrentPage('products');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const restore = () => {
      document.body.classList.add('has-snap-scroll');
      document.body.classList.remove('snap-disabled');
    };

    document.body.classList.remove('has-snap-scroll');
    document.body.classList.add('snap-disabled');

    // Home — scroll to absolute top
    if (sectionId === 'home') {
      setCurrentPage('home');
      smoothScrollTo(0, 1000);
      if ('onscrollend' in window) {
        window.addEventListener('scrollend', restore, { once: true });
      } else {
        setTimeout(restore, 1400);
      }
      return;
    }

    // All other sections
    setCurrentPage('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (!element) return;
      const targetY = element.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(targetY, 1000);
      if ('onscrollend' in window) {
        window.addEventListener('scrollend', restore, { once: true });
      } else {
        setTimeout(restore, 1400);
      }
    }, 50);
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
              <a href="#about" className={activeSection === 'about' ? 'is-active' : ''} onClick={(e) => handleNavClick(e, 'about')}>About</a>
            </li>
            <li>
              <a href="#contact" className={activeSection === 'contact' ? 'is-active' : ''} onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
            </li>
            <li>
              <a href="#products" className={activeSection === 'products' ? 'is-active' : ''} onClick={(e) => handleNavClick(e, 'products')}>Products</a>
            </li>
          </ul>
        </nav>

        <div className="header-right">
          <div className={`search-wrapper ${isSearchActive ? 'active' : ''}`}>
            <button className="icon-btn search-trigger" onClick={() => setIsSearchActive(!isSearchActive)} aria-label="Search">
              <Search size={20} />
            </button>
            <input type="text" placeholder="Search our menu..." className="search-input" autoFocus={isSearchActive} />
          </div>

          <button className="icon-btn cart-btn" onClick={() => setCurrentPage('products')} aria-label="Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}