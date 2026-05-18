import React from 'react';

export default function Footer({ setCurrentPage }) {
  const handleNavScroll = (e, sectionId) => {
    e.preventDefault();
    setCurrentPage('home');
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About Clover</h3>
            <p>Your one-stop shop for delicious beverages, breakfast, sandwiches, and pastries. Experience quality and freshness every day.</p>
          </div>
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home" onClick={(e) => handleNavScroll(e, 'home')}>Home</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); setCurrentPage('products'); window.scrollTo(0,0); }}>Shop All</a></li>
              <li><a href="#about" onClick={(e) => handleNavScroll(e, 'about')}>About Us</a></li>
              <li><a href="#contact" onClick={(e) => handleNavScroll(e, 'contact')}>Contact</a></li>
            </ul>
          </div>
          <div className="footer-section contact">
            <h3>Customer Service</h3>
            <ul>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" className="icon facebook" onClick={e => e.preventDefault()}>FB</a>
              <a href="#" className="icon twitter" onClick={e => e.preventDefault()}>TW</a>
              <a href="#" className="icon instagram" onClick={e => e.preventDefault()}>IG</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Clover. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}