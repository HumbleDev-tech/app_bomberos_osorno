// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://18.117.109.85/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export const handleRequest = async (url, options = {}) => {
  try {
    const response = await api(url, options);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data);
    throw error.response?.data || error;
  }
};

export default api;