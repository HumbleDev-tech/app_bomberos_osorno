// app/modals/_layout.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import theme from '../theme';  // Importa el tema

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
            fontWeight: 'bold',
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});