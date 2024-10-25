import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme';

export default function Mantenciones() {
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMaintenanceTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('maintenanceTasks');
        const tasks = storedTasks ? JSON.parse(storedTasks) : [];
        setMaintenanceTasks(tasks);
      } catch (error) {
        console.error('Error fetching maintenance tasks:', error);
      }
    };
    fetchMaintenanceTasks();
  }, []);

  const handleCardPress = (task) => {
    setSelectedTask(task);
  };

  const handleDelete = async (id) => {
    try {
      const updatedTasks = maintenanceTasks.filter(task => task.id !== id);
      setMaintenanceTasks(updatedTasks);
      await AsyncStorage.setItem('maintenanceTasks', JSON.stringify(updatedTasks));
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting maintenance task:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <View style={styles.cardHeader}>
        <Ionicons name="construct" size={24} color={theme.colors.primary} />
        <Text style={styles.cardTitle}>{item.vehicle}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Ionicons name="calendar" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>{item.date}</Text>
        </View>
        <Text style={styles.cardText}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mantenciones</Text>
      </View>
      <FlatList
        data={maintenanceTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modals/formulario_mantenciones')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={!!selectedTask}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedTask(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedTask(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedTask && (
                <>
                  <Text style={styles.modalTitle}>{selectedTask.vehicle}</Text>
                  <View style={styles.modalInfo}>
                    <Ionicons name="calendar" size={24} color={theme.colors.primary} />
                    <Text style={styles.modalText}>Fecha: {selectedTask.date}</Text>
                  </View>
                  <Text style={styles.modalText}>Descripción: {selectedTask.description}</Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonEdit]}
                      onPress={() => {
                        router.push(`/modals/formulario_mantenciones?id=${selectedTask.id}`);
                        setSelectedTask(null);
                      }}
                    >
                      <Ionicons name="create" size={20} color="white" />
                      <Text style={styles.modalButtonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonDelete]}
                      onPress={() => {
                        handleDelete(selectedTask.id);
                        setSelectedTask(null);
                      }}
                    >
                      <Ionicons name="trash" size={20} color="white" />
                      <Text style={styles.modalButtonText}>Eliminar</Text>
                    </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalButtonEdit: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonDelete: {
    backgroundColor: theme.colors.danger,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});