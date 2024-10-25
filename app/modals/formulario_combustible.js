// app/modals/formulario_combustible.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme';  // Importa el tema

export default function AddFuel() {
  const [vehicle, setVehicle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (vehicle && amount && date) {
      const newFuelLoad = { id: Date.now().toString(), vehicle, amount, date };
      try {
        const storedFuelLoads = await AsyncStorage.getItem('fuelLoads');
        const fuelLoads = storedFuelLoads ? JSON.parse(storedFuelLoads) : [];
        fuelLoads.push(newFuelLoad);
        await AsyncStorage.setItem('fuelLoads', JSON.stringify(fuelLoads));
        Alert.alert('Carga de Combustible Guardada', `Vehículo: ${vehicle}\nCantidad: ${amount}\nFecha: ${date}`);
        router.push('/combustible');
      } catch (error) {
        Alert.alert('Error', 'Hubo un problema al guardar la carga de combustible.');
      }
    } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Carga de Combustible</Text>
      <TextInput
        style={styles.input}
        placeholder="Vehículo"
        value={vehicle}
        onChangeText={setVehicle}
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad (litros)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha (DD/MM/AAAA)"
        value={date}
        onChangeText={setDate}
      />
      <Button title="Guardar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 15,
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
    color: theme.colors.textPrimary,
  },
});