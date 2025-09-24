/**
 * Calendar screen that will show tasks organized by date. This screen helps users
 * view and manage their scheduled tasks in a calendar format.
 */
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Task, addTask, deleteTask, updateTask } from '../store/taskSlice';
import AddTaskModal from '../../components/AddTaskModal';
import TaskDetailsModal from '../../components/TaskDetailsModal';
import DayDetailView from '../../components/DayDetailView';
import CustomBottomSheet from '../../components/CustomBottomSheet';

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper function to format date in local timezone (avoids UTC conversion issues)
const formatLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface MonthData {
  year: number;
  month: number;
  days: Array<{
    date: number;
    tasks: Task[];
    isCurrentMonth: boolean;
  }>;
}

const getMonthData = (year: number, month: number, tasks: Task[]): MonthData => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const days = [];
  
  // Pre-compute task lookup map for this month to avoid repeated filtering
  const taskMap = new Map<string, Task[]>();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  // Pre-populate task map for all days in this month
  for (let date = 1; date <= daysInMonth; date++) {
    const dateStr = `${monthStr}-${String(date).padStart(2, '0')}`;
    taskMap.set(dateStr, []);
  }
  
  // Single pass through tasks to populate the map
  for (const task of tasks) {
    if (task.scheduledDate && task.scheduledDate.startsWith(monthStr)) {
      const tasksForDate = taskMap.get(task.scheduledDate);
      if (tasksForDate) {
        tasksForDate.push(task);
      }
    }
    // Only add to endDate if it's different from scheduledDate (multi-day tasks)
    if (task.endDate && task.endDate.startsWith(monthStr) && task.endDate !== task.scheduledDate) {
      const tasksForDate = taskMap.get(task.endDate);
      if (tasksForDate) {
        tasksForDate.push(task);
      }
    }
  }
  
  // Sort tasks once for each day that has tasks
  for (const [dateStr, dayTasks] of taskMap) {
    if (dayTasks.length > 0) {
      dayTasks.sort((a, b) => {
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
      });
    }
  }
  
  // Add days from previous month
  for (let i = startingDay - 1; i >= 0; i--) {
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    days.push({
      date: prevMonthLastDay - i,
      tasks: [],
      isCurrentMonth: false
    });
  }
  
  // Add days of current month
  for (let date = 1; date <= daysInMonth; date++) {
    const dateStr = `${monthStr}-${String(date).padStart(2, '0')}`;
    const dayTasks = taskMap.get(dateStr) || [];
    
    days.push({
      date,
      tasks: dayTasks,
      isCurrentMonth: true
    });
  }
  
  // Add days from next month
  const remainingDays = 42 - days.length; // Always show 6 weeks
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      tasks: [],
      isCurrentMonth: false
    });
  }
  
  return { year, month, days };
};

const TaskSnippet = ({ task, onPress }: { task: Task; onPress: () => void }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.taskSnippet,
        { backgroundColor: task.completed ? theme.colors.surfaceVariant : theme.colors.primary }
      ]}
    >
      <Text 
        numberOfLines={1} 
        style={[
          styles.taskSnippetText,
          { color: '#fff' },
          task.completed && styles.completedTaskText
        ]}
      >
        {task.title}
      </Text>
    </TouchableOpacity>
  );
};

export default function CalendarScreen() {
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Memoize tasks to ensure stable reference
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayDetailVisible, setIsDayDetailVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentMonthRef = useRef<View>(null);
  const monthRefs = useRef<(View | null)[]>(Array(25).fill(null));
  const stableDate = useRef(new Date(2025, 0, 1)).current; // Stable date for when no selection
  
  const theme = useTheme();
  const dispatch = useDispatch();

  // Debug calendar renders
  console.log('[Calendar] Calendar render - selectedDate:', selectedDate?.toISOString() || 'null', 'isDayDetailVisible:', isDayDetailVisible);

  // Generate 25 months: 12 months before current month + current month + 12 months after
  const today = new Date();
  const currentMonth = today.getMonth();
  const baseYear = today.getFullYear();

  const monthsData: MonthData[] = useMemo(() => {
    const calendarStartTime = performance.now();
    console.log('[Calendar] 🗓️ CALENDAR CALCULATION START - Time:', calendarStartTime);
    
    const data: MonthData[] = [];
    for (let i = -12; i <= 12; i++) {
      let month = currentMonth + i;
      let year = baseYear;
      
      // Handle month overflow/underflow
      while (month > 11) {
        month -= 12;
        year += 1;
      }
      while (month < 0) {
        month += 12;
        year -= 1;
      }
      
      const monthStartTime = performance.now();
      data.push(getMonthData(year, month, tasks));
      const monthEndTime = performance.now();
      console.log('[Calendar] 📅 MONTH CALCULATION - Month:', i, 'Time:', monthEndTime - monthStartTime, 'ms');
    }
    
    const calendarEndTime = performance.now();
    console.log('[Calendar] 🗓️ CALENDAR CALCULATION END - Total Time:', calendarEndTime - calendarStartTime, 'ms');
    return data;
  }, [currentMonth, baseYear, tasks]);

  const isToday = (date: number, monthData: MonthData, isCurrentMonth: boolean) => {
    const today = new Date();
    return date === today.getDate() && 
           monthData.month === today.getMonth() && 
           monthData.year === today.getFullYear() &&
           isCurrentMonth; // Only highlight if it's actually in the current month
  };

  const handleSubmit = useCallback((title: string, description: string, startDate?: Date, endDate?: Date) => {
    if (selectedTask) {
      dispatch(updateTask({
        id: selectedTask.id,
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
    setIsAddModalVisible(false);
  }, [selectedTask, dispatch]);

  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsEditModalVisible(true);
  }, []);

  const handleEditTask = useCallback(() => {
    if (selectedTask) {
      setIsEditModalVisible(false);
      setIsAddModalVisible(true);
    }
  }, [selectedTask]);

  const handleDeleteTask = useCallback(() => {
    if (selectedTask) {
      dispatch(deleteTask(selectedTask.id));
      setIsEditModalVisible(false);
      setSelectedTask(null);
    }
  }, [selectedTask, dispatch]);

  const handleScroll = useCallback((e: any) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    
    // Each month is roughly: title (40px) + 6 weeks * 80px + margin (24px) = ~544px
    const estimatedMonthHeight = 544;
    const currentMonthIndex = Math.round(scrollY / estimatedMonthHeight);
    
    if (currentMonthIndex >= 0 && currentMonthIndex < monthsData.length) {
      const visibleMonth = monthsData[currentMonthIndex];
      
      if (visibleMonth && visibleMonth.year !== currentYear) {
        setCurrentYear(visibleMonth.year);
      }
    }
  }, [monthsData, currentYear]);

  const handleAddModalPress = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const handleAddModalDismiss = useCallback(() => {
    setIsAddModalVisible(false);
  }, []);

  const handleEditModalDismiss = useCallback(() => {
    setIsEditModalVisible(false);
    setSelectedTask(null);
  }, []);

  const handleDayPress = useCallback((date: Date, monthData: MonthData) => {
    const tapStartTime = performance.now();
    console.log('[Calendar] 🎯 TAP START - handleDayPress called with date:', date.toISOString(), 'Time:', tapStartTime);
    console.log('[Calendar] 🔍 CURRENT STATE - selectedDate:', selectedDate?.toISOString(), 'isDayDetailVisible:', isDayDetailVisible);
    
    const stateUpdateStartTime = performance.now();
    
    // Always set the date and visibility - React will handle remounting
    setSelectedDate(date);
    setIsDayDetailVisible(true);
    
    const stateUpdateEndTime = performance.now();
    
    console.log('[Calendar] ⚡ STATE UPDATE - Time:', stateUpdateEndTime - stateUpdateStartTime, 'ms');
    console.log('[Calendar] State updates queued (React 18 auto-batching)');
    
    // Store timing for DayDetailView to use
    (global as any).tapStartTime = tapStartTime;
  }, []);

  const handleDateChange = useCallback((newDate: Date) => {
    setSelectedDate(newDate);
  }, []);

  // Memoize callback functions to prevent remounting - these are stable and won't change
  const handleDayDetailDismiss = useCallback(() => {
    console.log('[Calendar] DayDetailView onDismiss called');
    
    // React 18 automatically batches these state updates
    setIsDayDetailVisible(false);
    setSelectedDate(null);
  }, []);

  const handleDayDetailTaskPress = useCallback((task: Task) => {
    console.log('[Calendar] DayDetailView onTaskPress called');
    
    // React 18 automatically batches these state updates
    setIsDayDetailVisible(false);
    setSelectedDate(null);
    setSelectedTask(task);
    setIsEditModalVisible(true);
  }, []);

  const getTasksForDate = useMemo(() => {
    return (date: Date) => {
      if (!date) return [];
      const dateStr = formatLocalDateString(date);
      return tasks.filter(task => {
        // Show task if it starts on this date OR ends on this date (overnight task)
        return task.scheduledDate === dateStr || (task.endDate && task.endDate === dateStr);
      });
    };
  }, [tasks]);




  // Scroll to current month title directly
  useEffect(() => {
    setTimeout(() => {
      if (currentMonthRef.current) {
        currentMonthRef.current.measureInWindow((x, y, width, height) => {
          scrollViewRef.current?.scrollTo({
            y: y - 110, // Offset for header space
            animated: false
          });
        });
      }
    }, 100);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.yearButton}>
          <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>
            {currentYear}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <IconButton
            icon="plus"
            onPress={handleAddModalPress}
          />
        </View>
      </View>

      <View style={styles.weekDayHeader}>
        {DAYS_OF_WEEK.map((day, index) => (
          <Text key={index} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {monthsData.map((monthData, monthIndex) => (
          <View 
            key={monthIndex} 
            style={styles.month}
            ref={monthIndex === 12 ? currentMonthRef : undefined}
          >
            <Text style={styles.monthTitle}>
              {MONTHS[monthData.month]}
            </Text>
            <View style={styles.calendar}>
              {Array.from({ length: 6 }).map((_, weekIndex) => (
                <View key={weekIndex} style={styles.week}>
                  {monthData.days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.dayCell,
                        isToday(day.date, monthData, day.isCurrentMonth) && styles.todayCell
                      ]}
                      onPress={() => {
                        // Calculate correct date for grayed-out dates from previous/next months
                        let year = monthData.year;
                        let month = monthData.month;
                        
                        if (!day.isCurrentMonth) {
                          // For grayed-out dates, we need to determine if they're from previous or next month
                          if (day.date > 15) {
                            // Large day numbers (like 31, 30, 29) are from previous month
                            month = month - 1;
                            if (month < 0) {
                              month = 11;
                              year = year - 1;
                            }
                          } else {
                            // Small day numbers (like 1, 2, 3) are from next month
                            month = month + 1;
                            if (month > 11) {
                              month = 0;
                              year = year + 1;
                            }
                          }
                        }
                        
                        const date = new Date(year, month, day.date);
                        console.log('[Calendar] 🗓️ DATE CALCULATION - day.date:', day.date, 'isCurrentMonth:', day.isCurrentMonth, 'calculated date:', date.toISOString());
                        handleDayPress(date, monthData);
                      }}
                    >
                      <Text style={[
                        styles.dayNumber,
                        !day.isCurrentMonth && styles.inactiveDayText,
                        isToday(day.date, monthData, day.isCurrentMonth) && styles.todayText
                      ]}>
                        {day.date}
                      </Text>
                      <View style={styles.tasksList}>
                        {day.tasks.slice(0, 3).map((task, taskIndex) => (
                          <TaskSnippet 
                            key={taskIndex} 
                            task={task} 
                            onPress={() => handleTaskPress(task)}
                          />
                        ))}
                        {day.tasks.length > 3 && (
                          <Text style={styles.moreTasksText}>+{day.tasks.length - 3}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Only render AddTaskModal when isAddModalVisible is true */}
      {isAddModalVisible && (
        <AddTaskModal
          onDismiss={handleAddModalDismiss}
          onSubmit={handleSubmit}
          editTask={selectedTask || undefined}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          visible={isEditModalVisible}
          onDismiss={handleEditModalDismiss}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          task={selectedTask}
          month={MONTHS[
            selectedTask && selectedTask.scheduledDate
              ? Number(selectedTask.scheduledDate.split('-')[1]) - 1
              : 0
          ]}
        />
      )}

      {/* DayDetailView - conditionally rendered */}
      {isDayDetailVisible && selectedDate && (
        <DayDetailView
          onDismiss={handleDayDetailDismiss}
          onTaskPress={handleDayDetailTaskPress}
          date={selectedDate}
          tasks={tasks}
          month={MONTHS[selectedDate.getMonth()]}
          onDateChange={handleDateChange}
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
  yearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  title: {
    flex: 1,
  },
  weekDayHeader: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#939393',
  },
  month: {
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 12,
  },
  calendar: {
    marginTop: 8,
  },
  week: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  dayCell: {
    flex: 1,
    minHeight: 80,
    padding: 4,
  },
  todayCell: {
    backgroundColor: '#f8f8f8',
  },
  dayNumber: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  todayText: {
    color: '#6750A4',
    fontWeight: '600',
  },
  inactiveDayText: {
    color: '#939393',
  },
  tasksList: {
    flex: 1,
    gap: 2,
  },
  taskSnippet: {
    borderRadius: 4,
    padding: 4,
    marginHorizontal: 2,
  },
  taskSnippetText: {
    fontSize: 10,
    fontWeight: '500',
  },
  completedTaskText: {
    opacity: 0.7,
  },
  moreTasksText: {
    fontSize: 10,
    color: '#939393',
    textAlign: 'right',
    marginTop: 2,
  },
}); 