// src/api/apiClient.js

const BASE_URL = 'http://localhost:5000/api';

const buildHeaders = (extraHeaders = {}, isFormData = false) => {
  const headers = { ...extraHeaders };
  const token = localStorage.getItem('token');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

export const apiClient = {
  // Generic GET request
  get: async (endpoint, headers = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: buildHeaders(headers),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  // Generic POST request
  post: async (endpoint, body, isFormData = false, headers = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(headers, isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response;
  },

  // Generic PUT request
  put: async (endpoint, body, isFormData = false, headers = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(headers, isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response;
  },

  // Generic DELETE request
  del: async (endpoint, headers = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(headers),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response;
  }
};