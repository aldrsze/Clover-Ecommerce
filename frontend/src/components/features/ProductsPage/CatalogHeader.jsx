import React from "react";
import { Button } from "../../common/Button";

export const CatalogHeader = ({
  totalVisible,
  loading,
  selectedPrefs,
  removePref,
  PREF_LABEL,
}) => {
  return (
    <div className="catalog-header-main">
      <div className="catalog-hero-strip">
        <div className="hero-text-content">
          <span className="catalog-eyebrow">The Collection</span>
          <h1>
            Artisan Excellence <br />
            <span>Globally Sourced</span>
          </h1>
          <p className="catalog-description">
            A curated selection of the world's finest coffee beans, premium
            pastries, and savory creations, meticulously crafted for those who
            appreciate the art of fine flavors.
          </p>
        </div>
        <div className="hero-visual-accent">
          <div className="hero-gallery-mosaic">
            <div
              className="mosaic-item item-1 animate-entrance"
              style={{ animationDelay: "0s" }}
            >
              <img
                src="/images/BIG-BREAKFAST-3.jpg"
                alt="Artisan Breakfast"
                loading="eager"
              />
              <div className="mosaic-overlay"></div>
            </div>
            <div
              className="mosaic-item item-2 animate-entrance"
              style={{ animationDelay: "0.1s" }}
            >
              <img
                src="/images/Margherita-Flatbread-600x600-removebg.png"
                alt="Savory Flatbread"
                loading="eager"
              />
            </div>
            <div
              className="mosaic-item item-3 animate-entrance"
              style={{ animationDelay: "0.15s" }}
            >
              <img
                src="/images/Nutella-Croissant-600x600.jpg"
                alt="Handcrafted Pastries"
                loading="eager"
              />
            </div>
            <div
              className="mosaic-item item-4 animate-entrance"
              style={{ animationDelay: "0.2s" }}
            >
              <img
                src="/images/QUATTRO-removebg.png"
                alt="Premium Selections"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="catalog-controls">
        <div className="catalog-info-area">
          <p className="result-count">
            {loading ? (
              "Discovering flavors..."
            ) : (
              <>
                Showing <span>{totalVisible}</span> curated items
              </>
            )}
          </p>
        </div>

        {selectedPrefs.length > 0 && (
          <div className="active-filters">
            <span className="filter-label">Refined by:</span>
            <div className="filter-chips-wrap">
              {selectedPrefs.map((p) => (
                <Button
                  key={p}
                  variant="secondary"
                  className="filter-chip"
                  onClick={() => removePref(p)}
                >
                  {PREF_LABEL[p] || p}
                  <span className="chip-x" aria-hidden="true">
                    ×
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
