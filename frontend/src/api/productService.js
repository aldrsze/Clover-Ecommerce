// src/api/productService.js
import { apiClient } from './apiClient';

export const productsService = {
  /**
   * Fetch all products or filter by a query string.
   */
  getProducts: async (queryString = '') => {
    try {
      // Uses the generic GET method from apiClient
      return await apiClient.get(`/products${queryString}`);
    } catch (error) {
      console.error("productsService.getProducts Error:", error);
      throw error;
    }
  },

  /**
   * Create a new product.
   */
  createProduct: async (payload) => {
    try {
      // Uses the generic POST method (isFormData = false)
      return await apiClient.post('/products', payload, false);
    } catch (error) {
      console.error("productsService.createProduct Error:", error);
      throw error;
    }
  },

  /**
   * Update an existing product.
   */
  updateProduct: async (id, payload) => {
    try {
      return await apiClient.put(`/products/${id}`, payload, false);
    } catch (error) {
      console.error("productsService.updateProduct Error:", error);
      throw error;
    }
  },

  /**
   * Delete a product by ID.
   */
  deleteProduct: async (id) => {
    try {
      return await apiClient.del(`/products/${id}`);
    } catch (error) {
      console.error("productsService.deleteProduct Error:", error);
      throw error;
    }
  }
};