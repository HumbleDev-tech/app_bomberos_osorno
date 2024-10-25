import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Alertas() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertas</Text>
      <Text style={styles.content}>No hay alertas pendientes en este momento.</Text>
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
  },
});