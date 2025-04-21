/**
 * Settings screen where users can configure their preferences and manage their account.
 * Includes time preferences for task scheduling and account-related actions like sign out.
 */
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';
import { Settings as TimePreferences } from '../components/Settings';

export default function SettingsScreen() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace('/(auth)/');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Time Preferences</Text>
          <Text variant="bodyMedium" style={styles.sectionDescription}>
            Configure your productive hours, sleep schedule, and blocked time ranges to help optimize task scheduling.
          </Text>
          <TimePreferences />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Account</Text>
          <Button
            mode="contained-tonal"
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
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
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionDescription: {
    marginBottom: 16,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 8,
  },
  signOutButton: {
    marginTop: 8,
  },
}); 