import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ff0000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="resumen" options={{ title: 'Resumen' }} />
      <Stack.Screen name="alertas" options={{ title: 'Alertas' }} />
      <Stack.Screen name="proximas-actividades" options={{ title: 'Próximas Actividades' }} />
    </Stack>
  );
}