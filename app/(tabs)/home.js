import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [combinedList, setCombinedList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name || 'Usuario');
    };
    fetchUserName();

    // Simulate fetching data
    const notifications = [
      { id: '1', text: 'Nueva alerta de incendio en la calle Principal', type: 'notification', icon: 'flame-outline' },
      { id: '2', text: 'Reunión de equipo a las 3 PM en la sala de conferencias', type: 'notification', icon: 'people-outline' },
    ];
    const tasks = [
      { id: '3', text: 'Revisar equipo de rescate y actualizar inventario', type: 'task', icon: 'clipboard-outline' },
      { id: '4', text: 'Completar informe de incidente del 12/07/2023', type: 'task', icon: 'document-text-outline' },
    ];
    const reminders = [
      { id: '5', text: 'Mantenimiento programado del camión 1 el 15/07/2023', type: 'reminder', icon: 'calendar-outline' },
      { id: '6', text: 'Entrenamiento de primeros auxilios el 20/07/2023', type: 'reminder', icon: 'fitness-outline' },
    ];

    setCombinedList([...notifications, ...tasks, ...reminders]);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.item, styles[`item_${item.type}`]]}>
      <View style={styles.itemIconContainer}>
        <Ionicons name={item.icon} size={24} color={theme.colors[item.type]} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>
          {item.type === 'notification' ? 'Notificación' : item.type === 'task' ? 'Tarea Pendiente' : 'Recordatorio'}
        </Text>
        <Text style={styles.itemText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenido,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Actividades Recientes</Text>
        <FlatList
          data={combinedList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    paddingTop: StatusBar.currentHeight + 20,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme.colors.textPrimary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  item_notification: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.notification,
  },
  item_task: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.task,
  },
  item_reminder: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.reminder,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.colors.textPrimary,
  },
  itemText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});