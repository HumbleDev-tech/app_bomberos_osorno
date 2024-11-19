import axios from 'axios';

const api = axios.create({
  baseURL: 'http://18.117.109.85/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export const handleRequest = async (url, options = {}) => {
  // Definir el método por defecto como 'GET' si no se especifica
  const { method = 'GET', data, params } = options;

  console.log('Realizando solicitud:', { url, method, data, params });

  try {
    // Usar `api.request` para garantizar que el formato sea correcto
    const response = await api.request({
      url,
      method,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export default api;