import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Task } from '../../store/taskSlice';
import { Calendar } from 'react-native-calendars';

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  return (
    <View style={styles.container}>
      <Calendar
        // Theme customization
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
        }}
      />
      <View style={styles.taskList}>
        <Text variant="titleMedium" style={styles.title}>Today's Tasks</Text>
        {tasks.map(task => (
          <View key={task.id} style={styles.taskItem}>
            <Text variant="bodyLarge">{task.title}</Text>
            {task.description && (
              <Text variant="bodyMedium" style={styles.description}>
                {task.description}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  taskList: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  taskItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  description: {
    color: '#666',
    marginTop: 4,
  },
}); 