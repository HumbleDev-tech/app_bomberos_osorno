import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme';  // Importa el tema

export default function FormularioMantenciones() {
  const [vehicle, setVehicle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        try {
          const storedTasks = await AsyncStorage.getItem('maintenanceTasks');
          const tasks = storedTasks ? JSON.parse(storedTasks) : [];
          const task = tasks.find(task => task.id === id);
          if (task) {
            setVehicle(task.vehicle);
            setDate(task.date);
            setDescription(task.description);
          }
        } catch (error) {
          console.error('Error fetching task:', error);
        }
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async () => {
    if (!vehicle || !date || !description) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const newTask = { id: id || Date.now().toString(), vehicle, date, description };
      const storedTasks = await AsyncStorage.getItem('maintenanceTasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];

      if (id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        tasks[taskIndex] = newTask;
      } else {
        tasks.push(newTask);
      }

      await AsyncStorage.setItem('maintenanceTasks', JSON.stringify(tasks));
      Alert.alert('Éxito', 'La mantención ha sido guardada.');
      router.replace('/mantenciones');
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Hubo un problema al guardar la mantención.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{id ? 'Editar Mantención' : 'Agregar Mantención'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Vehículo"
        value={vehicle}
        onChangeText={setVehicle}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha (DD/MM/AAAA)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Guardar" onPress={handleSubmit} />
    </View>
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
});