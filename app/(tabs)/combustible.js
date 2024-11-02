import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme';

export default function Combustible() {
  const [fuelLoads, setFuelLoads] = useState([]);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFuelLoads = async () => {
      try {
        const storedFuelLoads = await AsyncStorage.getItem('fuelLoads');
        const fuelLoads = storedFuelLoads ? JSON.parse(storedFuelLoads) : [];
        setFuelLoads(fuelLoads);
      } catch (error) {
        console.error('Error fetching fuel loads:', error);
      }
    };
    fetchFuelLoads();
  }, []);

  const handleCardPress = (load) => {
    setSelectedLoad(load);
  };

  const handleDelete = async (id) => {
    try {
      const updatedFuelLoads = fuelLoads.filter(load => load.id !== id);
      setFuelLoads(updatedFuelLoads);
      await AsyncStorage.setItem('fuelLoads', JSON.stringify(updatedFuelLoads));
      setSelectedLoad(null);
    } catch (error) {
      console.error('Error deleting fuel load:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <View style={styles.cardHeader}>
        <Ionicons name="car" size={24} color={theme.colors.primary} />
        <Text style={styles.cardTitle}>{item.vehicle}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Ionicons name="water" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>{item.amount} L</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="calendar" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Registro de Combustible</Text>
      </View>
      <FlatList
        data={fuelLoads}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modals/formulario_combustible')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        visible={!!selectedLoad}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedLoad(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedLoad(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedLoad && (
                <>
                  <Text style={styles.modalTitle}>{selectedLoad.vehicle}</Text>
                  <View style={styles.modalInfo}>
                    <Ionicons name="water" size={24} color={theme.colors.primary} />
                    <Text style={styles.modalText}>Cantidad: {selectedLoad.amount} L</Text>
                  </View>
                  <View style={styles.modalInfo}>
                    <Ionicons name="calendar" size={24} color={theme.colors.primary} />
                    <Text style={styles.modalText}>Fecha: {selectedLoad.date}</Text>
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
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
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
  cardDate: {
    fontSize: 14,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginLeft: 10,
  },
});