import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Platform } from 'react-native';
import theme from '../theme';

const TabBarIcon = ({ name, color }) => (
  <Ionicons name={name} size={24} color={color} />
);

const TabBarLabel = ({ label, focused }) => (
  <Text style={{
    fontSize: 12,
    fontWeight: focused ? '600' : '400',
    color: focused ? theme.colors.primary : theme.colors.textSecondary,
    marginTop: 4,
  }}>
    {label}
  </Text>
);

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarItemStyle: {
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />
              <TabBarLabel label="Inicio" focused={focused} />
            </View>
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="combustible"
        options={{
          title: "Combustible",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <TabBarIcon name={focused ? "flame" : "flame-outline"} color={color} />
              <TabBarLabel label="Combustible" focused={focused} />
            </View>
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="mantenciones"
        options={{
          title: "Mantenciones",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <TabBarIcon name={focused ? "construct" : "construct-outline"} color={color} />
              <TabBarLabel label="Mantenciones" focused={focused} />
            </View>
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="servicios"
        options={{
          title: "Servicios",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <TabBarIcon name={focused ? "list" : "list-outline"} color={color} />
              <TabBarLabel label="Servicios" focused={focused} />
            </View>
          ),
          tabBarShowLabel: false,
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="cuenta"
        options={{
          title: "Cuenta",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <TabBarIcon name={focused ? "person" : "person-outline"} color={color} />
              <TabBarLabel label="Cuenta" focused={focused} />
            </View>
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}