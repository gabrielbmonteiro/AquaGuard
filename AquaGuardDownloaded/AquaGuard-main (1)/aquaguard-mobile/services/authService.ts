import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure base URL - você deve ajustar para o IP da sua máquina quando testar
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface User {
  id: string;
  nome: string;
  sobrenome: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
}

export interface LoginResponse {
  token: string;
}

export const login = async (email: string, senha: string): Promise<User> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      senha,
    });

    const { token } = response.data;
    await AsyncStorage.setItem('auth_token', token);

    // Get user profile
    const profileResponse = await api.get<User>('/users/me');
    const userData = profileResponse.data;
    
    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    
    return userData;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao fazer login. Verifique suas credenciais.');
  }
};

export const register = async (userData: RegisterRequest): Promise<User> => {
  try {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao criar conta. Tente novamente.');
  }
};

export const verifyCode = async (email: string, codigo: string): Promise<void> => {
  try {
    await api.post('/auth/verify', {
      email,
      codigo,
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Código de verificação inválido.');
  }
};

export const resendCode = async (email: string): Promise<void> => {
  try {
    await api.post('/auth/resend-code', { email });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao reenviar código.');
  }
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('auth_token');
  await AsyncStorage.removeItem('user_data');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem('auth_token');
  return !!token;
};

export default api;
