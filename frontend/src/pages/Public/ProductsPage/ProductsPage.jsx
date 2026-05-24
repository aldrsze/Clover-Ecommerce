import React from "react";
import { ProductSidebar } from "./components/ProductSidebar/ProductSidebar";
import { CatalogHeader } from "./components/CatalogHeader/CatalogHeader";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import { useProducts } from "../../../hooks/useProducts";
import { PREF_LABEL } from "../../../constants/menuConstants";
import {
  useScrollReset,
  useCatalogScrollSpy,
  useProductFilters,
  useCartFeedback,
} from "../../../hooks/useCatalog";

export default function Products({ addToCart }) {
  const { selectedPrefs, togglePref, removePref } = useProductFilters();

  const queryString =
    selectedPrefs.length > 0 ? `?preferences=${selectedPrefs.join(",")}` : "";
  const { products, loading, error } = useProducts(queryString);

  const { activeCategory, handleScrollToSection } = useCatalogScrollSpy(
    loading,
    [selectedPrefs],
  );
  const { addedCards, handleAddToCart } = useCartFeedback(addToCart);

  useScrollReset();

  const filteredProducts = products;
  const totalVisible = filteredProducts.length;

  return (
    <>
      {/* High-end Panel Loader (Initial only) */}
      {loading && products.length === 0 && (
        <div className="products-panel-loader">
          <div className="loader-bar-wrap">
            <div className="loader-bar-fill" />
          </div>
          <p>Loading the Collection</p>
        </div>
      )}

      <div
        className={`container products-entrance-container ${!loading ? "is-loaded" : ""}`}
        style={{
          marginTop: "30px",
          width: "100%",
          maxWidth: "var(--container)",
        }}
      >
        <div className="product-page-layout">
          <ProductSidebar
            products={products}
            loading={loading}
            activeCategory={activeCategory}
            handleScrollToSection={handleScrollToSection}
            selectedPrefs={selectedPrefs}
            togglePref={togglePref}
          />
          {/* ── CATALOG ──────────────────────────────────────────────────── */}
          <main className="main-product-catalog">
            <CatalogHeader
              loading={loading}
              totalVisible={totalVisible}
              selectedPrefs={selectedPrefs}
              removePref={removePref}
              PREF_LABEL={PREF_LABEL}
            />

            {/* Category sections or Loading Spinner */}
            <ProductGrid
              filteredProducts={filteredProducts}
              addedCards={addedCards}
              handleAddToCart={handleAddToCart}
              loading={loading}
              totalVisible={totalVisible}
            />
          </main>
        </div>
      </div>
    </>
  );
}
