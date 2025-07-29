import api from './authService';

export interface Tank {
  id: string;
  nome: string;
  capacidadeLitros: number;
  metaDiariaLitros: number;
  metaSemanalLitros: number;
  metaMensalLitros: number;
  limitePercentualAlerta: number;
  intervaloAtualizacaoMinutos: number;
  ativo: boolean;
  serialNumber: string;
  ultimaLeitura?: {
    id: string;
    volumeLitros: number;
    percentual: number;
    dataHoraLeitura: string;
  };
}

export interface CreateTankRequest {
  serialNumberDispositivo: string;
  nome: string;
  capacidadeLitros: number;
  metaDiariaLitros: number;
  metaSemanalLitros: number;
  metaMensalLitros: number;
  limitePercentualAlerta: number;
  intervaloAtualizacaoMinutos: number;
}

export interface UpdateTankRequest {
  nome: string;
  capacidadeLitros: number;
  metaDiariaLitros: number;
  metaSemanalLitros: number;
  metaMensalLitros: number;
  limitePercentualAlerta: number;
  intervaloAtualizacaoMinutos: number;
}

export interface TankAnalysis {
  pontosDoGrafico: Array<{
    dataHora: string;
    volume: number;
    percentual: number;
  }>;
  resumo: {
    volumeInicial: number;
    volumeFinal: number;
    consumoTotal: number;
    mediaConsumoLitrosPorHora: number;
    previsaoEsgotamento?: string;
  };
}

export const getTanks = async (): Promise<Tank[]> => {
  try {
    const response = await api.get<Tank[]>('/caixas-dagua');
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao carregar caixas d\'água');
  }
};

export const getTankById = async (id: string): Promise<Tank> => {
  try {
    const response = await api.get<Tank>(`/caixas-dagua/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao carregar detalhes da caixa d\'água');
  }
};

export const createTank = async (tankData: CreateTankRequest): Promise<Tank> => {
  try {
    const response = await api.post<Tank>('/caixas-dagua/parear-dispositivo', tankData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao criar caixa d\'água');
  }
};

export const updateTank = async (id: string, tankData: UpdateTankRequest): Promise<Tank> => {
  try {
    const response = await api.put<Tank>(`/caixas-dagua/${id}`, tankData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao atualizar caixa d\'água');
  }
};

export const deleteTank = async (id: string): Promise<void> => {
  try {
    await api.delete(`/caixas-dagua/${id}`);
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao excluir caixa d\'água');
  }
};

export const getTankAnalysis = async (
  id: string,
  startDate: string,
  endDate: string
): Promise<TankAnalysis> => {
  try {
    const response = await api.get<TankAnalysis>(
      `/caixas-dagua/${id}/analise`,
      {
        params: {
          inicio: startDate,
          fim: endDate,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao carregar análise da caixa d\'água');
  }
};
