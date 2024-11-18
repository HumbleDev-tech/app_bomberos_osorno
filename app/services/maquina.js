// services/maquina.js
import { handleRequest } from './api';

export const obtenerMaquinas = () => handleRequest('/maquina');

export const obtenerMaquinaPorId = (id) => handleRequest(`/maquina/${id}`);

export default obtenerMaquinas;