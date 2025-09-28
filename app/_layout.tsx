/**
 * Root layout component that manages app-wide configuration, authentication state, and navigation.
 * This is the highest level component that wraps the entire app with necessary providers.
 */
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { Slot } from 'expo-router';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './store';
import { VoiceConversationProvider } from './lib/VoiceConversationContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <PaperProvider>
          <SafeAreaProvider>
            <VoiceConversationProvider>
              <Slot />
            </VoiceConversationProvider>
          </SafeAreaProvider>
        </PaperProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
} 