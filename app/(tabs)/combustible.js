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
  Image,
  TextInput,
  SafeAreaView,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { obtenerCargasCombustible } from '../services/carga_combustible';
import theme from '../theme';
import { Picker } from '@react-native-picker/picker';

export default function Combustible() {
  const [cargas, setCargas] = useState([]);
  const [selectedCarga, setSelectedCarga] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('nombre');
  const [expandedId, setExpandedId] = useState(null);
  const router = useRouter();

  const cargarCombustible = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await obtenerCargasCombustible();
      setCargas(data);
    } catch (error) {
      console.error('Error cargando cargas:', error);
      Alert.alert('Error', 'No se pudieron cargar las cargas de combustible');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarCombustible(false);
  };

  useEffect(() => {
    cargarCombustible();
  }, []);

  const filteredCargas = cargas.filter(carga =>
    (carga.bitacora && carga.bitacora.conductor_nombre && carga.bitacora.conductor_nombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (carga.bitacora && carga.bitacora.conductor_apellido && carga.bitacora.conductor_apellido.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedCargas = [...filteredCargas].sort((a, b) => {
    if (sortCriteria === 'nombre') {
      return a.bitacora.conductor_nombre.localeCompare(b.bitacora.conductor_nombre);
    } else if (sortCriteria === 'apellido') {
      return a.bitacora.conductor_apellido.localeCompare(b.bitacora.conductor_apellido);
    } else if (sortCriteria === 'litros') {
      return b.litros - a.litros;
    } else if (sortCriteria === 'valor') {
      return b.valor_mon - a.valor_mon;
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
            <Ionicons name="person-outline" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.cardTitle}>{item.bitacora.conductor_nombre} {item.bitacora.conductor_apellido}</Text>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => setSelectedCarga(item)}
          >
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Ionicons name="water-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.cardText}>Litros: {item.litros}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="cash-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.cardText}>Valor: ${item.valor_mon}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="barcode-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.cardText}>Código: {item.id}</Text>
          </View>
          {isExpanded && item.img_url && (
            <View style={styles.cardImageContainer}>
              <Image 
                source={{ uri: item.img_url }} 
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cargas de Combustible</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o apellido..."
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
            <Picker.Item label="Ordenar por Nombre" value="nombre" />
            <Picker.Item label="Ordenar por Apellido" value="apellido" />
            <Picker.Item label="Ordenar por Litros" value="litros" />
            <Picker.Item label="Ordenar por Valor" value="valor" />
          </Picker>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={sortedCargas}
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
        onPress={() => router.push('/modals/formulario_combustible')}
      >
        <Ionicons name="add-outline" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={!!selectedCarga}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedCarga(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedCarga(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {selectedCarga && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Detalles de Carga</Text>
                      <TouchableOpacity 
                        onPress={() => setSelectedCarga(null)}
                        style={styles.closeButton}
                      >
                        <Ionicons name="close" size={24} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalInfo}>
                      <View style={styles.modalRow}>
                        <Ionicons name="person" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Conductor: {selectedCarga.bitacora.conductor_nombre} {selectedCarga.bitacora.conductor_apellido}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="water" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Litros: {selectedCarga.litros}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="cash" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Valor: ${selectedCarga.valor_mon}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="barcode" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Código: {selectedCarga.codigo}</Text>
                      </View>
                      {selectedCarga.img_url && (
                        <View style={styles.modalImageContainer}>
                          <Image 
                            source={{ uri: selectedCarga.img_url }} 
                            style={styles.modalImage} 
                            resizeMode="contain" 
                          />
                        </View>
                      )}
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
  cardImageContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
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
  modalImageContainer: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
});