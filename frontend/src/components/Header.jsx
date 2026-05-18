import React from 'react';

export default function Header({ currentPage, setCurrentPage }) {
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (sectionId === 'products') {
      setCurrentPage('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <img src="/images/clover-logo.png" alt="Clover Logo" class="brand-logo-img" />
          <h1>Clover</h1>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#home" className={currentPage === 'home' ? 'is-active' : ''} onClick={(e) => handleNavClick(e, 'home')}>Home</a>
            </li>
            <li>
              <a href="#products" className={currentPage === 'products' ? 'is-active' : ''} onClick={(e) => handleNavClick(e, 'products')}>Products</a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}