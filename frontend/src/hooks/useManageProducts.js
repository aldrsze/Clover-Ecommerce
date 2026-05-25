import { useState, useEffect } from "react";
import { productsService } from "../api/productService";
import toast from "react-hot-toast";

export const useManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
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
      toast.error("Failed to load products.");
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

  const clearForm = () => {
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
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setStockFilter("All");
    setMinPriceFilter("");
    setMaxPriceFilter("");
    setIsFilterPanelOpen(false);
  };

  // ── Open modal for adding a new product ──
  const openAddModal = () => {
    clearForm();
    setModalMode("add");
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // ── Open modal for editing an existing product ──
  const openEditModal = (product) => {
    setModalMode("edit");
    setEditingProduct(product);

    // Pre-populate form with existing product data
    const preferencesStr = Array.isArray(product.preferences)
      ? product.preferences.join(", ")
      : typeof product.preferences === "string"
        ? (() => {
            try {
              return JSON.parse(product.preferences).join(", ");
            } catch {
              return product.preferences;
            }
          })()
        : "";

    setNewProduct({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock_quantity: product.stock_quantity || "",
      category: product.category || "",
      preferences: preferencesStr,
    });

    // Set the existing image as preview
    if (product.image) {
      const imageUrl = product.image.startsWith("data:image")
        ? product.image
        : product.image.startsWith("uploads/")
          ? `${import.meta.env.VITE_SERVER_URL}/${product.image}`
          : `/${product.image}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);

    setIsModalOpen(true);
  };

  // ── Handle form submission for both add and edit ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert comma-separated preferences to array
    const prefsArray = newProduct.preferences
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "");

    const payload = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      stock_quantity: newProduct.stock_quantity,
      category: newProduct.category,
      preferences: prefsArray,
    };

    if (imageFile && imagePreview) {
      // imagePreview contains the Base64 string from FileReader
      payload.image = imagePreview;
    }

    try {
      let response;
      if (modalMode === "edit" && editingProduct) {
        response = await productsService.updateProduct(
          editingProduct.id,
          payload,
        );
      } else {
        response = await productsService.createProduct(payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        clearForm();
        setEditingProduct(null);
        fetchProducts();
        toast.success("Product saved successfully.");
      } else {
        toast.error("Failed to save product.");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error?.message || "Failed to save product.");
    }
  };

  // ── Handle product deletion ──
  const handleDelete = async (id) => {
    try {
      const response = await productsService.deleteProduct(id);
      if (response.ok) {
        setDeletingProduct(null);
        fetchProducts();
        toast.success("Product deleted successfully.");
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error?.message || "Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    const productName = String(product.name || "").toLowerCase();
    const productCategory = String(product.category || "").toLowerCase();
    const matchesSearch = !query || productName.includes(query) || productCategory.includes(query);

    const matchesCategory =
      categoryFilter === "All" || String(product.category || "") === categoryFilter;
    const matchesStock =
      stockFilter === "All" ||
      (stockFilter === "In Stock" && Number(product.stock_quantity || 0) > 0) ||
      (stockFilter === "Out of Stock" && Number(product.stock_quantity || 0) === 0);

    const price = Number(product.price || 0);
    const minPrice = minPriceFilter === "" ? null : Number(minPriceFilter);
    const maxPrice = maxPriceFilter === "" ? null : Number(maxPriceFilter);
    const matchesMinPrice = minPrice === null || Number.isNaN(minPrice) || price >= minPrice;
    const matchesMaxPrice = maxPrice === null || Number.isNaN(maxPrice) || price <= maxPrice;

    return matchesSearch && matchesCategory && matchesStock && matchesMinPrice && matchesMaxPrice;
  });

  const productCategories = [
    ...new Set(products.map((product) => String(product.category || "").trim()).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= 10,
  ).length;
  const outOfStockProducts = products.filter(
    (p) => p.stock_quantity === 0,
  ).length;

  return {
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
    editingProduct,
    deletingProduct,
    setDeletingProduct,
    handleDelete,
    filteredProducts,
    productCategories,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
  };
};
