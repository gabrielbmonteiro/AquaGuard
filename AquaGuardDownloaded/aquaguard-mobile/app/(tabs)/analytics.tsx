import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { getTanks, Tank, getTankAnalysis, TankAnalysis } from '../../services/tankService';

const { width } = Dimensions.get('window');

export default function Analytics() {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [selectedTank, setSelectedTank] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week');
  const [analysis, setAnalysis] = useState<TankAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTanks();
  }, []);

  useEffect(() => {
    if (selectedTank) {
      loadAnalysis();
    }
  }, [selectedTank, selectedPeriod]);

  const loadTanks = async () => {
    try {
      const tanksData = await getTanks();
      setTanks(tanksData);
      if (tanksData.length > 0) {
        setSelectedTank(tanksData[0].id);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar caixas d\'água');
    }
  };

  const loadAnalysis = async () => {
    if (!selectedTank) return;

    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange(selectedPeriod);
      const analysisData = await getTankAnalysis(selectedTank, startDate, endDate);
      setAnalysis(analysisData);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar análise');
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (period: string) => {
    const now = new Date();
    const endDate = now.toISOString();
    
    let startDate: string;
    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
    
    return { startDate, endDate };
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'day': return 'Últimas 24 horas';
      case 'week': return 'Última semana';
      case 'month': return 'Último mês';
      default: return 'Última semana';
    }
  };

  const selectedTankData = tanks.find(tank => tank.id === selectedTank);

  if (tanks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="analytics-outline" size={80} color="#ccc" />
        <Text style={styles.emptyTitle}>Nenhuma caixa encontrada</Text>
        <Text style={styles.emptyText}>
          Adicione pelo menos uma caixa d'água para ver as análises
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Tank and Period Selectors */}
      <View style={styles.selectorsContainer}>
        <View style={styles.selectorCard}>
          <Text style={styles.selectorLabel}>Caixa d'Água</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTank}
              onValueChange={setSelectedTank}
              style={styles.picker}
            >
              {tanks.map((tank) => (
                <Picker.Item
                  key={tank.id}
                  label={tank.nome}
                  value={tank.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.selectorCard}>
          <Text style={styles.selectorLabel}>Período</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPeriod}
              onValueChange={setSelectedPeriod}
              style={styles.picker}
            >
              <Picker.Item label="Últimas 24h" value="day" />
              <Picker.Item label="Última semana" value="week" />
              <Picker.Item label="Último mês" value="month" />
            </Picker>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="analytics" size={40} color="#2196F3" />
          <Text style={styles.loadingText}>Carregando análise...</Text>
        </View>
      ) : analysis ? (
        <View style={styles.analysisContainer}>
          {/* Current Status */}
          {selectedTankData?.ultimaLeitura && (
            <View style={styles.statusCard}>
              <Text style={styles.cardTitle}>Status Atual</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <Text style={styles.statusValue}>
                    {selectedTankData.ultimaLeitura.percentual.toFixed(0)}%
                  </Text>
                  <Text style={styles.statusLabel}>Nível</Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusValue}>
                    {selectedTankData.ultimaLeitura.volumeLitros.toFixed(0)}L
                  </Text>
                  <Text style={styles.statusLabel}>Volume</Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusValue}>
                    {selectedTankData.capacidadeLitros}L
                  </Text>
                  <Text style={styles.statusLabel}>Capacidade</Text>
                </View>
              </View>
            </View>
          )}

          {/* Consumption Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Resumo - {getPeriodLabel(selectedPeriod)}</Text>
            
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Ionicons name="trending-down-outline" size={24} color="#F44336" />
                <Text style={styles.summaryValue}>
                  {analysis.resumo.consumoTotal.toFixed(0)}L
                </Text>
                <Text style={styles.summaryLabel}>Consumo Total</Text>
              </View>

              <View style={styles.summaryItem}>
                <Ionicons name="speedometer-outline" size={24} color="#2196F3" />
                <Text style={styles.summaryValue}>
                  {analysis.resumo.mediaConsumoLitrosPorHora.toFixed(1)}L/h
                </Text>
                <Text style={styles.summaryLabel}>Média por Hora</Text>
              </View>

              <View style={styles.summaryItem}>
                <Ionicons name="play-outline" size={24} color="#4CAF50" />
                <Text style={styles.summaryValue}>
                  {analysis.resumo.volumeInicial.toFixed(0)}L
                </Text>
                <Text style={styles.summaryLabel}>Volume Inicial</Text>
              </View>

              <View style={styles.summaryItem}>
                <Ionicons name="stop-outline" size={24} color="#FF9800" />
                <Text style={styles.summaryValue}>
                  {analysis.resumo.volumeFinal.toFixed(0)}L
                </Text>
                <Text style={styles.summaryLabel}>Volume Final</Text>
              </View>
            </View>

            {analysis.resumo.previsaoEsgotamento && (
              <View style={styles.predictionCard}>
                <Ionicons name="time-outline" size={20} color="#F44336" />
                <Text style={styles.predictionText}>
                  Previsão de esgotamento: {new Date(analysis.resumo.previsaoEsgotamento).toLocaleString('pt-BR')}
                </Text>
              </View>
            )}
          </View>

          {/* Chart Placeholder */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Gráfico de Consumo</Text>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="bar-chart-outline" size={60} color="#ccc" />
              <Text style={styles.chartText}>
                Gráfico será implementado com Victory Native
              </Text>
              <Text style={styles.chartSubtext}>
                {analysis.pontosDoGrafico.length} pontos de dados coletados
              </Text>
            </View>
          </View>

          {/* Goals Comparison */}
          {selectedTankData && (
            <View style={styles.goalsCard}>
              <Text style={styles.cardTitle}>Comparação com Metas</Text>
              
              <View style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalLabel}>Meta Diária</Text>
                  <Text style={styles.goalValue}>
                    {selectedTankData.metaDiariaLitros}L
                  </Text>
                </View>
                <View style={styles.goalBar}>
                  <View 
                    style={[
                      styles.goalProgress, 
                      { 
                        width: `${Math.min(100, (analysis.resumo.consumoTotal / selectedTankData.metaDiariaLitros) * 100)}%`,
                        backgroundColor: analysis.resumo.consumoTotal <= selectedTankData.metaDiariaLitros ? '#4CAF50' : '#F44336'
                      }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalLabel}>Meta Semanal</Text>
                  <Text style={styles.goalValue}>
                    {selectedTankData.metaSemanalLitros}L
                  </Text>
                </View>
                <View style={styles.goalBar}>
                  <View 
                    style={[
                      styles.goalProgress, 
                      { 
                        width: `${Math.min(100, (analysis.resumo.consumoTotal / selectedTankData.metaSemanalLitros) * 100)}%`,
                        backgroundColor: analysis.resumo.consumoTotal <= selectedTankData.metaSemanalLitros ? '#4CAF50' : '#F44336'
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="analytics-outline" size={60} color="#ccc" />
          <Text style={styles.noDataText}>Nenhum dado disponível para análise</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
  },
  selectorsContainer: {
    padding: 15,
    gap: 15,
  },
  selectorCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  analysisContainer: {
    padding: 15,
    gap: 15,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  summaryItem: {
    alignItems: 'center',
    width: '45%',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  predictionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  predictionText: {
    fontSize: 14,
    color: '#F44336',
    marginLeft: 10,
    flex: 1,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  chartPlaceholder: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  chartText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  chartSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  goalsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  goalItem: {
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    color: '#666',
  },
  goalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  goalBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgress: {
    height: '100%',
    borderRadius: 4,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
});
