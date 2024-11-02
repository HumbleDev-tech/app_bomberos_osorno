// app/services/api/mantenciones.js
import api from './config';

export const mantencionesApi = {
  crear: (data) => api.post('/mantencion', data),
  actualizar: (id, data) => api.put(`/mantencion/${id}`, data),
  obtener: (id) => api.get(`/mantencion/${id}`)
};