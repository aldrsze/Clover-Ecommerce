import React from "react";
import {
  Plus,
  Search,
  Filter,
  X,
  Pencil,
  Trash,
  Package,
  AlertCircle,
} from "lucide-react";
import { CATEGORY_LABEL } from "../../../constants/menuConstants";
import { Button } from "../../../components/common/Button/Button";
import { ProductModal } from "./ProductModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { useManageProducts } from "../../../hooks/useManageProducts";

export default function Products() {
  const {
    isModalOpen,
    setIsModalOpen,
    modalMode,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    minPriceFilter,
    setMinPriceFilter,
    maxPriceFilter,
    setMaxPriceFilter,
    isFilterPanelOpen,
    setIsFilterPanelOpen,
    clearFilters,
    newProduct,
    imagePreview,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    clearForm,
    openAddModal,
    openEditModal,
    deletingProduct,
    setDeletingProduct,
    handleDelete,
    filteredProducts,
    productCategories,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
  } = useManageProducts();

  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <h1>Products</h1>

          <div className="quick-stats-bar" style={{ padding: 0 }}>
            <div className="stat-card">
              <div className="stat-icon">
                <Package size={14} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{totalProducts}</span>
                <span className="stat-label">Total Products</span>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <AlertCircle size={14} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{lowStockProducts}</span>
                <span className="stat-label">Low Stock</span>
              </div>
            </div>
            <div className="stat-card danger">
              <div className="stat-icon">
                <X size={14} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{outOfStockProducts}</span>
                <span className="stat-label">Out of Stock</span>
              </div>
            </div>
          </div>

        </header>
      </div>

      <div className="view-content">
        <div className="table-search-bar">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="action-buttons">
            <Button
              variant="admin-secondary"
              onClick={() => setIsFilterPanelOpen((prev) => !prev)}
              className={isFilterPanelOpen ? "is-active" : ""}
              title="Toggle product filters"
            >
              <Filter size={16} />
              <span>Filter</span>
            </Button>
            <Button
              variant="admin-primary"
              onClick={openAddModal}
            >
              <Plus size={16} />
              <span>Add Product</span>
            </Button>
          </div>
        </div>

        {isFilterPanelOpen && (
          <div className="product-filters-panel">
            <div className="product-filters-grid">
              <label className="field compact">
                <span>Category</span>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="All">All categories</option>
                  {productCategories.map((category) => (
                    <option key={category} value={category}>
                      {CATEGORY_LABEL[category] || category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field compact">
                <span>Stock</span>
                <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                  <option value="All">All stock</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </label>

              <label className="field compact">
                <span>Min price</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={minPriceFilter}
                  onChange={(e) => setMinPriceFilter(e.target.value)}
                  placeholder="0.00"
                />
              </label>

              <label className="field compact">
                <span>Max price</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(e.target.value)}
                  placeholder="0.00"
                />
              </label>
            </div>

            <div className="product-filters-footer">
              <Button variant="admin-secondary" onClick={clearFilters}>
                Reset filters
              </Button>
            </div>
          </div>
        )}

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <input type="checkbox" />
                </th>
                <th style={{ width: "80px" }}>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Preferences</th>
                <th>Status</th>
                <th style={{ width: "80px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <span className="sku">#{product.id}</span>
                  </td>
                  <td>
                    <div className="product-cell">
                      <img
                        src={
                          product.image?.startsWith("uploads/")
                            ? `${import.meta.env.VITE_SERVER_URL}/${product.image}`
                            : `/${product.image}`
                        }
                        alt={product.name}
                        className="product-img"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/48?text=No+Img";
                        }}
                      />
                      <div className="product-info">
                        <span className="name">{product.name}</span>
                        <p className="description">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {CATEGORY_LABEL[product.category] ||
                      product.category ||
                      "Uncategorized"}
                  </td>
                  <td>₱{parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.stock_quantity}</td>
                  <td>
                    <div className="preferences-tags">
                      {Array.isArray(product.preferences)
                        ? product.preferences.map((pref, i) => (
                            <span key={i} className="pref-tag">
                              {pref}
                            </span>
                          ))
                        : typeof product.preferences === "string"
                          ? JSON.parse(product.preferences).map((pref, i) => (
                              <span key={i} className="pref-tag">
                                {pref}
                              </span>
                            ))
                          : null}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${product.stock_quantity > 0 ? "active" : "inactive"}`}
                    >
                      {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Button
                        variant="text"
                        className="action-edit"
                        title="Edit product"
                        onClick={() => openEditModal(product)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="text"
                        className="action-delete"
                        title="Delete product"
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal
          mode={modalMode}
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          newProduct={newProduct}
          handleInputChange={handleInputChange}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          clearForm={clearForm}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onConfirm={handleDelete}
          onCancel={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
}
