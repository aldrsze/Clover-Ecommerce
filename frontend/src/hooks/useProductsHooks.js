import { useState, useEffect } from 'react';
import { productsService } from '../api/productService';

export const useProducts = (queryString = '') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsService.getProducts(queryString);
      // Normalize data
      const normalizedData = data.map(item => ({
        ...item,
        id: item.product_id || item.id,
        image: item.image_path || item.image
      }));
      setProducts(normalizedData);
    } catch (err) {
      setError(err);
      console.error("useProducts Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [queryString]);

  return { products, loading, error, refetch: fetchProducts };
};