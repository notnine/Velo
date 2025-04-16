/**
 * Main tasks screen that displays the list of tasks. Allows users to view, add,
 * toggle, and delete tasks using a floating action button and task list.
 */
import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addTask, toggleTask, deleteTask } from '../store/taskSlice';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';

export default function TasksScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleAddTask = (title: string, description: string) => {
    dispatch(addTask({ title, description }));
    setIsModalVisible(false);
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
        <Text variant="headlineMedium">My Tasks</Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => handleToggleTask(item.id)}
            onDelete={() => handleDeleteTask(item.id)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge">No tasks yet</Text>
            <Text variant="bodyMedium">Add your first task by tapping the + button</Text>
          </View>
        )}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setIsModalVisible(true)}
      />

      <AddTaskModal
        visible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
        onSubmit={handleAddTask}
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
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 