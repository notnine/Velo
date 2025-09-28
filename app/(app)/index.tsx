/**
 * Main tasks screen that displays the list of tasks. Allows users to view, add,
 * toggle, and delete tasks using a floating action button and task list.
 */
import React, { useState, useMemo } from 'react';
import 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Task, addTask, toggleTask, deleteTask, updateTask, reorderTasks } from '../store/taskSlice';
import TaskItem from '../../components/TaskItem';
import AddTaskModal from '../../components/AddTaskModal';

// Helper function to format date in local timezone (avoids UTC conversion issues)
const formatLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isSameDay = (date1: string, date2: string) => {
  return date1 === date2;
};

const formatDate = (date: Date): string => {
  const today = new Date();
  if (isSameDay(formatLocalDateString(date), formatLocalDateString(today))) {
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

  // Filter tasks for timeless todo list (no scheduled times)
  const timelessTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Show only tasks without scheduled dates (timeless tasks)
        return !task.scheduledDate;
      })
      .sort((a, b) => {
        // Sort by order field (lower number = higher priority)
        return a.order - b.order;
      });
  }, [tasks]);

  const handleAddTask = (
    title: string, 
    description: string, 
    startDate?: Date,
    endDate?: Date
  ) => {
    if (editingTask) {
      dispatch(updateTask({
        id: editingTask.id,
        title,
        description,
        startDate: startDate || new Date(),
        endDate: endDate || new Date(),
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
    setEditingTask(undefined);
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
        <View style={styles.headerLeft}>
          <Text variant="headlineMedium">Todo List</Text>
          <Text variant="bodyMedium" style={styles.taskCount}>
            {timelessTasks.length} task{timelessTasks.length !== 1 ? 's' : ''}
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

      <DraggableFlatList
        activationDistance={0}
        data={timelessTasks}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data, from, to }) => {
          // Recompute order values preserving relative order
          const updates = data.map((t, idx) => ({ taskId: t.id, newOrder: idx + 1 }));
          dispatch(reorderTasks(updates));
        }}
        renderItem={({ item, drag, isActive }: RenderItemParams<Task>) => (
          <TaskItem
            task={item}
            onToggle={() => handleToggleTask(item.id)}
            onDelete={() => handleDeleteTask(item.id)}
            onEdit={() => handleEditTask(item)}
            onLongPress={drag}
            isActive={isActive}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge">No tasks yet</Text>
            <Text variant="bodyMedium">Add a timeless task by tapping the + button</Text>
          </View>
        )}
      />

      {/* Only render AddTaskModal when isModalVisible is true */}
      {isModalVisible && (
        <AddTaskModal
          onDismiss={handleModalDismiss}
          onSubmit={handleAddTask}
          editTask={editingTask}
        />
      )}
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