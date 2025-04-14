import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, MD3Colors } from 'react-native-paper';
import { Task } from '../store/taskSlice';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.taskInfo}>
          <IconButton
            icon={task.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
            onPress={onToggle}
            size={24}
            iconColor={task.completed ? MD3Colors.primary40 : MD3Colors.neutral40}
          />
          <View>
            <Text
              variant="titleMedium"
              style={[
                styles.title,
                task.completed && styles.completedText,
              ]}
            >
              {task.title}
            </Text>
            {task.description ? (
              <Text
                variant="bodyMedium"
                style={[
                  styles.description,
                  task.completed && styles.completedText,
                ]}
              >
                {task.description}
              </Text>
            ) : null}
          </View>
        </View>
        <IconButton
          icon="delete-outline"
          onPress={onDelete}
          size={20}
          iconColor={MD3Colors.error50}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    color: MD3Colors.neutral60,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: MD3Colors.neutral40,
  },
}); 