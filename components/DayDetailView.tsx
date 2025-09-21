import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Portal, IconButton } from 'react-native-paper';
import { Task } from '../store/taskSlice';

interface DayDetailViewProps {
  onDismiss: () => void;
  onTaskPress: (task: Task) => void;
  date: Date;
  tasks: Task[];
  month: string;
  onDateChange?: (newDate: Date) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
  const period = i >= 12 ? 'PM' : 'AM';
  return { hour, period };
});

function DayDetailView({
  onDismiss,
  onTaskPress,
  date,
  tasks,
  month,
  onDateChange,
}: DayDetailViewProps) {
  const [currentDate, setCurrentDate] = useState(date);

  // Update current date when date prop changes
  React.useEffect(() => {
    setCurrentDate(date);
  }, [date]);

  // Format date for task filtering
  const formatLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter tasks for current date
  const tasksForCurrentDate = tasks.filter(task => {
    if (!task.scheduledDate) return false;
    const currentDateStr = formatLocalDateString(currentDate);
    return task.scheduledDate === currentDateStr || (task.endDate && task.endDate === currentDateStr);
  });

  // Get tasks for specific hour
  const getTasksForHour = (hour: number) => {
    return tasksForCurrentDate.filter(task => {
      if (!task.startTime) return false;
      const taskHour = parseInt(task.startTime.match(/(\d+):/)?.[1] || '0');
      const taskPeriod = task.startTime.includes('PM') ? 'PM' : 'AM';
      const normalizedTaskHour = taskPeriod && taskHour !== 12 ? taskHour + 12 : taskHour;
      return normalizedTaskHour === hour;
    });
  };

  // Format header date
  const formatHeaderDate = () => {
    const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const day = currentDate.getDate();
    return `${weekday}, ${month} ${day}`;
  };

  // Navigation functions
  const navigateToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const navigateToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <Portal>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.headerDate}>{formatHeaderDate()}</Text>
            </View>
            <View style={styles.headerBottom}>
              <TouchableOpacity onPress={onDismiss} style={styles.backButton}>
                <IconButton
                  icon="chevron-left"
                  size={24}
                  iconColor="#FF3B30"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToPreviousDay} style={styles.navButton}>
                <IconButton
                  icon="chevron-left"
                  size={24}
                  iconColor="#666"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToNextDay} style={styles.navButton}>
                <IconButton
                  icon="chevron-right"
                  size={24}
                  iconColor="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView style={styles.content}>
            {HOURS.map(({ hour, period }, index) => {
              const hourTasks = getTasksForHour(index);
              return (
                <View key={index} style={styles.hourRow}>
                  <View style={styles.hourLabel}>
                    <Text style={styles.hourText}>{hour}</Text>
                    <Text style={styles.periodText}>{period}</Text>
                  </View>
                  <View style={styles.tasksContainer}>
                    {hourTasks.map((task, taskIndex) => (
                      <TouchableOpacity
                        key={taskIndex}
                        style={styles.taskItem}
                        onPress={() => onTaskPress(task)}
                      >
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        {task.startTime && (
                          <Text style={styles.taskTime}>{task.startTime}</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    height: SCREEN_HEIGHT * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTop: {
    alignItems: 'center',
    marginBottom: 10,
  },
  headerDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: -10,
  },
  navButton: {
    marginHorizontal: 10,
  },
  content: {
    flex: 1,
  },
  hourRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  hourLabel: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  periodText: {
    fontSize: 12,
    color: '#666',
  },
  tasksContainer: {
    flex: 1,
    marginLeft: 20,
  },
  taskItem: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default DayDetailView;