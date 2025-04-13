import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/slices/tasksSlice';
import TaskList from '../components/TaskList';

export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');

  const handleAddTask = () => {
    if (title.trim() && duration.trim()) {
      dispatch(
        addTask({
          id: Date.now().toString(),
          title: title.trim(),
          duration: parseInt(duration, 10),
          isCompleted: false,
        })
      );
      setTitle('');
      setDuration('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Duration (minutes)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleAddTask}
          disabled={!title.trim() || !duration.trim()}
          style={[
            styles.button,
            (!title.trim() || !duration.trim()) && styles.buttonDisabled
          ]}
        >
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      <TaskList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen; 