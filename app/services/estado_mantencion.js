// services/estado_mantencion.js
import { handleRequest } from './api';

export const obtenerEstadosMantencion = () => handleRequest('/estado_mantencion');

export const obtenerEstadoMantencionPorId = (id) => handleRequest(`/estado_mantencion/${id}`);

export default obtenerEstadosMantencion;