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
  TextInput,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { obtenerMantenciones } from '../services/mantencion';
import theme from '../theme';
import { Picker } from '@react-native-picker/picker';

export default function Mantenciones() {
  const [mantenciones, setMantenciones] = useState([]);
  const [selectedMantencion, setSelectedMantencion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('conductor');
  const [expandedId, setExpandedId] = useState(null);
  const router = useRouter();

  const cargarMantenciones = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await obtenerMantenciones();
      setMantenciones(data);
    } catch (error) {
      console.error('Error cargando mantenciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las mantenciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarMantenciones(false);
  };

  useEffect(() => {
    cargarMantenciones();
  }, []);

  const filteredMantenciones = mantenciones.filter(mantencion =>
    (mantencion.bitacora && mantencion.bitacora.conductor && mantencion.bitacora.conductor.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (mantencion.patente && mantencion.patente.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedMantenciones = [...filteredMantenciones].sort((a, b) => {
    if (sortCriteria === 'conductor') {
      return a.bitacora.conductor.localeCompare(b.bitacora.conductor);
    } else if (sortCriteria === 'patente') {
      return a.patente.localeCompare(b.patente);
    } else if (sortCriteria === 'estado') {
      return a.estado_mantencion.localeCompare(b.estado_mantencion);
    }
    return 0;
  });

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    
    return (
      <TouchableOpacity 
        style={[styles.card, isExpanded && styles.cardExpanded]} 
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderIcon}>
            <Ionicons name="construct-outline" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Orden: {item.ord_trabajo}</Text>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => setSelectedMantencion(item)}
          >
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Ionicons name="car-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.cardText}>Patente: {item.patente}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="person-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.cardText}>Conductor: {item.bitacora.conductor}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="build-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.cardText}>Taller: {item.taller}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="alert-circle-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.cardText}>Estado: {item.estado_mantencion}</Text>
          </View>
          {isExpanded && (
            <>
              <View style={styles.cardRow}>
                <Ionicons name="receipt-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.cardText}>Factura: {item.n_factura}</Text>
              </View>
              <View style={styles.cardRow}>
                <Ionicons name="cash-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.cardText}>Costo: ${item.cost_ser}</Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mantenciones</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por conductor o patente..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sortCriteria}
            style={styles.picker}
            onValueChange={(itemValue) => setSortCriteria(itemValue)}
          >
            <Picker.Item label="Ordenar por Conductor" value="conductor" />
            <Picker.Item label="Ordenar por Patente" value="patente" />
            <Picker.Item label="Ordenar por Estado" value="estado" />
          </Picker>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={sortedMantenciones}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modals/formulario_mantenciones')}
      >
        <Ionicons name="add-outline" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={!!selectedMantencion}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedMantencion(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedMantencion(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {selectedMantencion && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Detalles de Mantención</Text>
                      <TouchableOpacity 
                        onPress={() => setSelectedMantencion(null)}
                        style={styles.closeButton}
                      >
                        <Ionicons name="close" size={24} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalInfo}>
                      <View style={styles.modalRow}>
                        <Ionicons name="construct" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Orden: {selectedMantencion.ord_trabajo}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="receipt" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Factura: {selectedMantencion.n_factura}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="cash" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Costo: ${selectedMantencion.cost_ser}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="alert-circle" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Estado: {selectedMantencion.estado_mantencion}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="car" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Patente: {selectedMantencion.patente}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="person" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Responsable: {selectedMantencion.personal_responsable}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="build" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Taller: {selectedMantencion.taller}</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    height: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  cardExpanded: {
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff1f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  detailsButton: {
    padding: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  cardContent: {
    padding: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalInfo: {
    padding: 16,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
});