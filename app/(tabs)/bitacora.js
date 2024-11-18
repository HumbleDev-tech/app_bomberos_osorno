import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  TouchableWithoutFeedback, 
  StatusBar, 
  ActivityIndicator, 
  TextInput 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { obtenerBitacoras } from '../services/bitacora';
import theme from '../theme';
import { Picker } from '@react-native-picker/picker';

export default function Bitacora() {
  const [bitacoras, setBitacoras] = useState([]);
  const [selectedBitacora, setSelectedBitacora] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('conductor');
  const router = useRouter();

  const cargarBitacoras = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await obtenerBitacoras();
      setBitacoras(data);
    } catch (error) {
      console.error('Error cargando bitacoras:', error);
      Alert.alert(
        'Error', 
        'No se pudieron cargar las bitacoras'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarBitacoras(false);
  };

  useEffect(() => {
    cargarBitacoras();
  }, []);

  const filteredBitacoras = bitacoras.filter(bitacora =>
    (bitacora.conductor && bitacora.conductor.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (bitacora.patente && bitacora.patente.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedBitacoras = [...filteredBitacoras].sort((a, b) => {
    if (sortCriteria === 'conductor') {
      return a.conductor.localeCompare(b.conductor);
    } else if (sortCriteria === 'patente') {
      return a.patente.localeCompare(b.patente);
    } else if (sortCriteria === 'fecha') {
      return new Date(b.fecha) - new Date(a.fecha);
    }
    return 0;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => setSelectedBitacora(item)}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="document-text" size={24} color={theme.colors.primary} />
        <Text style={styles.cardTitle}>Conductor: {item.conductor}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Ionicons name="car" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>Patente: {item.patente}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="calendar" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>Fecha: {item.fecha}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="time" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>Hora: {item.hora}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bitacoras</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por conductor o patente..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Picker
        selectedValue={sortCriteria}
        style={styles.picker}
        onValueChange={(itemValue) => setSortCriteria(itemValue)}
      >
        <Picker.Item label="Ordenar por Conductor" value="conductor" />
        <Picker.Item label="Ordenar por Patente" value="patente" />
        <Picker.Item label="Ordenar por Fecha" value="fecha" />
      </Picker>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={sortedBitacoras}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modals/formulario_bitacora')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        visible={!!selectedBitacora}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedBitacora(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedBitacora(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedBitacora && (
                <>
                  <Text style={styles.modalTitle}>Detalles de Bitacora</Text>
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalText}>Conductor: {selectedBitacora.conductor}</Text>
                    <Text style={styles.modalText}>Patente: {selectedBitacora.patente}</Text>
                    <Text style={styles.modalText}>Fecha: {selectedBitacora.fecha}</Text>
                    <Text style={styles.modalText}>Hora: {selectedBitacora.hora}</Text>
                    <Text style={styles.modalText}>Descripción: {selectedBitacora.descripcion}</Text>
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
  searchBar: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 10,
    margin: 15,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  picker: {
    margin: 15,
  },
});
