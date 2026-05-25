import { useState, useEffect } from "react";
import { productsService } from "../api/productService";

export const useManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
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
      const imageUrl = product.image.startsWith("uploads/")
        ? `http://localhost:5000/${product.image}`
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
      let response;
      if (modalMode === "edit" && editingProduct) {
        response = await productsService.updateProduct(
          editingProduct.id,
          formData,
        );
      } else {
        response = await productsService.createProduct(formData);
      }

      if (response.ok) {
        setIsModalOpen(false);
        clearForm();
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // ── Handle product deletion ──
  const handleDelete = async (id) => {
    try {
      const response = await productsService.deleteProduct(id);
      if (response.ok) {
        setDeletingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
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

  return {
    isModalOpen,
    setIsModalOpen,
    modalMode,
    searchQuery,
    setSearchQuery,
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
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
  };
};
