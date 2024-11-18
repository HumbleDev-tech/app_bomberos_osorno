// services/taller.js
import { handleRequest } from './api';

export const obtenerTalleres = () => handleRequest('/taller');

export const obtenerTallerPorId = (id) => handleRequest(`/taller/${id}`);

export default obtenerTalleres;