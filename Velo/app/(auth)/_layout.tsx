import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Sign In' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
    </Stack>
  );
} 