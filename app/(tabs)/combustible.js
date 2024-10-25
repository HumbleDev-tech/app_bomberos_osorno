// app/(tabs)/combustible.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import theme from '../theme';  // Importa el tema

export default function Combustible() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Combustible</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Consumo Reciente</Text>
        <Text style={styles.cardText}>Camión 1: 50 litros - 12/07/2023</Text>
        <Text style={styles.cardText}>Ambulancia: 30 litros - 10/07/2023</Text>
        <Text style={styles.cardText}>Camión 2: 45 litros - 08/07/2023</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estadísticas del Mes</Text>
        <Text style={styles.cardText}>Total de consumo: 1250 litros</Text>
        <Text style={styles.cardText}>Promedio diario: 41.67 litros</Text>
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