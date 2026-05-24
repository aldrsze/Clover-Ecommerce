import React from "react";
import { Button } from "../../../../../components/common/Button/Button";
import {
  MENU_CATEGORIES,
  MENU_PREFERENCES,
} from "../../../../../constants/menuConstants";

export const ProductSidebar = ({
  products,
  loading,
  activeCategory,
  selectedPrefs,
  handleScrollToSection,
  togglePref,
}) => {
  return (
    <aside className="sidebar">
      {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
      {/* Category nav */}
      <section className="filter-group">
        <h3>Categories</h3>
        <ul>
          {MENU_CATEGORIES.map((catObj) => {
            const cat = catObj.value;
            // Keep counts relative to what the DB returned
            const count = products
              ? products.filter((p) => p.category === cat).length
              : 0;
            return (
              <li key={cat}>
                <a
                  href={`#${cat}`}
                  className={activeCategory === cat ? "is-active" : ""}
                  onClick={(e) => handleScrollToSection(e, cat)}
                >
                  <span>{catObj.label}</span>
                  <span className="nav-count">{loading ? "..." : count}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Preference filters */}
      <section className="filter-group">
        <h3>Filter by Preference</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          {MENU_PREFERENCES.map(({ value: key, label }) => (
            <div key={key}>
              <input
                type="checkbox"
                id={key}
                checked={selectedPrefs?.includes(key)}
                onChange={() => togglePref(key)}
              />
              <label htmlFor={key}>{label}</label>
            </div>
          ))}
        </form>
      </section>

      {/* Promo banner */}
      <div className="promo-banner">
        <div className="promo-badge">Specials</div>
        <div className="promo-img-wrap">
          <img
            src="../../../../../../../public/images/products/Torched-Classic-Cheesecake-3-600x600.jpg"
            alt="Torched Classic Cheesecake"
          />
        </div>

        <div className="promo-content">
          <h4>Featured Dessert</h4>
          <p className="promo-title">Torched Classic Cheesecake</p>
          <p className="promo-desc">Rich, creamy, and torched to perfection.</p>
          <Button
            variant="secondary"
            className="btn-block-sm"
            onClick={(e) => handleScrollToSection(e, "pastries")}
          >
            View in Pastries
          </Button>
        </div>
      </div>
    </aside>
  );
};
