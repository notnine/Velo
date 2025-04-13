import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../store/slices/tasksSlice';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={() => onToggleComplete(task.id)}
      >
        <View style={[
          styles.checkboxInner,
          task.isCompleted && styles.checkboxChecked
        ]} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={[
          styles.title,
          task.isCompleted && styles.completedText
        ]}>
          {task.title}
        </Text>
        <Text style={styles.duration}>{task.duration} minutes</Text>
      </View>
      <TouchableOpacity 
        onPress={() => onDelete(task.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    marginVertical: 4,
    marginHorizontal: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#666',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  duration: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 16,
    color: '#666',
  },
});

export default TaskItem; 