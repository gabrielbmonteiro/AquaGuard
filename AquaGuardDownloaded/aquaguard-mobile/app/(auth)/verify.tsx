import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { verifyCode, resendCode } from '../../services/authService';

export default function Verify() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!code || code.length !== 4) {
      Alert.alert('Erro', 'Por favor, digite o código de 4 dígitos');
      return;
    }

    if (!email) {
      Alert.alert('Erro', 'E-mail não fornecido');
      return;
    }

    setLoading(true);
    try {
      await verifyCode(email, code);
      Alert.alert('Sucesso', 'Conta verificada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(auth)/login')
        }
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      Alert.alert('Erro', 'E-mail não fornecido');
      return;
    }

    setResendLoading(true);
    try {
      await resendCode(email);
      Alert.alert('Sucesso', 'Código reenviado com sucesso!');
      setCountdown(60);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao reenviar código');
    } finally {
      setResendLoading(false);
    }
  };

  const formatCode = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Limit to 4 digits
    return numericValue.slice(0, 4);
  };

  return (
    <LinearGradient colors={['#2196F3', '#21CBF3']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Ionicons name="mail-outline" size={60} color="white" style={styles.icon} />
          <Text style={styles.title}>Verificar Código</Text>
          <Text style={styles.subtitle}>
            Digite o código de 4 dígitos enviado para:{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>

          <View style={styles.form}>
            <View style={styles.codeContainer}>
              <TextInput
                style={styles.codeInput}
                value={code}
                onChangeText={(value) => setCode(formatCode(value))}
                keyboardType="number-pad"
                maxLength={4}
                textAlign="center"
                placeholder="0000"
                placeholderTextColor="#ccc"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verificando...' : 'Verificar'}
              </Text>
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              {countdown > 0 ? (
                <Text style={styles.countdownText}>
                  Reenviar código em {countdown}s
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendCode}
                  disabled={resendLoading}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendText}>
                    {resendLoading ? 'Reenviando...' : 'Reenviar código'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  email: {
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
  codeContainer: {
    marginBottom: 30,
  },
  codeInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 80,
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  countdownText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  resendButton: {
    padding: 10,
  },
  resendText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
