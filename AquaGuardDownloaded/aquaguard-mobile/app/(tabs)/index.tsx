import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getCurrentUser, User } from '../../services/authService';
import { getTanks, Tank } from '../../services/tankService';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      
      if (userData) {
        const tanksData = await getTanks();
        setTanks(tanksData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Erro', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getWaterLevelColor = (percentage: number) => {
    if (percentage >= 70) return '#4CAF50'; // Green
    if (percentage >= 30) return '#FF9800'; // Orange
    return '#F44336'; // Red
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
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const totalTanks = tanks.length;
  const activeTanks = tanks.filter(tank => tank.ativo).length;
  const lowLevelTanks = tanks.filter(tank => tank.ultimaLeitura && tank.ultimaLeitura.percentual < 30).length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <LinearGradient colors={['#2196F3', '#21CBF3']} style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Olá, {user?.nome || 'Usuário'}! 👋
        </Text>
        <Text style={styles.welcomeSubtext}>
          Bem-vindo ao seu painel de monitoramento
        </Text>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="water-outline" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>{totalTanks}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{activeTanks}</Text>
            <Text style={styles.statLabel}>Ativas</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="alert-circle-outline" size={24} color="#F44336" />
            <Text style={styles.statNumber}>{lowLevelTanks}</Text>
            <Text style={styles.statLabel}>Alertas</Text>
          </View>
        </View>
      </View>

      {/* Tanks Overview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suas Caixas d'Água</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/tanks')}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>Ver todas</Text>
            <Ionicons name="chevron-forward" size={16} color="#2196F3" />
          </TouchableOpacity>
        </View>

        {tanks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="water-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma caixa d'água encontrada</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/(tabs)/tanks')}
            >
              <Text style={styles.addButtonText}>Adicionar Primeira Caixa</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tanks.slice(0, 5).map((tank) => (
              <TouchableOpacity
                key={tank.id}
                style={styles.tankCard}
                onPress={() => router.push(`/tank/${tank.id}`)}
              >
                <View style={styles.tankHeader}>
                  <Text style={styles.tankName}>{tank.nome}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: tank.ultimaLeitura ? getWaterLevelColor(tank.ultimaLeitura.percentual) : '#ccc' }
                  ]}>
                    <Text style={styles.statusText}>
                      {tank.ultimaLeitura ? getStatusText(tank.ultimaLeitura.percentual) : 'Sem dados'}
                    </Text>
                  </View>
                </View>

                <View style={styles.tankLevel}>
                  <View style={styles.levelContainer}>
                    <View
                      style={[
                        styles.levelFill,
                        {
                          width: `${tank.ultimaLeitura?.percentual || 0}%`,
                          backgroundColor: tank.ultimaLeitura ? getWaterLevelColor(tank.ultimaLeitura.percentual) : '#ccc'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.levelText}>
                    {tank.ultimaLeitura?.percentual.toFixed(0) || '0'}%
                  </Text>
                </View>

                <View style={styles.tankInfo}>
                  <Text style={styles.tankCapacity}>
                    Capacidade: {tank.capacidadeLitros}L
                  </Text>
                  {tank.ultimaLeitura && (
                    <Text style={styles.tankVolume}>
                      Volume atual: {tank.ultimaLeitura.volumeLitros.toFixed(0)}L
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/tanks')}
          >
            <Ionicons name="add-circle-outline" size={32} color="#2196F3" />
            <Text style={styles.actionText}>Adicionar Caixa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/analytics')}
          >
            <Ionicons name="analytics-outline" size={32} color="#2196F3" />
            <Text style={styles.actionText}>Ver Análises</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons name="settings-outline" size={32} color="#2196F3" />
            <Text style={styles.actionText}>Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  welcomeSection: {
    padding: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#2196F3',
    fontSize: 14,
    marginRight: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tankCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    width: width * 0.7,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  tankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tankLevel: {
    marginBottom: 15,
  },
  levelContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 5,
  },
  levelFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tankInfo: {
    gap: 5,
  },
  tankCapacity: {
    fontSize: 12,
    color: '#666',
  },
  tankVolume: {
    fontSize: 12,
    color: '#666',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    marginTop: 10,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});
