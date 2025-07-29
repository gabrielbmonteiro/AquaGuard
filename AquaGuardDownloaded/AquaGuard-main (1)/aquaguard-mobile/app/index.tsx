import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  return (
    <LinearGradient
      colors={['#2196F3', '#21CBF3']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons name="water" size={80} color="white" style={styles.icon} />
        <Text style={styles.title}>AquaGuard</Text>
        <Text style={styles.subtitle}>Monitoramento Inteligente de Água</Text>
        
        <View style={styles.buttonContainer}>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Criar Conta</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  secondaryButtonText: {
    color: 'white',
  },
});
