import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace('/(auth)/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Settings</Text>
      </View>

      <View style={styles.content}>
        <Button
          mode="contained"
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          Sign Out
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    padding: 16,
  },
  signOutButton: {
    marginTop: 20,
  },
}); 