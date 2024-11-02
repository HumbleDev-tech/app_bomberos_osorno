// app/services/api/bitacoras.js
import api from './config';

export const bitacorasApi = {
  obtenerTodas: () => api.get('/bitacora')
};