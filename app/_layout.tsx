/**
 * Root layout component that manages app-wide configuration, authentication state, and navigation.
 * This is the highest level component that wraps the entire app with necessary providers.
 */
import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { Stack, router, Slot, useRouter, useSegments } from 'expo-router';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './store';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Logged in' : 'No session');
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session ? 'Logged in' : 'No session');
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading
    
    const inAuthGroup = segments[0] === '(auth)';
    console.log('Current route:', segments.join('/'));
    console.log('In auth group:', inAuthGroup);
    console.log('Has session:', !!session);

    if (!session && !inAuthGroup) {
      console.log('Redirecting to auth');
      router.replace('/(auth)/');
    } else if (session && inAuthGroup) {
      console.log('Redirecting to home');
      router.replace('/(app)/');
    }
  }, [session, segments, isLoading]);

  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
} 