// services/carga_combustible.js
import { handleRequest } from './api';

export const obtenerCargasCombustible = () => handleRequest('/carga_combustible');

export const obtenerCargaCombustiblePorId = (id) => handleRequest(`/carga_combustible/${id}`);

export const crearCargaCombustible = (data) => handleRequest('/carga_combustible', {
  method: 'POST',
  data,
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

export const actualizarCargaCombustible = (id, data) => handleRequest(`/carga_combustible/${id}`, {
  method: 'PUT',
  data,
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

export const eliminarCargaCombustible = (id) => handleRequest(`/carga_combustible/${id}`, {
  method: 'DELETE'
});