// app/index.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import theme from './theme';  // Importa el tema

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Simula una carga y luego navega a la pantalla de inicio de sesión
    setTimeout(() => {
      router.replace('/login');  // Usa replace en lugar de push
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/logo.png')}  // Asegúrate de que la ruta sea correcta
        style={styles.logo} 
        resizeMode="contain"  // Ajusta la imagen para que se contenga dentro de su contenedor
      />
      <Text style={styles.title}>Bienvenido a la App de Bomberos</Text>
      <Text style={styles.subtitle}>Cargando...</Text>
      <ActivityIndicator style={styles.loader} size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,  // Color de fondo
  },
  logo: {
    width: 150,  // Ajusta el ancho de la imagen
    height: 150,  // Ajusta la altura de la imagen
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,  // Color del texto
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,  // Texto gris suave para la subtítulo
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});