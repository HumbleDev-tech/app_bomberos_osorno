// services/personal.js
import { handleRequest } from './api';

export const obtenerPersonal = () => handleRequest('/personal');

export const obtenerPersonalPorId = (id) => handleRequest(`/personal/${id}`);

export default obtenerPersonal;