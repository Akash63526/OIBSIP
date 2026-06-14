import axiosInstance from './axiosInstance';

export const paymentApi = {
  createRazorpayOrder: async (orderData) => {
    const response = await axiosInstance.post(`/payments/create-order`, orderData);
    return response.data;
  },
  verifyPayment: async (paymentData) => {
    const response = await axiosInstance.post('/payments/verify', paymentData);
    return response.data;
  }
};
