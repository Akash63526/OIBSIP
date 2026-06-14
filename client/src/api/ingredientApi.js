import axiosInstance from './axiosInstance';

export const getIngredients = async () => {
  try {
    const response = await axiosInstance.get('/ingredients');
    return response.data.data;
  } catch (error) {
    console.error("Ingredients fetch error:", error);
    throw error;
  }
};
