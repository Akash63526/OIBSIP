import axiosInstance from './axiosInstance';

export const orderApi = {
  createOrder: async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await axiosInstance.get('/orders/my-orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },
  trackOrder: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}/track`);
    return response.data;
  },
  // Admin routes
  getAllOrders: async (params) => {
    const response = await axiosInstance.get('/orders', { params });
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
    return response.data;
  }
};
