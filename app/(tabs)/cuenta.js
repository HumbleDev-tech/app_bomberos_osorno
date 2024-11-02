import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme';

export default function Cuenta() {
  const [userInfo, setUserInfo] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {};
        setUserInfo(userInfo);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Cuenta</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de la Cuenta</Text>
        <Text style={styles.infoText}>Nombre: {userInfo.name}</Text>
        <Text style={styles.infoText}>Email: {userInfo.email}</Text>
        <Text style={styles.infoText}>Rol: {userInfo.role}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ajustes</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/ajustes')}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.textPrimary} />
          <Text style={styles.settingText}>Configuración</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/cambiar-contrasena')}>
          <Ionicons name="lock-closed-outline" size={24} color={theme.colors.textPrimary} />
          <Text style={styles.settingText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.textPrimary,
  },
  infoText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  settingText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginLeft: 10,
  },
});