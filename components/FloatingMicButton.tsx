import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

interface FloatingMicButtonProps {
  onPress: () => void;
  isListening: boolean;
}

export const FloatingMicButton: React.FC<FloatingMicButtonProps> = ({ onPress, isListening }) => {
  const testTTS = async () => {
    console.log('[FloatingMicButton] Testing TTS...');
    try {
      await Speech.speak('Testing text to speech. Can you hear this?', {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
        volume: 1.0,
        onDone: () => console.log('[FloatingMicButton] TTS test finished'),
        onError: (error) => console.log('[FloatingMicButton] TTS test error:', error)
      });
    } catch (error) {
      console.log('[FloatingMicButton] TTS test failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Test TTS Button */}
      <TouchableOpacity
        style={[styles.fab, styles.testButton]}
        onPress={testTTS}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="volume-high" size={24} color="#fff" />
      </TouchableOpacity>
      
      {/* Main Mic Button */}
      <TouchableOpacity
        style={[styles.fab, isListening && styles.listening]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons 
          name={isListening ? "microphone" : "microphone-off"} 
          size={24} 
          color="#fff" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  listening: {
    backgroundColor: '#FF3B30',
  },
  testButton: {
    backgroundColor: '#34C759', // Green color for test button
  },
});

export default FloatingMicButton;
