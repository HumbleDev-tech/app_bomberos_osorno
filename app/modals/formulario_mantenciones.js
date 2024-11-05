// app/modals/formulario_mantenciones.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { crearMantencion } from '../services/mantencion';
import theme from '../theme';

export default function FormularioMantenciones() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bitacora_id: '1',
    maquina_id: '', // Agregar campo maquina_id
    patente: '',
    personal_responsable: '',
    compania_id: '2',
    ord_trabajo: '',
    n_factura: '',
    cost_ser: '',
    taller: '',
    estado_mantencion: 'Pendiente de revision'
  });

  const router = useRouter();

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
        maquina_id: parseInt(formData.maquina_id), // Asegurarse de que maquina_id sea un número
        compania_id: parseInt(formData.compania_id),
        n_factura: parseInt(formData.n_factura),
        cost_ser: parseInt(formData.cost_ser)
      };

      // Agregar console.log para depuración
      console.log('Datos a enviar:', dataToSend);

      await crearMantencion(dataToSend);

      Alert.alert('Éxito', 'Mantención guardada correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', error.message || 'No se pudo guardar la mantención');
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = () => {
    const camposRequeridos = ['bitacora_id', 'maquina_id', 'patente', 'personal_responsable', 'compania_id', 'ord_trabajo', 'n_factura', 'cost_ser', 'taller', 'estado_mantencion'];
    return camposRequeridos.every(campo => formData[campo]);
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
      <Text style={styles.title}>Nueva Mantención</Text>

      <TextInput
        style={styles.input}
        placeholder="ID de Bitácora"
        value={formData.bitacora_id}
        onChangeText={(value) => setFormData({...formData, bitacora_id: value})}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="ID de Máquina"
        value={formData.maquina_id}
        onChangeText={(value) => setFormData({...formData, maquina_id: value})}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Patente del Vehículo"
        value={formData.patente}
        onChangeText={(value) => setFormData({...formData, patente: value})}
      />

      <TextInput
        style={styles.input}
        placeholder="RUT Personal Responsable"
        value={formData.personal_responsable}
        onChangeText={(value) => setFormData({...formData, personal_responsable: value})}
      />

      <TextInput
        style={styles.input}
        placeholder="ID Compañía"
        value={formData.compania_id}
        onChangeText={(value) => setFormData({...formData, compania_id: value})}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Orden de Trabajo"
        value={formData.ord_trabajo}
        onChangeText={(value) => setFormData({...formData, ord_trabajo: value})}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de Factura"
        value={formData.n_factura}
        onChangeText={(value) => setFormData({...formData, n_factura: value})}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Costo Servicio"
        value={formData.cost_ser}
        onChangeText={(value) => setFormData({...formData, cost_ser: value})}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Taller"
        value={formData.taller}
        onChangeText={(value) => setFormData({...formData, taller: value})}
      />

      <TextInput
        style={styles.input}
        placeholder="Estado de Mantención"
        value={formData.estado_mantencion}
        onChangeText={(value) => setFormData({...formData, estado_mantencion: value})}
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.cardBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});