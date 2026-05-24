import React from "react";
import ProductCard from "../../../../components/features/ProductsPage/ProductCard";
import { MENU_CATEGORIES } from "../../../../../../constants/menuConstants";

const ProductGrid = ({
  filteredProducts,
  addedCards,
  handleAddToCart,
  loading,
  totalVisible,
}) => {
  if (loading) {
    return (
      <div className="products-loading-inline">
        <div className="loader-ring" />
        <p>Refreshing Menu</p>
      </div>
    );
  }

  if (totalVisible === 0) {
    return (
      <div className="empty-catalog">
        <h3>No products found</h3>
        <p>Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <>
      {MENU_CATEGORIES.map((catObj) => {
        const category = catObj.value;
        const items = filteredProducts.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase(),
        );
        if (items.length === 0) return null;

        return (
          <section key={category} id={category} className="product-category">
            <div className="category-header">
              <h2>{catObj.label}</h2>
              <span className="category-count">{items.length} items</span>
            </div>
            <div className="product-grid">
              {items.map((product) => {
                const isAdded = !!addedCards[product.id];
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdded={isAdded}
                    handleAddToCart={handleAddToCart}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
};

export default ProductGrid;
