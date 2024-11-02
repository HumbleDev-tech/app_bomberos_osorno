// app/(tabs)/mantenciones.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

export default function Mantenciones() {
  const [mantenciones, setMantenciones] = useState([]);
  const [selectedMantencion, setSelectedMantencion] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cargarMantenciones = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://18.117.109.85/api/mantencion');
      const data = await response.json();
      setMantenciones(data);
    } catch (error) {
      console.error('Error cargando mantenciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las mantenciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMantenciones();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => setSelectedMantencion(item)}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="construct" size={24} color={theme.colors.primary} />
        <Text style={styles.cardTitle}>Orden: {item.ord_trabajo}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Ionicons name="car" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>Patente: {item.patente}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="person" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>Responsable: {item.personal_responsable}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="build" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>Taller: {item.taller}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="alert-circle" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>Estado: {item.estado_mantencion}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mantenciones</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={mantenciones}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onRefresh={cargarMantenciones}
          refreshing={loading}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modals/formulario_mantenciones')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={!!selectedMantencion}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedMantencion(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedMantencion(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedMantencion && (
                <>
                  <Text style={styles.modalTitle}>Detalles de Mantención</Text>
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalText}>Orden: {selectedMantencion.ord_trabajo}</Text>
                    <Text style={styles.modalText}>Factura: {selectedMantencion.n_factura}</Text>
                    <Text style={styles.modalText}>Costo: ${selectedMantencion.cost_ser}</Text>
                    <Text style={styles.modalText}>Estado: {selectedMantencion.estado_mantencion}</Text>
                    <Text style={styles.modalText}>Patente: {selectedMantencion.patente}</Text>
                    <Text style={styles.modalText}>Responsable: {selectedMantencion.personal_responsable}</Text>
                    <Text style={styles.modalText}>Taller: {selectedMantencion.taller}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginLeft: 10,
  },
  cardContent: {
    marginTop: 10,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.textPrimary,
  },
  modalInfo: {
    width: '100%',
  },
  modalText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
});