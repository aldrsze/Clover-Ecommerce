import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  X,
  Upload,
  Pencil,
  Trash,
  Package,
  AlertCircle,
  Bell,
  Image as ImageIcon,
} from "lucide-react";
import { MENU_CATEGORIES, CATEGORY_LABEL } from "../../../constants/menuConstants";
import { productsService } from "../../../api/productService";
import { Button } from "../../../components/common/Button/Button";
import { AddProductModal } from "./AddProductModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    preferences: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock_quantity", newProduct.stock_quantity);
    formData.append("category", newProduct.category);
    // Convert comma-separated preferences to array
    const prefsArray = newProduct.preferences
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "");
    formData.append("preferences", JSON.stringify(prefsArray));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await productsService.createProduct(formData);

      if (response.ok) {
        setIsModalOpen(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stock_quantity: "",
          category: "",
          preferences: "",
        });
        setImageFile(null);
        setImagePreview(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= 10,
  ).length;
  const outOfStockProducts = products.filter(
    (p) => p.stock_quantity === 0,
  ).length;

  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <div className="page-header-info">
            <span className="page-path">Catalog</span>
            <h1>Products</h1>
            <p>Manage your product catalog and inventory.</p>
          </div>
          <div className="page-header-actions">
            <Button variant="none" className="notification-trigger">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </Button>
          </div>
        </header>

        <div className="header-secondary-row">
          <div className="quick-stats-bar">
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
        </div>
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
            <Button variant="admin-secondary">
              <Filter size={16} />
              <span>Filter</span>
            </Button>
            <Button variant="admin-secondary">
              <Upload size={16} />
              <span>Export</span>
            </Button>
            <Button
              variant="admin-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} />
              <span>Add Product</span>
            </Button>
          </div>
        </div>

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
                            ? `http://localhost:5000/${product.image}`
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
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="text"
                        className="action-delete"
                        title="Delete product"
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
        <AddProductModal
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          newProduct={newProduct}
          handleInputChange={handleInputChange}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
        />
      )}
    </div>
  );
}
