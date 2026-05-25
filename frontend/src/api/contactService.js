import { apiClient } from './apiClient';

export const contactService = {
  submitMessage: async (payload) => {
    try {
      const response = await apiClient.post('/contact', payload);
      return response.json();
    } catch (error) {
      console.error('contactService.submitMessage Error:', error);
      throw error;
    }
  },

  getMessages: async () => {
    try {
      return await apiClient.get('/admin/contact');
    } catch (error) {
      console.error('contactService.getMessages Error:', error);
      throw error;
    }
  },

  deleteMessage: async (id) => {
    try {
      const response = await apiClient.del(`/admin/contact/${id}`);
      return response.json();
    } catch (error) {
      console.error('contactService.deleteMessage Error:', error);
      throw error;
    }
  },
};
