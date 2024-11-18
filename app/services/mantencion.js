// services/mantencion.js
import { handleRequest } from './api';

export const obtenerMantenciones = () => handleRequest('/mantencion');

export const obtenerMantencionPorId = (id) => handleRequest(`/mantencion/${id}`);

export const crearMantencion = (data) => handleRequest('/mantencion', {
  method: 'POST',
  data
});

export const actualizarMantencion = (id, data) => handleRequest(`/mantencion/${id}`, {
  method: 'PUT',
  data
});

export const eliminarMantencion = (id) => handleRequest(`/mantencion/${id}`, {
  method: 'DELETE'
});

export default obtenerMantenciones;