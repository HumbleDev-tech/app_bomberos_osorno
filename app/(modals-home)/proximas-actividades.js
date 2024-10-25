import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProximasActividades() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próximas Actividades</Text>
      <Text style={styles.content}>- Mantenimiento programado: 15/07/2023</Text>
      <Text style={styles.content}>- Entrenamiento: 20/07/2023</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
});