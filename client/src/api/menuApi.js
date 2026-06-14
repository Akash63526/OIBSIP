import axiosInstance from './axiosInstance';

export const getMenu = async () => {
  try {
    const response = await axiosInstance.get('/menu');
    return response.data.data;
  } catch (error) {
    console.error("Menu fetch error:", error);
    throw error;
  }
};
