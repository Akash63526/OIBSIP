import axiosInstance from './axiosInstance';

export const inventoryApi = {
  getAllInventory: async () => {
    const response = await axiosInstance.get('/inventory');
    return response.data;
  },
  getInventoryByCategory: async (category) => {
    const response = await axiosInstance.get(`/inventory/category/${category}`);
    return response.data;
  },
  checkAvailability: async (items) => {
    const response = await axiosInstance.post('/inventory/check-availability', { items });
    return response.data;
  },
  // Admin routes
  addStockItem: async (itemData) => {
    const response = await axiosInstance.post('/inventory', itemData);
    return response.data;
  },
  updateStockItem: async (id, itemData) => {
    const response = await axiosInstance.put(`/inventory/${id}`, itemData);
    return response.data;
  },
  deleteStockItem: async (id) => {
    const response = await axiosInstance.delete(`/inventory/${id}`);
    return response.data;
  }
};
