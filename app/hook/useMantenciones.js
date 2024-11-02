// app/hooks/useMantenciones.js
import { useState } from 'react';
import { getMantenciones, crearMantencion } from '../services/api/mantenciones';

export const useMantenciones = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerMantenciones = async () => {
    setLoading(true);
    try {
      const response = await getMantenciones();
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    obtenerMantenciones
  };
};