import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import { crearCargaCombustible, obtenerCargasCombustible } from '../services/carga_combustible';
import { obtenerBitacoraPorId } from '../services/bitacora';
import theme from '../theme';

export default function FormularioCombustible() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bitacora: null,
    litros: '',
    valor_mon: '',
  });

  const [openStates, setOpenStates] = useState({
  });

  const [options, setOptions] = useState({
    bitacoras: [],
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const cargasCombustibleData = await obtenerCargasCombustible();
      const uniqueBitacorasMap = new Map();
      cargasCombustibleData.forEach(item => {
        if (!uniqueBitacorasMap.has(item.bitacora.id)) {
          uniqueBitacorasMap.set(item.bitacora.id, item.bitacora);
        }
      });
      const uniqueBitacoras = Array.from(uniqueBitacorasMap.values());
      setOptions({
        bitacoras: uniqueBitacoras.map((bitacora) => ({
          label: `${bitacora.conductor_rut} - ${bitacora.direccion} - ${bitacora.compania}`,
          value: bitacora.id, // Removed .toString() to keep it as a number
        })),
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', 'Solicitud incorrecta. Verifique los datos enviados.');
      } else {
        Alert.alert('Error', 'No se pudieron cargar los datos necesarios');
      }
    }
  };

  const handleBitacoraSelect = async (bitacoraId) => {
    try {
      const bitacoraData = await obtenerBitacoraPorId(bitacoraId);
      setFormData(prev => ({
        ...prev,
        bitacora: bitacoraData
      }));
    } catch (error) {
      console.error('Error al obtener bitácora:', error);
      Alert.alert('Error', 'No se pudo obtener los datos de la bitácora');
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
        bitacora: {
          compania_id: formData.bitacora.compania_id,
          conductor_id: formData.bitacora.conductor_id,
          maquina_id: formData.bitacora.maquina_id,
          direccion: formData.bitacora.direccion,
          f_salida: formData.bitacora.f_salida,
          h_salida: formData.bitacora.h_salida,
          f_llegada: formData.bitacora.f_llegada,
          h_llegada: formData.bitacora.h_llegada,
          clave_id: formData.bitacora.clave_id,
          km_salida: formData.bitacora.km_salida,
          km_llegada: formData.bitacora.km_llegada,
          hmetro_salida: formData.bitacora.hmetro_salida,
          hmetro_llegada: formData.bitacora.hmetro_llegada,
          hbomba_salida: formData.bitacora.hbomba_salida,
          hbomba_llegada: formData.bitacora.hbomba_llegada,
          obs: formData.bitacora.obs
        },
        litros: parseFloat(formData.litros),
        valor_mon: parseFloat(formData.valor_mon),
      };

      await crearCargaCombustible(dataToSend);
      Alert.alert('Éxito', 'Carga de combustible guardada correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo guardar la carga de combustible');
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = () => {
    return formData.bitacora !== null && formData.litros !== '' && formData.valor_mon !== '';
  };

  const closeAllDropdowns = () => {
  };

  const renderDropDown = useCallback((field, items, placeholder, zIndex) => (
    <View style={[styles.dropdownContainer, { zIndex }]}>
      <Text style={styles.label}>{placeholder}</Text>
      <DropDownPicker
        open={openStates[field]}
        value={formData.bitacora?.id}
        items={items}
        setOpen={(value) => {
          if (value) {
            closeAllDropdowns();
          }
          setOpenStates(prev => ({ ...prev, [field]: value }));
        }}
        setValue={(callback) => {
          const newValue = callback(formData.bitacora?.id);
          if (newValue) {
            handleBitacoraSelect(newValue);
          }
        }}
        style={styles.dropdown}
        dropDownContainerStyle={[
          styles.dropdownList,
          { position: 'relative' }
        ]}
        textStyle={styles.dropdownText}
        placeholder={placeholder}
        placeholderStyle={styles.placeholderText}
        listItemLabelStyle={styles.listItemLabel}
        selectedItemLabelStyle={styles.selectedItemLabel}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      />
    </View>
  ), [openStates, formData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        nestedScrollEnabled={true}
      >

        {renderDropDown('bitacora_id', options.bitacoras, 'Bitácora', 6000)}

        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Litros</Text>
          <TextInput
            style={styles.input}
            value={formData.litros}
            onChangeText={(text) => setFormData(prev => ({ ...prev, litros: text }))}
            keyboardType="numeric"
            placeholder="Ingrese la cantidad de litros"
          />
        </View>

        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Valor Monetario</Text>
          <TextInput
            style={styles.input}
            value={formData.valor_mon}
            onChangeText={(text) => setFormData(prev => ({ ...prev, valor_mon: text }))}
            keyboardType="numeric"
            placeholder="Ingrese el valor monetario"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { zIndex: 1 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Guardando...' : 'Guardar Carga de Combustible'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: theme.colors.cardBackground,
    borderColor: 'rgba(255, 59, 59, 0.3)',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    minHeight: 50,
  },
  dropdownList: {
    backgroundColor: theme.colors.cardBackground,
    borderColor: 'rgba(255, 59, 59, 0.3)',
    borderWidth: 1.5,
    borderRadius: 8,
    maxHeight: 150,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  listItemLabel: {
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  selectedItemLabel: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 59, 59, 0.3)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
    height: 50,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});