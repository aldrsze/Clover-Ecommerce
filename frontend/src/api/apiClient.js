// src/api/apiClient.js

const BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  // Generic GET request
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  // Generic POST request
  post: async (endpoint, body, isFormData = false) => {
    const headers = {};
    
    // If we are NOT sending a file (FormData), tell the server we are sending JSON
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response;
  },

  // Generic PUT request
  put: async (endpoint, body, isFormData = false) => {
    const headers = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response;
  },

  // Generic DELETE request
  del: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response;
  }
};