import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import { crearMantencion, obtenerMantenciones } from '../services/mantencion';
import { obtenerMaquinas } from '../services/maquina';
import { obtenerTalleres } from '../services/taller';
import { obtenerEstadosMantencion } from '../services/estado_mantencion';
import theme from '../theme';

export default function FormularioMantenciones() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bitacora_id: null,
    patente: '',
    fec_termino: '',
    ord_trabajo: '',
    n_factura: '',
    cost_ser: '',
    taller: '',
    estado_mantencion: '',
  });

  const [openStates, setOpenStates] = useState({
    bitacora: false,
    patente: false,
    taller: false,
    estado: false,
  });

  const [options, setOptions] = useState({
    bitacoras: [],
    patentes: [],
    talleres: [],
    estadosMantencion: [],
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [mantencionesData, maquinasData, talleresData, estadosData] = 
        await Promise.all([
          obtenerMantenciones(),
          obtenerMaquinas(),
          obtenerTalleres(),
          obtenerEstadosMantencion(),
        ]);

      setOptions({
        bitacoras: mantencionesData.map(item => ({
          label: `${item.bitacora.conductor} - ${item.patente}`,
          value: item.id
        })),
        patentes: maquinasData.map(item => ({ label: item.patente, value: item.patente })),
        talleres: talleresData.map(item => ({ label: item.nombre, value: item.nombre })),
        estadosMantencion: estadosData.map(item => ({ label: item.nombre, value: item.nombre })),
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos necesarios');
    }
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos con valores válidos');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        bitacora_id: formData.bitacora_id,
        maquina_id: formData.maquina_id,
        ord_trabajo: formData.ord_trabajo,
        n_factura: parseInt(formData.n_factura),
        cost_ser: parseFloat(formData.cost_ser),
        taller_id: formData.taller_id,
        estado_mantencion_id: formData.estado_mantencion_id,
        fec_inicio: formData.fec_inicio,
        fec_termino: formData.fec_termino,
      };

      await crearMantencion(dataToSend);
      Alert.alert('Éxito', 'Mantención guardada correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo guardar la mantención');
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = () => {
    const requiredFields = ['bitacora_id', 'patente', 'ord_trabajo', 'n_factura', 'cost_ser', 'taller', 'estado_mantencion'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        return false;
      }
    }
    return !isNaN(parseInt(formData.n_factura)) && !isNaN(parseFloat(formData.cost_ser));
  };

  const closeAllDropdowns = () => {
    setOpenStates({
      bitacora: false,
      patente: false,
      taller: false,
      estado: false,
    });
  };

  const renderDropDown = useCallback((field, items, placeholder, zIndex) => (
    <View style={[styles.dropdownContainer, { zIndex }]}>
      <Text style={styles.label}>{placeholder}</Text>
      <DropDownPicker
        open={openStates[field]}
        value={formData[field]}
        items={items}
        setOpen={(value) => {
          if (value) {
            closeAllDropdowns();
          }
          setOpenStates(prev => ({ ...prev, [field]: value }));
        }}
        setValue={(callback) => {
          setFormData(prev => ({
            ...prev,
            [field]: callback(prev[field])
          }));
        }}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownList}
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

  const renderInput = (field, label, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[field]}
        onChangeText={(text) => setFormData(prev => ({ ...prev, [field]: text }))}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );

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
        {renderDropDown('patente', options.patentes, 'Patente', 5000)}
        {renderInput('fec_termino', 'Fecha de Término', 'DD-MM-YYYY')}
        {renderInput('ord_trabajo', 'Orden de Trabajo', 'Ingrese orden de trabajo')}
        {renderInput('n_factura', 'Número de Factura', 'Ingrese número de factura', 'numeric')}
        {renderInput('cost_ser', 'Costo Servicio', 'Ingrese costo del servicio', 'numeric')}
        {renderDropDown('taller', options.talleres, 'Taller', 4000)}
        {renderDropDown('estado_mantencion', options.estadosMantencion, 'Estado de Mantención', 3000)}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Guardando...' : 'Guardar Mantención'}
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