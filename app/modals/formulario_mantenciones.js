// app/modals/formulario_mantenciones.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { mantencionesApi } from '../services/api/mantenciones';
import { bitacorasApi } from '../services/api/bitacoras';
import theme from '../theme';

export default function FormularioMantenciones() {
  const [loading, setLoading] = useState(false);
  const [bitacoras, setBitacoras] = useState([]);
  const [selectedBitacora, setSelectedBitacora] = useState(null);
  const [formData, setFormData] = useState({
    bitacora_id: '',
    personal_responsable: '',
    compania_id: '',
    ord_trabajo: '',
    n_factura: '',
    cost_ser: '',
    taller: '',
    estado_mantencion: 'Pendiente de revision'
  });
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    cargarBitacoras();
    if (id) {
      cargarMantencion();
    }
  }, [id]);

  const cargarBitacoras = async () => {
    try {
      const response = await bitacorasApi.obtenerTodas();
      setBitacoras(response.data);
    } catch (error) {
      console.error('Error cargando bitácoras:', error);
      Alert.alert('Error', 'No se pudieron cargar las bitácoras');
    }
  };

  const cargarMantencion = async () => {
    setLoading(true);
    try {
      const response = await mantencionesApi.obtener(id);
      setFormData(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la mantención');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        bitacora_id: parseInt(formData.bitacora_id),
        n_factura: parseInt(formData.n_factura),
        cost_ser: parseInt(formData.cost_ser),
        compania_id: parseInt(formData.compania_id)
      };

      if (id) {
        await mantencionesApi.actualizar(id, dataToSend);
      } else {
        await mantencionesApi.crear(dataToSend);
      }
      Alert.alert('Éxito', 'Mantención guardada correctamente');
      router.replace('/mantenciones');
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', error.response?.data?.message || 'Error al guardar la mantención');
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = () => {
    return Object.values(formData).every(value => value !== '');
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBitacoraChange = (value) => {
    const bitacora = bitacoras.find(b => b.id === value);
    setSelectedBitacora(bitacora);
    handleChange('bitacora_id', value);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{id ? 'Editar Mantención' : 'Nueva Mantención'}</Text>
      
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.bitacora_id}
          onValueChange={handleBitacoraChange}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una bitácora" value="" />
          {bitacoras.map(bitacora => (
            <Picker.Item 
              key={bitacora.id} 
              label={`Bitácora ${bitacora.id}`} 
              value={bitacora.id} 
            />
          ))}
        </Picker>
      </View>

      {selectedBitacora && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Dirección: {selectedBitacora.direccion}</Text>
          <Text style={styles.previewText}>Fecha: {selectedBitacora.fecha}</Text>
          <Text style={styles.previewText}>Conductor: {selectedBitacora.conductor_id}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="RUT Personal Responsable"
        value={formData.personal_responsable}
        onChangeText={(value) => handleChange('personal_responsable', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="ID Compañía"
        value={formData.compania_id.toString()}
        onChangeText={(value) => handleChange('compania_id', value)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Orden de Trabajo"
        value={formData.ord_trabajo}
        onChangeText={(value) => handleChange('ord_trabajo', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de Factura"
        value={formData.n_factura.toString()}
        onChangeText={(value) => handleChange('n_factura', value)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Costo Servicio"
        value={formData.cost_ser.toString()}
        onChangeText={(value) => handleChange('cost_ser', value)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Taller"
        value={formData.taller}
        onChangeText={(value) => handleChange('taller', value)}
      />

      <Button 
        title={loading ? "Guardando..." : "Guardar"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.primary,
  },
  input: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
  },
  pickerContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
  },
  picker: {
    height: 50,
  },
  previewContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
  },
  previewText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 5,
  }
});