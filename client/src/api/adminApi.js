import axiosInstance from './axiosInstance';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },
  getRevenueReport: async (timeframe) => {
    const response = await axiosInstance.get('/admin/revenue', { params: { timeframe } });
    return response.data;
  },
  getAllUsers: async (params) => {
    const response = await axiosInstance.get('/admin/users', { params });
    return response.data;
  },
  updateUserRole: async (id, role) => {
    const response = await axiosInstance.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  }
};
