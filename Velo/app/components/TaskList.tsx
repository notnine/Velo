import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Task, toggleTaskCompletion, deleteTask } from '../store/slices/tasksSlice';
import TaskItem from './TaskItem';

export const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const handleToggleComplete = (id: string) => {
    dispatch(toggleTaskCompletion(id));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id));
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggleComplete={handleToggleComplete}
      onDelete={handleDelete}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
});

export default TaskList; 