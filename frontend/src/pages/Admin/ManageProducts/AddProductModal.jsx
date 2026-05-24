import React from "react";
import { X, Upload } from "lucide-react";
import { MENU_CATEGORIES } from "../../../constants/menuConstants";
import { Button } from "../../../components/common/Button/Button";
import "./AddProductModal.css";

export const AddProductModal = ({
  setIsModalOpen,
  handleSubmit,
  newProduct,
  handleInputChange,
  imagePreview,
  handleImageChange,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Product</h2>
          <Button variant="text" onClick={() => setIsModalOpen(false)}>
            <X size={24} />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="e.g. Classic Cinnamon Roll"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Product description..."
            ></textarea>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={newProduct.stock_quantity}
                onChange={handleInputChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {MENU_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Preferences (comma separated)</label>
            <input
              type="text"
              name="preferences"
              value={newProduct.preferences}
              onChange={handleInputChange}
              placeholder="e.g. Sweet, Hot, Vegan"
            />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <div
              className="image-upload-area"
              onClick={() => document.getElementById("imageInput").click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview-large"
                />
              ) : (
                <>
                  <div className="upload-icon">
                    <Upload size={32} />
                  </div>
                  <p className="caption">Click to upload or drag and drop</p>
                  <p className="caption" style={{ marginTop: "4px" }}>
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                </>
              )}
              <input
                id="imageInput"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <Button
              type="button"
              variant="admin-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="admin-primary" type="submit">
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
