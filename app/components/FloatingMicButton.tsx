import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useVoiceConversation } from '../lib/VoiceConversationContext';

export default function FloatingMicButton() {
  const {
    conversationState,
    conversationEnded,
    handleMicButton,
  } = useVoiceConversation();

  return (
    <View style={styles.fabContainer} pointerEvents="box-none">
      {/* Conversation State Indicator (only when not idle) */}
      {conversationState !== 'idle' && (
        <View style={styles.conversationIndicator}>
          {conversationState === 'listening' && <Text style={styles.indicatorListening}>Listening...</Text>}
          {conversationState === 'thinking' && <Text style={styles.indicatorThinking}>Thinking...</Text>}
          {conversationState === 'speaking' && <Text style={styles.indicatorSpeaking}>Speaking...</Text>}
        </View>
      )}
      {conversationEnded && (
        <View style={styles.endedContainer}>
          <Text style={styles.endedText}>Conversation ended</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleMicButton}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="microphone" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 88, // moved up to clear the tab bar
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  fab: {
    backgroundColor: '#FF3B30',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  conversationIndicator: {
    marginBottom: 8,
    alignItems: 'center',
    minHeight: 24,
  },
  indicatorListening: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  indicatorThinking: {
    color: '#FF9500',
    fontWeight: 'bold',
  },
  indicatorSpeaking: {
    color: '#34C759',
    fontWeight: 'bold',
  },
  endedContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  endedText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 