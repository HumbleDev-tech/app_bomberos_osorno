// services/bitacora.js
import { handleRequest } from './api';

export const obtenerBitacoras = () => handleRequest('/bitacora');

export const obtenerBitacoraPorId = (id) => handleRequest(`/bitacora/${id}`);

export default obtenerBitacoras;