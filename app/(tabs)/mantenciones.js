// app/(tabs)/mantenciones.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import theme from '../theme';  // Importa el tema

export default function Mantenciones() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mantenciones</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Próximas Mantenciones</Text>
        <Text style={styles.cardText}>Camión 1: 15/07/2023 - Cambio de aceite</Text>
        <Text style={styles.cardText}>Ambulancia: 20/07/2023 - Revisión general</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mantenciones Recientes</Text>
        <Text style={styles.cardText}>Camión 2: 05/07/2023 - Cambio de neumáticos</Text>
        <Text style={styles.cardText}>Equipo de rescate: 01/07/2023 - Inspección anual</Text>
      </View>
    </ScrollView>
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
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.textPrimary,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },
});