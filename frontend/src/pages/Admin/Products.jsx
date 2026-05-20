import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  X, 
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { MENU_CATEGORIES, CATEGORY_LABEL } from '../../constants/menuConstants';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    preferences: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
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
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('stock_quantity', newProduct.stock_quantity);
    formData.append('category', newProduct.category);
    // Convert comma-separated preferences to array
    const prefsArray = newProduct.preferences.split(',').map(p => p.trim()).filter(p => p !== '');
    formData.append('preferences', JSON.stringify(prefsArray));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNewProduct({
          name: '',
          description: '',
          price: '',
          stock_quantity: '',
          category: '',
          preferences: ''
        });
        setImageFile(null);
        setImagePreview(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="view-container">
      <div className="sticky-header">
        <header className="page-header">
          <div className="page-header-info">
            <h1>Clover Admin - Products</h1>
            <p>Manage your product catalog and inventory.</p>
          </div>
        </header>

        <div className="action-bar">
          <div className="search-container">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="action-buttons">
            <button className="btn-secondary">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="view-content">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}><input type="checkbox" /></th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="product-cell">
                      <img 
                        src={product.image?.startsWith('uploads/') ? `http://localhost:5000/${product.image}` : `/${product.image}`} 
                        alt={product.name} 
                        className="product-img"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=No+Img'; }}
                      />
                      <div className="product-info">
                        <span className="name">{product.name}</span>
                        <span className="sku">ID: {product.id}</span>
                        <p className="description">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>{CATEGORY_LABEL[product.category] || product.category || 'Uncategorized'}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.stock_quantity}</td>
                  <td>
                    <span className={`status-badge ${product.stock_quantity > 0 ? 'active' : 'inactive'}`}>
                      {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-text"><MoreHorizontal size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Product</h2>
              <button className="btn-text" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
                  {MENU_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
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
                <div className="image-upload-area" onClick={() => document.getElementById('imageInput').click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="image-preview-large" />
                  ) : (
                    <>
                      <div className="upload-icon"><Upload size={32} /></div>
                      <p className="caption">Click to upload or drag and drop</p>
                      <p className="caption" style={{ marginTop: '4px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</p>
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
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
