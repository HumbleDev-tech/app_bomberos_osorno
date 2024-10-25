// app/(tabs)/servicios.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import theme from '../theme';  // Importa el tema

export default function Servicios() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Servicios</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Servicios Recientes</Text>
        <Text style={styles.cardText}>12/07/2023 - Incendio estructural</Text>
        <Text style={styles.cardText}>10/07/2023 - Rescate vehicular</Text>
        <Text style={styles.cardText}>08/07/2023 - Emergencia médica</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estadísticas del Mes</Text>
        <Text style={styles.cardText}>Total de servicios: 15</Text>
        <Text style={styles.cardText}>Incendios: 5</Text>
        <Text style={styles.cardText}>Rescates: 7</Text>
        <Text style={styles.cardText}>Emergencias médicas: 3</Text>
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