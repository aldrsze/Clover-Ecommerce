import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { smoothScrollTo } from "../../../utils/scrollUtils";
import { useScrollSpy } from "../../../hooks/useScrollSpy";
import { Button } from "../Button/Button";

export default function Header({ currentPage, setCurrentPage, cartCount }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [clickedSection, setClickedSection] = useState(null);
  const activeSection = useScrollSpy(["home", "about", "contact"]);

  const displayActiveSection =
    currentPage === "products" ? "products" : clickedSection || activeSection;

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();

    // Products — switch page and hard reset to top
    if (sectionId === "products") {
      setCurrentPage("products");
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const restore = () => {
      document.body.classList.add("has-snap-scroll");
      document.body.classList.remove("snap-disabled");
      setClickedSection(null);
    };

    document.body.classList.remove("has-snap-scroll");
    document.body.classList.add("snap-disabled");
    setClickedSection(sectionId);

    // Home — scroll to absolute top
    if (sectionId === "home") {
      setCurrentPage("home");
      smoothScrollTo(0, 1000, restore);
      return;
    }

    // All other sections
    setCurrentPage("home");
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (!element) return;
      const targetY = element.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(targetY, 1000, restore);
    }, 50);
  };

  return (
    <header>
      <div className="container header-grid">
        <div className="header-left">
          <div
            className="header-logo-brand"
            style={{ cursor: "pointer" }}
            onClick={(e) => handleNavClick(e, "home")}
          >
            <img
              src="/images/brand/clover-logo.png"
              alt="Clover Logo"
              className="brand-logo-img"
            />
            <h1>Clover</h1>
          </div>
        </div>

        <nav className="header-center">
          <ul>
            <li>
              <a
                href="#home"
                className={displayActiveSection === "home" ? "is-active" : ""}
                onClick={(e) => handleNavClick(e, "home")}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={displayActiveSection === "about" ? "is-active" : ""}
                onClick={(e) => handleNavClick(e, "about")}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={
                  displayActiveSection === "contact" ? "is-active" : ""
                }
                onClick={(e) => handleNavClick(e, "contact")}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#products"
                className={
                  displayActiveSection === "products" ? "is-active" : ""
                }
                onClick={(e) => handleNavClick(e, "products")}
              >
                Products
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-right">
          <div className={`search-wrapper ${isSearchActive ? "active" : ""}`}>
            <Button
              variant="none"
              className="icon-btn search-trigger"
              onClick={() => setIsSearchActive(!isSearchActive)}
              aria-label="Search"
            >
              <Search size={20} />
            </Button>
            <input
              type="text"
              placeholder="Search our menu..."
              className="search-input"
              autoFocus={isSearchActive}
            />
          </div>

          <Button
            variant="none"
            className="icon-btn user-btn"
            onClick={() => alert("Customer account functionality coming soon!")}
            aria-label="User"
          >
            <User size={20} />
          </Button>

          <Button
            variant="none"
            className="icon-btn cart-btn"
            onClick={() => setCurrentPage("products")}
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Button>
        </div>
      </div>
    </header>
  );
}
