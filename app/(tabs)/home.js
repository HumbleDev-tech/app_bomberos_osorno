// app/(tabs)/home.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import theme from '../theme';  // Importa el tema
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

export default function Home() {
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const [pressedCard, setPressedCard] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name || 'Usuario');
    };
    fetchUserName();
  }, []);

  const navigateTo = (route) => {
    router.push(`/(modals)/${route}`);
  };

  const handlePressIn = (card) => {
    setPressedCard(card);
  };

  const handlePressOut = () => {
    setPressedCard(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Bienvenido, {userName}</Text>
      
      <TouchableOpacity
        style={[styles.card, pressedCard === 'resumen' && styles.cardPressed]}
        onPress={() => navigateTo('resumen')}
        onPressIn={() => handlePressIn('resumen')}
        onPressOut={handlePressOut}
      >
        <Text style={styles.cardTitle}>Resumen</Text>
        <Text style={styles.cardContent}>Aquí se mostrará un resumen de la actividad reciente.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, pressedCard === 'alertas' && styles.cardPressed]}
        onPress={() => navigateTo('alertas')}
        onPressIn={() => handlePressIn('alertas')}
        onPressOut={handlePressOut}
      >
        <Text style={styles.cardTitle}>Alertas</Text>
        <Text style={styles.cardContent}>No hay alertas pendientes.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, pressedCard === 'proximas-actividades' && styles.cardPressed]}
        onPress={() => navigateTo('proximas-actividades')}
        onPressIn={() => handlePressIn('proximas-actividades')}
        onPressOut={handlePressOut}
      >
        <Text style={styles.cardTitle}>Próximas Actividades</Text>
        <Text style={styles.cardContent}>- Mantenimiento programado: 15/07/2023</Text>
        <Text style={styles.cardContent}>- Entrenamiento: 20/07/2023</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: StatusBar.currentHeight + 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 25,
    color: theme.colors.primary,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardPressed: {
    backgroundColor: theme.colors.primary,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: theme.colors.textPrimary,
  },
  cardContent: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});