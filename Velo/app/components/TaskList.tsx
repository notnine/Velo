import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Task, toggleTask, deleteTask } from '../store/taskSlice';
import TaskItem from './TaskItem';
import { Text } from 'react-native-paper';

export default function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const dispatch = useDispatch();

  const handleToggle = (id: string) => {
    dispatch(toggleTask(id));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id));
  };

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge">No tasks yet</Text>
        <Text variant="bodyMedium">Add your first task by tapping the + button</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => handleToggle(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    paddingVertical: 8,
  },
}); 