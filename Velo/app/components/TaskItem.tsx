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
    <Card style={styles.card}>
      <TouchableOpacity onPress={onEdit}>
        <Card.Content style={styles.content}>
          <View style={styles.taskInfo}>
            <IconButton
              icon={task.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
              onPress={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              size={24}
              iconColor={task.completed ? MD3Colors.primary40 : MD3Colors.neutral40}
            />
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text
                  variant="titleMedium"
                  style={[
                    styles.title,
                    task.completed && styles.completedText,
                  ]}
                >
                  {task.title}
                </Text>
                {task.startTime && task.endTime && (
                  <View style={styles.timeContainer}>
                    <IconButton
                      icon="clock-outline"
                      size={16}
                      style={styles.clockIcon}
                    />
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.timeText,
                        task.completed && styles.completedText,
                      ]}
                    >
                      {task.startTime} - {task.endTime}
                    </Text>
                  </View>
                )}
              </View>
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
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            size={20}
            iconColor={MD3Colors.error50}
          />
        </Card.Content>
      </TouchableOpacity>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    margin: 0,
    padding: 0,
  },
  timeText: {
    color: MD3Colors.primary40,
  },
  description: {
    color: MD3Colors.neutral60,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: MD3Colors.neutral40,
  },
}); 