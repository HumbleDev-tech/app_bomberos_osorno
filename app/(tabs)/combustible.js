// app/(tabs)/combustible.js
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
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { obtenerCargasCombustible } from '../services/carga_combustible';
import theme from '../theme';

export default function Combustible() {
  const [cargas, setCargas] = useState([]);
  const [selectedCarga, setSelectedCarga] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const cargarCombustible = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await obtenerCargasCombustible();
      setCargas(data);
    } catch (error) {
      console.error('Error cargando cargas:', error);
      Alert.alert(
        'Error', 
        'No se pudieron cargar las cargas de combustible'
      );
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

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => setSelectedCarga(item)}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="car" size={24} color={theme.colors.primary} />
        <Text style={styles.cardTitle}>Patente: {item.patente}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Ionicons name="water" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>Litros: {item.litros}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="cash" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>Valor: ${item.valor_mon}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="barcode" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.cardText}>Código: {item.codigo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cargas de Combustible</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={cargas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modals/formulario_combustible')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        visible={!!selectedCarga}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedCarga(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedCarga(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedCarga && (
                <>
                  <Text style={styles.modalTitle}>Detalles de Carga</Text>
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalText}>Patente: {selectedCarga.patente}</Text>
                    <Text style={styles.modalText}>Litros: {selectedCarga.litros}</Text>
                    <Text style={styles.modalText}>Valor: ${selectedCarga.valor_mon}</Text>
                    <Text style={styles.modalText}>Código: {selectedCarga.codigo}</Text>
                    {selectedCarga.img_url ? (
                      <Image 
                        source={{ uri: selectedCarga.img_url }} 
                        style={styles.modalImage} 
                        resizeMode="contain" 
                      />
                    ) : (
                      <Text style={styles.modalText}>Sin comprobante adjunto</Text>
                    )}
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
  modalImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});