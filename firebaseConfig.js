import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC106w7QXWHC4nh33Ab07rEw7xQqGIiq5M",
  authDomain: "appbomberos1.firebaseapp.com",
  projectId: "appbomberos1",
  storageBucket: "appbomberos1.appspot.com",
  messagingSenderId: "253297255279",
  appId: "1:253297255279:web:b07507e95e53c07d9a3e9a",
  measurementId: "G-9T9NLX4FX7"
};

// Inicializa la app de Firebase solo si no ha sido inicializada
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Obtiene la instancia de Auth
const auth = getAuth();

export { auth };