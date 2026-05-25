import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { smoothScrollTo } from "../../../utils/scrollUtils";
import { useScrollSpy } from "../../../hooks/useScrollSpy";
import { Button } from "../Button/Button";

export default function Header({ currentPage, setCurrentPage, cartCount, user, setUser, clearCart, setIsCartOpen, setIsOrdersModalOpen, setIsProfileModalOpen }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

          <div className="user-menu-wrapper" style={{ position: "relative" }}>
            <Button
              variant="none"
              className="icon-btn user-btn"
              onClick={() => {
                if (user) {
                  setIsUserMenuOpen(!isUserMenuOpen);
                } else {
                  window.history.pushState({}, "", "/auth");
                  setCurrentPage("auth");
                }
              }}
              aria-label="User"
            >
              {user ? (
                <div className="user-avatar" style={{ 
                  width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--text)', color: 'var(--bg)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' 
                }}>
                  {user.first_name[0]}{user.last_name[0]}
                </div>
              ) : (
                <User size={20} />
              )}
            </Button>

            {user && isUserMenuOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown-header" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div className="user-avatar-large" style={{ 
                    width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--text)', color: 'var(--bg)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', flexShrink: 0
                  }}>
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <strong>{user.first_name} {user.last_name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <div className="user-dropdown-body">
                  <button className="user-dropdown-item" onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsUserMenuOpen(false);
                  }}>
                    My Profile
                  </button>
                  <button className="user-dropdown-item" onClick={() => {
                    setIsOrdersModalOpen(true);
                    setIsUserMenuOpen(false);
                  }}>
                    My Orders
                  </button>
                  <div className="user-dropdown-divider"></div>
                  <button 
                    className="user-dropdown-item text-danger"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      clearCart();
                      setUser(null);
                      setIsUserMenuOpen(false);
                      setCurrentPage("home");
                    }}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentPage === "products" && (
            <Button
              variant="none"
              className="icon-btn cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
