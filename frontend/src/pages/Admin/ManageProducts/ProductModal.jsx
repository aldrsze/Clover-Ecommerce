import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { MENU_CATEGORIES } from "../../../constants/menuConstants";
import { Button } from "../../../components/common/Button/Button";
import "./ProductModal.css";

export const ProductModal = ({
  mode = "add",
  setIsModalOpen,
  handleSubmit,
  newProduct,
  handleInputChange,
  imagePreview,
  handleImageChange,
  clearForm,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const isEdit = mode === "edit";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
          <Button variant="text" onClick={() => setIsModalOpen(false)}>
            <X size={24} />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-form-body">
            {/* ── Left Column: Core product info ── */}
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

            <div className="form-group">
              <label>Preferences</label>
              <input
                type="text"
                name="preferences"
                value={newProduct.preferences}
                onChange={handleInputChange}
                placeholder="e.g. Sweet, Hot, Vegan"
              />
            </div>

            <div className="form-group form-group-image">
              <label>Product Image</label>
              <div
                className={`image-upload-area ${isDragging ? "dragging" : ""}`}
                onClick={() => document.getElementById("imageInput").click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleImageChange({
                      target: { files: e.dataTransfer.files },
                    });
                  }
                }}
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
                    <p className="caption">Click or drag to upload</p>
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

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Product description..."
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            {!isEdit && (
              <Button
                type="button"
                variant="admin-secondary"
                onClick={clearForm}
              >
                Clear Form
              </Button>
            )}
            <Button
              type="button"
              variant="admin-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="admin-primary" type="submit">
              {isEdit ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
