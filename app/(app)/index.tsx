/**
 * Main tasks screen that displays the list of tasks. Allows users to view, add,
 * toggle, and delete tasks using a floating action button and task list.
 */
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Task, addTask, toggleTask, deleteTask, updateTask } from '../store/taskSlice';
import TaskItem from '../../components/TaskItem';
import AddTaskModal from '../../components/AddTaskModal';

const isSameDay = (date1: string, date2: string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const formatDate = (date: Date): string => {
  const today = new Date();
  if (isSameDay(date.toISOString(), today.toISOString())) {
    return 'Today';
  }
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

export default function TasksScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const dispatch = useDispatch();
  const theme = useTheme();

  // Filter tasks for today and sort by start time
  const todaysTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks
      .filter(task => {
        if (!task.scheduledDate) return false;
        return task.scheduledDate.startsWith(today);
      })
      .sort((a, b) => {
        // Sort by start time if available, otherwise keep original order
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [tasks]);

  const handleAddTask = (
    title: string, 
    description: string, 
    startDate: Date,
    endDate: Date
  ) => {
    if (editingTask) {
      dispatch(updateTask({
        id: editingTask.id,
        title,
        description,
        startDate,
        endDate,
      }));
    } else {
      dispatch(addTask({ 
        title, 
        description,
        startDate,
        endDate,
      }));
    }
    setIsModalVisible(false);
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleModalDismiss = () => {
    setIsModalVisible(false);
    setEditingTask(undefined);
  };

  const handleToggleTask = (id: string) => {
    dispatch(toggleTask(id));
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="headlineMedium">Today's Tasks</Text>
          <Text variant="bodyMedium" style={styles.taskCount}>
            {todaysTasks.length} task{todaysTasks.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <IconButton
            icon="plus"
            onPress={() => {
              setEditingTask(undefined);
              setIsModalVisible(true);
            }}
          />
        </View>
      </View>
      {/* Remove conversation state indicator, mic button, and ended message */}

      <FlatList
        data={todaysTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => handleToggleTask(item.id)}
            onDelete={() => handleDeleteTask(item.id)}
            onEdit={() => handleEditTask(item)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge">No tasks for today</Text>
            <Text variant="bodyMedium">Add a task by tapping the + button</Text>
          </View>
        )}
      />

      <AddTaskModal
        visible={isModalVisible}
        onDismiss={handleModalDismiss}
        onSubmit={handleAddTask}
        editTask={editingTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    paddingTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  taskCount: {
    color: '#666',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
}); 