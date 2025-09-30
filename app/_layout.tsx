/**
 * Root layout component that manages app-wide configuration, authentication state, and navigation.
 * This is the highest level component that wraps the entire app with necessary providers.
 */
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { configureRevenueCat, logInRevenueCat, logOutRevenueCat } from '../lib/revenuecat';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './store';
import { VoiceConversationProvider } from './lib/VoiceConversationContext';

export default function RootLayout() {
  useEffect(() => {
    configureRevenueCat();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const userId = session?.user?.id;
      if (userId) {
        await logInRevenueCat(userId);
      } else {
        await logOutRevenueCat();
      }
    });
    return () => {
      sub.subscription?.unsubscribe();
    };
  }, []);
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