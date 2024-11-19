import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import theme from '../theme'

export default function ModalsLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            textAlign: 'center',
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen 
          name="formulario_combustible" 
          options={{
            title: "Nueva Carga de Combustible"
          }}
        />
        <Stack.Screen 
          name="formulario_mantenciones" 
          options={{
            title: "Nueva Mantención"
          }}
        />
        <Stack.Screen 
          name="formulario_bitacora" 
          options={{
            title: "Nueva Bitácora"
          }}
        />
        {/* Agrega más Stack.Screen componentes para otras rutas */}
      </Stack>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
})