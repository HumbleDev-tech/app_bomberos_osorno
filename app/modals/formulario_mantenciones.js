import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import { crearMantencion } from '../services/mantencion';
import { obtenerBitacoras } from '../services/bitacora';
import { obtenerMaquinas } from '../services/maquina';
import { obtenerPersonal } from '../services/personal';
import { obtenerCompanias } from '../services/compania';
import { obtenerTalleres } from '../services/taller';
import { obtenerEstadosMantencion } from '../services/estado_mantencion';
import theme from '../theme';

export default function FormularioMantenciones() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bitacora_id: null,
    maquina_id: null,
    personal_id_responsable: null,
    compania_id: null,
    ord_trabajo: '',
    n_factura: '',
    cost_ser: '',
    taller_id: null,
    estado_mantencion_id: null,
  });

  const [openStates, setOpenStates] = useState({
    bitacora: false,
    maquina: false,
    personal: false,
    compania: false,
    taller: false,
    estado: false,
  });

  const [options, setOptions] = useState({
    bitacoras: [],
    maquinas: [],
    personal: [],
    companias: [],
    talleres: [],
    estadosMantencion: [],
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [bitacorasData, maquinasData, personalData, companiasData, talleresData, estadosData] = 
        await Promise.all([
          obtenerBitacoras(),
          obtenerMaquinas(),
          obtenerPersonal(),
          obtenerCompanias(),
          obtenerTalleres(),
          obtenerEstadosMantencion(),
        ]);

      setOptions({
        bitacoras: bitacorasData.map(item => ({
          label: `${item.rut_personal} - ${item.patente_maquina} - ${item.tipo_maquina}`,
          value: item.id
        })),
        maquinas: maquinasData.map(item => ({ label: `${item.codigo} - ${item.patente}`, value: item.maquina_id })),
        personal: personalData.map(item => ({ label: `${item.nombre} ${item.apellido}`, value: item.id })),
        companias: companiasData.map(item => ({ label: item.nombre, value: item.id })),
        talleres: talleresData.map(item => ({ label: item.nombre, value: item.id })),
        estadosMantencion: estadosData.map(item => ({ label: item.nombre, value: item.id })),
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
        ...formData,
        n_factura: parseInt(formData.n_factura),
        cost_ser: parseFloat(formData.cost_ser),
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
    const requiredFields = ['bitacora_id', 'maquina_id', 'personal_id_responsable', 'compania_id', 'ord_trabajo', 'n_factura', 'cost_ser', 'taller_id', 'estado_mantencion_id'];
    for (let field of requiredFields) {
      if (!formData[field] || isNaN(formData.n_factura) || isNaN(formData.cost_ser)) {
        return false;
      }
    }
    return true;
  };

  const closeAllDropdowns = () => {
    setOpenStates({
      bitacora: false,
      maquina: false,
      personal: false,
      compania: false,
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
        {renderDropDown('maquina_id', options.maquinas, 'Máquina', 5000)}
        {renderDropDown('personal_id_responsable', options.personal, 'Personal Responsable', 4000)}
        {renderDropDown('compania_id', options.companias, 'Compañía', 3000)}

        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Orden de Trabajo</Text>
          <TextInput
            style={styles.input}
            value={formData.ord_trabajo}
            onChangeText={(text) => setFormData(prev => ({ ...prev, ord_trabajo: text }))}
            placeholder="Ingrese orden de trabajo"
          />
        </View>

        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Número de Factura</Text>
          <TextInput
            style={styles.input}
            value={formData.n_factura}
            onChangeText={(text) => setFormData(prev => ({ ...prev, n_factura: text }))}
            keyboardType="numeric"
            placeholder="Ingrese número de factura"
          />
        </View>

        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Costo Servicio</Text>
          <TextInput
            style={styles.input}
            value={formData.cost_ser}
            onChangeText={(text) => setFormData(prev => ({ ...prev, cost_ser: text }))}
            keyboardType="numeric"
            placeholder="Ingrese costo del servicio"
          />
        </View>

        {renderDropDown('taller_id', options.talleres, 'Taller', 2000)}
        {renderDropDown('estado_mantencion_id', options.estadosMantencion, 'Estado de Mantención', 1000)}

        <TouchableOpacity
          style={[styles.submitButton, { zIndex: 1 }]}
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