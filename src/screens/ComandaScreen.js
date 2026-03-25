import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';

const ComandaScreen = ({ route, navigation }) => {
  const { mesaId, mesaNumero } = route.params;
  const [comanda, setComanda] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Aqui poderíamos buscar a comanda aberta para essa mesa
      const responseProdutos = await api.get('/produtos/');
      setProdutos(responseProdutos.data);

      const responseComandas = await api.get('/comandas/');
      const openComanda = responseComandas.data.find(c => c.mesa_id === mesaId && c.status === 'Aberta');
      setComanda(openComanda);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const addProductToComanda = async (produto) => {
    if (!comanda) {
      Alert.alert("Erro", "Não há comanda aberta para esta mesa.");
      return;
    }

    try {
      await api.post(`/comandas/${comanda.id}/itens/`, {
        produto_id: produto.id,
        quantidade: 1,
        preco_unitario: produto.preco,
        observacao: ""
      });
      Alert.alert("Sucesso", `${produto.nome} adicionado!`);
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      Alert.alert("Erro", "Falha ao adicionar produto.");
    }
  };

  const renderProduto = ({ item }) => (
    <View style={styles.produtoCard}>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoCategoria}>{item.categoria}</Text>
        <Text style={styles.produtoPreco}>R$ {parseFloat(item.preco).toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => addProductToComanda(item)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mesa {mesaNumero}</Text>
      <Text style={styles.subHeader}>
        {comanda ? `Comanda Ativa: #${comanda.id}` : "Sem comanda ativa"}
      </Text>
      
      <Text style={styles.sectionTitle}>Adicionar Produtos</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 5,
  },
  produtoCard: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  produtoCategoria: {
    fontSize: 14,
    color: '#888',
  },
  produtoPreco: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#FFD700',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  }
});

export default ComandaScreen;
