import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getCurrentUser, logout, User } from '../../services/authService';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      if (userData) {
        setEditForm({
          nome: userData.nome,
          sobrenome: userData.sobrenome,
          telefone: userData.telefone,
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleUpdateProfile = () => {
    // TODO: Implement profile update
    Alert.alert('Em breve', 'Funcionalidade será implementada');
    setEditModalVisible(false);
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    // TODO: Implement password change
    Alert.alert('Em breve', 'Funcionalidade será implementada');
    setPasswordModalVisible(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const profileOptions = [
    {
      icon: 'person-outline',
      title: 'Editar Perfil',
      subtitle: 'Alterar nome, sobrenome e telefone',
      onPress: () => setEditModalVisible(true),
      color: '#2196F3',
    },
    {
      icon: 'lock-closed-outline',
      title: 'Alterar Senha',
      subtitle: 'Alterar sua senha de acesso',
      onPress: () => setPasswordModalVisible(true),
      color: '#FF9800',
    },
    {
      icon: 'mail-outline',
      title: 'Alterar E-mail',
      subtitle: 'Alterar seu endereço de e-mail',
      onPress: () => Alert.alert('Em breve', 'Funcionalidade será implementada'),
      color: '#9C27B0',
    },
    {
      icon: 'water-outline',
      title: 'Minhas Caixas',
      subtitle: 'Gerenciar caixas d\'água',
      onPress: () => router.push('/(tabs)/tanks'),
      color: '#00BCD4',
    },
    {
      icon: 'analytics-outline',
      title: 'Relatórios',
      subtitle: 'Ver análises de consumo',
      onPress: () => router.push('/(tabs)/analytics'),
      color: '#4CAF50',
    },
    {
      icon: 'help-circle-outline',
      title: 'Ajuda',
      subtitle: 'Central de ajuda e suporte',
      onPress: () => Alert.alert('Em breve', 'Central de ajuda será implementada'),
      color: '#607D8B',
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="person" size={60} color="#2196F3" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <LinearGradient colors={['#2196F3', '#21CBF3']} style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.nomeCompleto || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userPhone}>{user?.telefone}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Notifications Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={24} color="#2196F3" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notificações Push</Text>
              <Text style={styles.settingSubtitle}>Receber alertas no dispositivo</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#2196F3' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="mail-outline" size={24} color="#2196F3" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notificações por E-mail</Text>
              <Text style={styles.settingSubtitle}>Receber alertas por e-mail</Text>
            </View>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: '#767577', true: '#2196F3' }}
            thumbColor={emailNotifications ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Profile Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        
        {profileOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={option.onPress}
          >
            <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
              <Ionicons name={option.icon as any} size={20} color="white" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#F44336" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.nome}
                  onChangeText={(value) => setEditForm(prev => ({ ...prev, nome: value }))}
                  placeholder="Digite seu nome"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sobrenome</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.sobrenome}
                  onChangeText={(value) => setEditForm(prev => ({ ...prev, sobrenome: value }))}
                  placeholder="Digite seu sobrenome"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.telefone}
                  onChangeText={(value) => setEditForm(prev => ({ ...prev, telefone: value }))}
                  placeholder="Digite seu telefone"
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar Senha</Text>
              <TouchableOpacity
                onPress={() => setPasswordModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha Atual</Text>
                <TextInput
                  style={styles.input}
                  value={passwordForm.currentPassword}
                  onChangeText={(value) => setPasswordForm(prev => ({ ...prev, currentPassword: value }))}
                  placeholder="Digite sua senha atual"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nova Senha</Text>
                <TextInput
                  style={styles.input}
                  value={passwordForm.newPassword}
                  onChangeText={(value) => setPasswordForm(prev => ({ ...prev, newPassword: value }))}
                  placeholder="Digite a nova senha"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirmar Nova Senha</Text>
                <TextInput
                  style={styles.input}
                  value={passwordForm.confirmPassword}
                  onChangeText={(value) => setPasswordForm(prev => ({ ...prev, confirmPassword: value }))}
                  placeholder="Confirme a nova senha"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.saveButtonText}>Alterar Senha</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  header: {
    padding: 20,
    paddingBottom: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 3,
  },
  userPhone: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '600',
    marginLeft: 10,
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
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
