import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getTanks, Tank, createTank, deleteTank, CreateTankRequest } from '../../services/tankService';

export default function Tanks() {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<CreateTankRequest>({
    serialNumberDispositivo: '',
    nome: '',
    capacidadeLitros: 1000,
    metaDiariaLitros: 500,
    metaSemanalLitros: 3500,
    metaMensalLitros: 15000,
    limitePercentualAlerta: 20,
    intervaloAtualizacaoMinutos: 30,
  });

  useEffect(() => {
    loadTanks();
  }, []);

  const loadTanks = async () => {
    try {
      const tanksData = await getTanks();
      setTanks(tanksData);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar caixas d\'água');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTanks();
    setRefreshing(false);
  };

  const handleCreateTank = async () => {
    if (!formData.serialNumberDispositivo || !formData.nome) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios');
      return;
    }

    setCreating(true);
    try {
      await createTank(formData);
      Alert.alert('Sucesso', 'Caixa d\'água criada com sucesso!');
      setModalVisible(false);
      resetForm();
      await loadTanks();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar caixa d\'água');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTank = (tank: Tank) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a caixa "${tank.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTank(tank.id);
              Alert.alert('Sucesso', 'Caixa d\'água excluída com sucesso!');
              await loadTanks();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao excluir caixa d\'água');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      serialNumberDispositivo: '',
      nome: '',
      capacidadeLitros: 1000,
      metaDiariaLitros: 500,
      metaSemanalLitros: 3500,
      metaMensalLitros: 15000,
      limitePercentualAlerta: 20,
      intervaloAtualizacaoMinutos: 30,
    });
  };

  const getWaterLevelColor = (percentage: number) => {
    if (percentage >= 70) return '#4CAF50';
    if (percentage >= 30) return '#FF9800';
    return '#F44336';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 70) return 'Nível Normal';
    if (percentage >= 30) return 'Nível Médio';
    return 'Nível Baixo';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="water" size={60} color="#2196F3" />
        <Text style={styles.loadingText}>Carregando caixas d'água...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tanks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="water-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Nenhuma caixa d'água</Text>
            <Text style={styles.emptyText}>
              Adicione sua primeira caixa d'água para começar o monitoramento
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.addButtonText}>Adicionar Caixa</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tanksContainer}>
            {tanks.map((tank) => (
              <TouchableOpacity
                key={tank.id}
                style={styles.tankCard}
                onPress={() => router.push(`/tank/${tank.id}`)}
              >
                <View style={styles.tankHeader}>
                  <View style={styles.tankInfo}>
                    <Text style={styles.tankName}>{tank.nome}</Text>
                    <Text style={styles.tankCapacity}>
                      Capacidade: {tank.capacidadeLitros}L
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => handleDeleteTank(tank)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>

                {tank.ultimaLeitura ? (
                  <>
                    <View style={styles.levelSection}>
                      <View style={styles.levelInfo}>
                        <Text style={styles.levelPercentage}>
                          {tank.ultimaLeitura.percentual.toFixed(0)}%
                        </Text>
                        <Text style={styles.levelVolume}>
                          {tank.ultimaLeitura.volumeLitros.toFixed(0)}L
                        </Text>
                      </View>
                      
                      <View style={styles.levelBarContainer}>
                        <View style={styles.levelBar}>
                          <LinearGradient
                            colors={[
                              getWaterLevelColor(tank.ultimaLeitura.percentual),
                              getWaterLevelColor(tank.ultimaLeitura.percentual),
                            ]}
                            style={[
                              styles.levelFill,
                              { width: `${tank.ultimaLeitura.percentual}%` }
                            ]}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.statusSection}>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getWaterLevelColor(tank.ultimaLeitura.percentual) }
                      ]}>
                        <Text style={styles.statusText}>
                          {getStatusText(tank.ultimaLeitura.percentual)}
                        </Text>
                      </View>
                      
                      <Text style={styles.lastUpdate}>
                        Atualizado: {new Date(tank.ultimaLeitura.dataHoraLeitura).toLocaleString('pt-BR')}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.noDataSection}>
                    <Ionicons name="alert-circle-outline" size={40} color="#ccc" />
                    <Text style={styles.noDataText}>Sem dados de leitura</Text>
                  </View>
                )}

                <View style={styles.tankFooter}>
                  <View style={styles.metaInfo}>
                    <Text style={styles.metaLabel}>Meta diária:</Text>
                    <Text style={styles.metaValue}>{tank.metaDiariaLitros}L</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>Ver detalhes</Text>
                    <Ionicons name="chevron-forward" size={16} color="#2196F3" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Create Tank Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Caixa d'Água</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Serial do Dispositivo *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.serialNumberDispositivo}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, serialNumberDispositivo: value }))}
                  placeholder="Digite o serial do dispositivo"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome da Caixa *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nome}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, nome: value }))}
                  placeholder="Ex: Caixa Principal"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Capacidade (Litros)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.capacidadeLitros.toString()}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, capacidadeLitros: parseInt(value) || 0 }))}
                  keyboardType="numeric"
                  placeholder="1000"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Meta Diária (Litros)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.metaDiariaLitros.toString()}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, metaDiariaLitros: parseInt(value) || 0 }))}
                  keyboardType="numeric"
                  placeholder="500"
                />
              </View>

              <TouchableOpacity
                style={[styles.createButton, creating && styles.createButtonDisabled]}
                onPress={handleCreateTank}
                disabled={creating}
              >
                <Text style={styles.createButtonText}>
                  {creating ? 'Criando...' : 'Criar Caixa'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tanksContainer: {
    padding: 15,
  },
  tankCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tankInfo: {
    flex: 1,
  },
  tankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tankCapacity: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 5,
  },
  levelSection: {
    marginBottom: 15,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  levelVolume: {
    fontSize: 16,
    color: '#666',
  },
  levelBarContainer: {
    marginBottom: 10,
  },
  levelBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  levelFill: {
    height: '100%',
    borderRadius: 6,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#666',
  },
  noDataSection: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  tankFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#2196F3',
    fontSize: 14,
    marginRight: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  createButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
