import React from "react";
import { Button } from "../../../../../components/common/Button/Button";
import { PREF_LABEL, TAG_STYLES } from "../../../../../constants/menuConstants";
import "./ProductCard.css";

const ProductCard = ({ product, isAdded, handleAddToCart, handleBuyNow }) => {
  const tags = (product.preferences || []).slice(0, 2);

  return (
    <article className="product-card">
      <div className="card-img-wrap">
        <img
          src={
            product.image?.startsWith("uploads/")
              ? `http://localhost:5000/${product.image}`
              : `/${product.image}`
          }
          alt={product.name}
        />
        <Button
          variant="primary"
          className="quick-add-overlay"
          onClick={() => handleAddToCart(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          {isAdded ? "✓ Added" : "Add to Cart"}
        </Button>
      </div>
      <div className="card-body">
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.map((t) => (
              <span
                key={t}
                className="tag"
                style={
                  TAG_STYLES[t]
                    ? {
                        background: TAG_STYLES[t].background,
                        borderColor: TAG_STYLES[t].border,
                        color: TAG_STYLES[t].color,
                      }
                    : undefined
                }
              >
                {PREF_LABEL[t] || t}
              </span>
            ))}
          </div>
        )}
        <h3>{product.name}</h3>
        {product.description && (
          <p className="description">{product.description}</p>
        )}
        <span className="price">₱{Number(product.price).toFixed(2)}</span>
        <Button
          variant="secondary"
          className="btn-block-xs"
          onClick={() => handleBuyNow(product)}
        >
          Buy Now
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
