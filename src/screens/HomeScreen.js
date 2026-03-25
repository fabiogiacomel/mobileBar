import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mesas/');
      setMesas(response.data);
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMesa = ({ item }) => {
    const isOccupied = item.status === 'Ocupada';
    return (
      <TouchableOpacity 
        style={[styles.card, isOccupied ? styles.cardOccupied : styles.cardFree]}
        onPress={() => navigation.navigate('Comanda', { mesaId: item.id, mesaNumero: item.numero })}
      >
        <Text style={styles.cardTitle}>Mesa {item.numero}</Text>
        <Text style={styles.cardStatus}>{item.status}</Text>
        <Text style={styles.cardInfo}>Capacidade: {item.capacidade}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bar Cascavel 🍻</Text>
      <FlatList
        data={mesas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMesa}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshing={loading}
        onRefresh={fetchMesas}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginVertical: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 0.48,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardFree: {
    backgroundColor: '#2e7d32', // Verde
  },
  cardOccupied: {
    backgroundColor: '#c62828', // Vermelho
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardStatus: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  cardInfo: {
    fontSize: 12,
    color: '#e0e0e0',
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  }
});

export default HomeScreen;
