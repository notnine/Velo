/**
 * Layout component for the main app section. Defines the bottom tab navigation
 * between Tasks, Calendar, Settings, and Voice screens.
 */
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useVoiceConversation } from '../lib/VoiceConversationContext';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export default function AppLayout() {
  const { conversationState, handleMicPressIn, handleMicPressOut } = useVoiceConversation();
  const isListening = conversationState === 'listening';

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#e5e5e5',
            paddingRight: 80, // Make space for the mic button
          },
          tabBarActiveTintColor: '#6750A4',
          tabBarInactiveTintColor: '#939393',
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-today" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-month" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
          ),
        }}
      />
      </Tabs>
      
      {/* Blue mic button positioned as 4th tab */}
      <TouchableOpacity
        style={[styles.micButton, isListening && styles.micButtonActive]}
        onPressIn={handleMicPressIn}
        onPressOut={handleMicPressOut}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons 
          name={isListening ? "microphone" : "microphone-off"} 
          size={24} 
          color={isListening ? '#FF3B30' : '#fff'} 
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  micButton: {
    position: 'absolute',
    bottom: 20, // Move up more to align with tab icons
    right: 20, // Move left more to align with tab icons
    width: 56,
    height: 56,
    borderRadius: 28, // Keep circular shape
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  micButtonActive: {
    backgroundColor: '#FF3B30',
  },
}); 