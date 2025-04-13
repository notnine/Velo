import { Stack } from 'expo-router';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './store';

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen 
              name="index" 
              options={{
                title: 'Velo',
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
} 