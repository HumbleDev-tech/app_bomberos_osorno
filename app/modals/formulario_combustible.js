// app/modals/formulario_combustible.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { crearCargaCombustible } from '../services/carga_combustible';
import theme from '../theme';

export default function FormularioCombustible() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [formData, setFormData] = useState({
    maquina_id: '',
    litros: '',
    valor_mon: '',
    codigo: '',
    patente: '',
  });

  const seleccionarImagen = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const resizedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        setImagen(resizedImage.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;
    setLoading(true);

    try {
      const formDataApi = new FormData();
      formDataApi.append('maquina_id', parseInt(formData.maquina_id));
      formDataApi.append('patente', formData.patente);
      formDataApi.append('litros', parseFloat(formData.litros));
      formDataApi.append('valor_mon', parseFloat(formData.valor_mon));
      formDataApi.append('codigo', formData.codigo);

      if (imagen) {
        const filename = imagen.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const ext = match ? match[1] : 'jpg';

        formDataApi.append('imagen', {
          uri: Platform.OS === 'android' ? imagen : imagen.replace('file://', ''),
          type: `image/${ext}`,
          name: filename,
        });
      }

      // Agregar console.log para depuración
      console.log('Datos a enviar:', formDataApi);

      await crearCargaCombustible(formDataApi);

      Alert.alert('Éxito', 'Carga de combustible registrada correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', error.message || 'No se pudo registrar la carga de combustible');
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = () => {
    const camposRequeridos = ['maquina_id', 'litros', 'valor_mon', 'codigo', 'patente'];
    return camposRequeridos.every(campo => formData[campo]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nueva Carga de Combustible</Text>

      <TextInput
        style={styles.input}
        placeholder="ID de Máquina"
        value={formData.maquina_id}
        onChangeText={(value) => setFormData({ ...formData, maquina_id: value })}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Litros"
        value={formData.litros}
        onChangeText={(value) => setFormData({ ...formData, litros: value })}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Valor Monetario"
        value={formData.valor_mon}
        onChangeText={(value) => setFormData({ ...formData, valor_mon: value })}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Código"
        value={formData.codigo}
        onChangeText={(value) => setFormData({ ...formData, codigo: value })}
      />

      <TextInput
        style={styles.input}
        placeholder="Patente"
        value={formData.patente}
        onChangeText={(value) => setFormData({ ...formData, patente: value })}
      />

      <TouchableOpacity
        style={styles.imageButton}
        onPress={seleccionarImagen}
      >
        <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {imagen && (
        <Image
          source={{ uri: imagen }}
          style={styles.previewImage}
        />
      )}

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
  imageButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
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