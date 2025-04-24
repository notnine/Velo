/**
 * Individual task item component that displays a task's title, description, and completion status.
 * Provides buttons to toggle completion and delete the task. Uses Material Design styling.
 */
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton, MD3Colors } from 'react-native-paper';
import { Task } from '../store/taskSlice';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  return (
    <Card style={styles.card} mode="elevated">
      <TouchableOpacity onPress={onEdit}>
        <Card.Content style={styles.content}>
          <View style={styles.leftSection}>
            <IconButton
              icon={task.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
              onPress={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              size={24}
              iconColor={task.completed ? '#007AFF' : '#C7C7CC'}
            />
          </View>
          
          <View style={styles.middleSection}>
            <Text
              style={[
                styles.title,
                task.completed && styles.completedText,
              ]}
            >
              {task.title}
            </Text>
            
            {task.startTime && task.endTime && (
              <Text
                style={[
                  styles.time,
                  task.completed && styles.completedText,
                ]}
              >
                {task.startTime} - {task.endTime}
              </Text>
            )}
            
            {task.description && (
              <Text
                style={[
                  styles.description,
                  task.completed && styles.completedText,
                ]}
              >
                {task.description}
              </Text>
            )}
          </View>

          <View style={styles.rightSection}>
            <IconButton
              icon="trash-can-outline"
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              size={20}
              iconColor="#FF3B30"
            />
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 80,
  },
  leftSection: {
    marginRight: 8,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
    minHeight: 60,
  },
  rightSection: {
    marginLeft: 8,
  },
  title: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '400',
  },
  time: {
    fontSize: 15,
    color: '#8E8E93',
  },
  description: {
    fontSize: 15,
    color: '#8E8E93',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#C7C7CC',
  },
}); 