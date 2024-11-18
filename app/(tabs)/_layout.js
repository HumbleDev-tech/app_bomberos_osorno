import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import theme from '../theme';

const TabBarIcon = ({ name }) => (
  <Ionicons name={name} size={28} color={'#ff3b3b'} /> // Increased icon size
);

const tabScreens = [
  { name: "home", title: "Inicio", icon: "home" },
  { name: "bitacora", title: "Bitacora", icon: "document-text" },
  { name: "combustible", title: "Combustible", icon: "flame" },
  { name: "mantenciones", title: "Mantenciones", icon: "construct" },
  { name: "cuenta", title: "Cuenta", icon: "person" },
];

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
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          marginHorizontal: 8,
        },
      }}
    >
      {tabScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center' }}>
                <TabBarIcon 
                  name={focused ? screen.icon : `${screen.icon}-outline`} 
                />
              </View>
            ),
            tabBarShowLabel: false,
          }}
        />
      ))}
    </Tabs>
  );
}