import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NavBarMicButtonProps {
  onPress: () => void;
  isListening: boolean;
  color: string; // Color from tab bar (active/inactive)
}

export const NavBarMicButton: React.FC<NavBarMicButtonProps> = ({ 
  onPress, 
  isListening, 
  color 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isListening && styles.listening
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons 
        name={isListening ? "microphone" : "microphone-off"} 
        size={24} 
        color={isListening ? '#FF3B30' : color} // Red when listening, otherwise use tab color
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 16, // Add some margin from the right edge
    justifyContent: 'center',
    alignItems: 'center',
  },
  listening: {
    // Optional: Add background color when listening
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 20,
  },
});
