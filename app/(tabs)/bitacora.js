import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  StatusBar, 
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { obtenerBitacoras } from '../services/bitacora';
import theme from '../theme';
import { Picker } from '@react-native-picker/picker';

export default function Bitacora() {
  const [bitacoras, setBitacoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBitacora, setSelectedBitacora] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('conductor');
  const [expandedId, setExpandedId] = useState(null);
  const router = useRouter();

  const cargarBitacoras = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await obtenerBitacoras();
      setBitacoras(data);
    } catch (error) {
      console.error('Error cargando bitacoras:', error);
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
    (bitacora.rut_personal && bitacora.rut_personal.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (bitacora.patente_maquina && bitacora.patente_maquina.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedBitacoras = [...filteredBitacoras].sort((a, b) => {
    if (sortCriteria === 'conductor') {
      return a.rut_personal.localeCompare(b.rut_personal);
    } else if (sortCriteria === 'patente') {
      return a.patente_maquina.localeCompare(b.patente_maquina);
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
          <Text style={styles.cardTitle}>Conductor: {item.rut_personal}</Text>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => setSelectedBitacora(item)}
          >
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Ionicons name="car-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.cardText}>Patente: {item.patente_maquina}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.cardText}>Fecha Salida: {item.fh_salida}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.cardText}>Fecha Llegada: {item.fh_llegada}</Text>
          </View>
          {isExpanded && (
            <>
              <View style={styles.cardRow}>
                <Ionicons name="speedometer-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.cardText}>Kilometraje: {item.kilometraje}</Text>
              </View>
              <View style={styles.cardRow}>
                <Ionicons name="document-text-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.cardText}>Observaciones: {item.observaciones}</Text>
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
        <Text style={styles.headerTitle}>Bitacoras</Text>
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
          </Picker>
        </View>

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
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modals/formulario_bitacora')}
      >
        <Ionicons name="add-outline" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={!!selectedBitacora}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedBitacora(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedBitacora(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {selectedBitacora && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Detalles de Bitacora</Text>
                      <TouchableOpacity 
                        onPress={() => setSelectedBitacora(null)}
                        style={styles.closeButton}
                      >
                        <Ionicons name="close" size={24} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalInfo}>
                      <View style={styles.modalRow}>
                        <Ionicons name="person" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Conductor: {selectedBitacora.rut_personal}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="car" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Patente: {selectedBitacora.patente_maquina}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="calendar" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Fecha Salida: {selectedBitacora.fh_salida}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="time" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Fecha Llegada: {selectedBitacora.fh_llegada}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="speedometer" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Kilometraje: {selectedBitacora.kilometraje}</Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Ionicons name="document-text" size={20} color={theme.colors.textSecondary} />
                        <Text style={styles.modalText}>Observaciones: {selectedBitacora.observaciones}</Text>
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