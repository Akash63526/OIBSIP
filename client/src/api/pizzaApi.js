import axiosInstance from './axiosInstance';

export const pizzaApi = {
  getAllPizzas: async (params) => {
    const response = await axiosInstance.get('/pizzas', { params });
    return response.data;
  },
  getPizzaById: async (id) => {
    const response = await axiosInstance.get(`/pizzas/${id}`);
    return response.data;
  },
  // Admin routes
  createPizza: async (pizzaData) => {
    const response = await axiosInstance.post('/pizzas', pizzaData);
    return response.data;
  },
  updatePizza: async (id, pizzaData) => {
    const response = await axiosInstance.put(`/pizzas/${id}`, pizzaData);
    return response.data;
  },
  deletePizza: async (id) => {
    const response = await axiosInstance.delete(`/pizzas/${id}`);
    return response.data;
  }
};
