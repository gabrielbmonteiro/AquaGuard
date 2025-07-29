import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Login',
          headerBackVisible: true,
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Criar Conta',
          headerBackVisible: true,
        }} 
      />
      <Stack.Screen 
        name="verify" 
        options={{ 
          title: 'Verificar Código',
          headerBackVisible: true,
        }} 
      />
    </Stack>
  );
}
