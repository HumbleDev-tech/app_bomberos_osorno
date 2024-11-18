// services/compania.js
import { handleRequest } from './api';

export const obtenerCompanias = () => handleRequest('/compania');

export const obtenerCompaniaPorId = (id) => handleRequest(`/compania/${id}`);

export default obtenerCompanias;