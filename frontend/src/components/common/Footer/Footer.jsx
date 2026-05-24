import React from "react";
import { smoothScrollTo } from "../../../utils/scrollUtils";

export default function Footer({ setCurrentPage }) {
  const handleNavScroll = (e, sectionId) => {
    e.preventDefault();

    const restore = () => {
      document.body.classList.add("has-snap-scroll");
      document.body.classList.remove("snap-disabled");
    };

    document.body.classList.remove("has-snap-scroll");
    document.body.classList.add("snap-disabled");
    setCurrentPage("home");

    setTimeout(() => {
      if (sectionId === "home") {
        smoothScrollTo(0, 1000);
      } else {
        const element = document.getElementById(sectionId);
        if (!element) return;
        const targetY = element.getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(targetY, 1000);
      }

      if ("onscrollend" in window) {
        window.addEventListener("scrollend", restore, { once: true });
      } else {
        setTimeout(restore, 1000);
      }
    }, 50);
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About Clover</h3>
            <p>
              Your one-stop shop for delicious beverages, breakfast, sandwiches,
              and pastries. Experience quality and freshness every day.
            </p>
          </div>
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#home" onClick={(e) => handleNavScroll(e, "home")}>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage("products");
                    window.scrollTo(0, 0);
                  }}
                >
                  Shop All
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleNavScroll(e, "about")}>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavScroll(e, "contact")}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section contact">
            <h3>Customer Service</h3>
            <ul>
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Shipping & Returns</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a
                href="#"
                className="icon facebook"
                onClick={(e) => e.preventDefault()}
                aria-label="Facebook"
              >
                <img src="/icons/facebook.svg" alt="Facebook" />
              </a>
              <a
                href="#"
                className="icon instagram"
                onClick={(e) => e.preventDefault()}
                aria-label="Instagram"
              >
                <img src="/icons/instagram.svg" alt="Instagram" />
              </a>
              <a
                href="#"
                className="icon x-twitter"
                onClick={(e) => e.preventDefault()}
                aria-label="X (Twitter)"
              >
                <img src="/icons/x.svg" alt="X" />
              </a>
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
