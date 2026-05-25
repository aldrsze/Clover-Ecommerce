import { apiClient } from './apiClient';

export const customerService = {
  getCustomers: async () => {
    try {
      return await apiClient.get('/admin/customers');
    } catch (error) {
      console.error('customerService.getCustomers Error:', error);
      throw error;
    }
  },

  updateCustomer: async (id, payload) => {
    try {
      const response = await apiClient.put(`/admin/customers/${id}`, payload);
      return response.json();
    } catch (error) {
      console.error('customerService.updateCustomer Error:', error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      const response = await apiClient.del(`/admin/customers/${id}`);
      return response.json();
    } catch (error) {
      console.error('customerService.deleteCustomer Error:', error);
      throw error;
    }
  },
};