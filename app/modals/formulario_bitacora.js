import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import { crearBitacora } from '../services/bitacora';
import { obtenerMaquinas } from '../services/maquina';
import { obtenerPersonal } from '../services/personal';
import theme from '../theme';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function FormularioBitacora() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    maquina_id: null,
    personal_id: null,
    descripcion: '',
    fh_salida: '',
    fh_llegada: '',
    clave: '',
    direccion: '',
    km_salida: '',
    km_llegada: '',
    hmetro_salida: '',
    hmetro_llegada: '',
    hbomba_salida: '',
    hbomba_llegada: '',
    obs: ''
  });

  const [openStates, setOpenStates] = useState({
    maquina: false,
    personal: false,
  });

  const [options, setOptions] = useState({
    maquinas: [],
    personal: [],
  });

  const [datePickerVisibility, setDatePickerVisibility] = useState({
    fh_salida: false,
    fh_llegada: false,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [maquinasData, personalData] = await Promise.all([
        obtenerMaquinas(),
        obtenerPersonal(),
      ]);

      setOptions({
        maquinas: maquinasData.map(item => ({ label: `${item.codigo} - ${item.patente}`, value: item.maquina_id })),
        personal: personalData.map(item => ({ label: `${item.nombre} ${item.apellido}`, value: item.id })),
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos necesarios');
    }
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      await crearBitacora(formData);
      Alert.alert('Éxito', 'Bitácora guardada correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo guardar la bitácora');
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = () => {
    return formData.maquina_id !== null && formData.personal_id !== null && formData.descripcion !== '' &&
      formData.fh_salida !== '' && formData.fh_llegada !== '' && formData.clave !== '' &&
      formData.direccion !== '' && formData.km_salida !== '' && formData.km_llegada !== '' &&
      formData.hmetro_salida !== '' && formData.hmetro_llegada !== '' && formData.hbomba_salida !== '' &&
      formData.hbomba_llegada !== '' && formData.obs !== '';
  };

  const closeAllDropdowns = () => {
    setOpenStates({
      maquina: false,
      personal: false,
    });
  };

  const showDatePicker = (field) => {
    setDatePickerVisibility(prev => ({ ...prev, [field]: true }));
  };

  const handleDateChange = (event, selectedDate, field) => {
    if (Platform.OS === 'android') {
      setDatePickerVisibility(prev => ({ ...prev, [field]: false }));
    }
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().replace('T', ' ').substring(0, 16).replace('T', ' ');
      setFormData(prev => ({ ...prev, [field]: formattedDate }));
    }
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
        {renderDropDown('maquina_id', options.maquinas, 'Máquina', 6000)}
        {renderDropDown('personal_id', options.personal, 'Personal', 5000)}

        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            value={formData.descripcion}
            onChangeText={(text) => setFormData(prev => ({ ...prev, descripcion: text }))}
            placeholder="Ingrese la descripción"
          />
        </View>

        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Fecha y Hora de Salida</Text>
          <TouchableOpacity onPress={() => showDatePicker('fh_salida')}>
            <TextInput
              style={styles.input}
              value={formData.fh_salida}
              placeholder="Seleccione fecha y hora de salida"
              editable={false}
            />
          </TouchableOpacity>
          {datePickerVisibility.fh_salida && (
            <DateTimePicker
              value={new Date()}
              mode="datetime"
              display="default"
              onChange={(event, date) => handleDateChange(event, date, 'fh_salida')}
              onTouchCancel={() => setDatePickerVisibility(prev => ({ ...prev, fh_salida: false }))}
            />
          )}
        </View>
        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Fecha y Hora de Llegada</Text>
          <TouchableOpacity onPress={() => showDatePicker('fh_llegada')}>
            <TextInput
              style={styles.input}
              value={formData.fh_llegada}
              placeholder="Seleccione fecha y hora de llegada"
              editable={false}
            />
          </TouchableOpacity>
          {datePickerVisibility.fh_llegada && (
            <DateTimePicker
              value={new Date()}
              mode="datetime"
              display="default"
              onChange={(event, date) => handleDateChange(event, date, 'fh_llegada')}
              onTouchCancel={() => setDatePickerVisibility(prev => ({ ...prev, fh_llegada: false }))}
            />
          )}
        </View>
        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Clave</Text>
          <TextInput
            style={styles.input}
            value={formData.clave}
            onChangeText={(text) => setFormData(prev => ({ ...prev, clave: text }))}
            placeholder="Ingrese clave"
          />
        </View>
        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            value={formData.direccion}
            onChangeText={(text) => setFormData(prev => ({ ...prev, direccion: text }))}
            placeholder="Ingrese dirección"
          />
        </View>
        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Kilometraje de Salida</Text>
          <TextInput
            style={styles.input}
            value={formData.km_salida}
            onChangeText={(text) => setFormData(prev => ({ ...prev, km_salida: text }))}
            keyboardType="numeric"
            placeholder="Ingrese kilometraje de salida"
          />
        </View>
        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Kilometraje de Llegada</Text>
          <TextInput
            style={styles.input}
            value={formData.km_llegada}
            onChangeText={(text) => setFormData(prev => ({ ...prev, km_llegada: text }))}
            keyboardType="numeric"
            placeholder="Ingrese kilometraje de llegada"
          />
        </View>
        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Horas Metro de Salida</Text>
          <TextInput
            style={styles.input}
            value={formData.hmetro_salida}
            onChangeText={(text) => setFormData(prev => ({ ...prev, hmetro_salida: text }))}
            keyboardType="numeric"
            placeholder="Ingrese horas metro de salida"
          />
        </View>
        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Horas Metro de Llegada</Text>
          <TextInput
            style={styles.input}
            value={formData.hmetro_llegada}
            onChangeText={(text) => setFormData(prev => ({ ...prev, hmetro_llegada: text }))}
            keyboardType="numeric"
            placeholder="Ingrese horas metro de llegada"
          />
        </View>
        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Horas Bomba de Salida</Text>
          <TextInput
            style={styles.input}
            value={formData.hbomba_salida}
            onChangeText={(text) => setFormData(prev => ({ ...prev, hbomba_salida: text }))}
            keyboardType="numeric"
            placeholder="Ingrese horas bomba de salida"
          />
        </View>
        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Horas Bomba de Llegada</Text>
          <TextInput
            style={styles.input}
            value={formData.hbomba_llegada}
            onChangeText={(text) => setFormData(prev => ({ ...prev, hbomba_llegada: text }))}
            keyboardType="numeric"
            placeholder="Ingrese horas bomba de llegada"
          />
        </View>
        <View style={[styles.inputContainer, { zIndex: 1 }]}>
          <Text style={styles.label}>Observaciones</Text>
          <TextInput
            style={styles.input}
            value={formData.obs}
            onChangeText={(text) => setFormData(prev => ({ ...prev, obs: text }))}
            placeholder="Ingrese observaciones"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { zIndex: 1 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Guardando...' : 'Guardar Bitácora'}
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
