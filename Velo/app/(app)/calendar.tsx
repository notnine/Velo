/**
 * Calendar screen that will show tasks organized by date. This screen helps users
 * view and manage their scheduled tasks in a calendar format.
 */
import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Task, addTask } from '../store/taskSlice';
import AddTaskModal from '../components/AddTaskModal';

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const dayTasks = tasks.filter(task => task.scheduledDate === dateStr);
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

const TaskSnippet = ({ task }: { task: Task }) => {
  const theme = useTheme();
  return (
    <View style={[
      styles.taskSnippet,
      { backgroundColor: task.completed ? theme.colors.surfaceVariant : theme.colors.primary }
    ]}>
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
    </View>
  );
};

export default function CalendarScreen() {
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  
  // Generate 12 months of data centered on the current month
  const today = new Date();
  const startMonth = today.getMonth() - 6;
  const startYear = today.getFullYear();
  
  const monthsData: MonthData[] = [];
  for (let i = 0; i < 12; i++) {
    let month = startMonth + i;
    let year = startYear;
    if (month < 0) {
      month += 12;
      year -= 1;
    } else if (month > 11) {
      month -= 12;
      year += 1;
    }
    monthsData.push(getMonthData(year, month, tasks));
  }

  const isToday = (date: number, monthData: MonthData) => {
    const today = new Date();
    return date === today.getDate() && 
           monthData.month === today.getMonth() && 
           monthData.year === today.getFullYear();
  };

  const handleSubmit = (title: string, description: string, startDate: Date, endDate: Date) => {
    dispatch(addTask({
      title,
      description,
      startDate,
      endDate,
    }));
    setIsAddModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.yearButton}>
          <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>
            {currentYear}
          </Text>
        </TouchableOpacity>
        <IconButton 
          icon="plus" 
          onPress={() => setIsAddModalVisible(true)}
        />
      </View>

      <View style={styles.weekDayHeader}>
        {DAYS_OF_WEEK.map((day, index) => (
          <Text key={index} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const offset = e.nativeEvent.contentOffset.y;
          const monthHeight = Dimensions.get('window').width + 50;
          const currentMonthIndex = Math.floor(offset / monthHeight);
          if (currentMonthIndex >= 0 && currentMonthIndex < monthsData.length) {
            setCurrentYear(monthsData[currentMonthIndex].year);
          }
        }}
        scrollEventThrottle={16}
      >
        {monthsData.map((monthData, monthIndex) => (
          <View key={monthIndex} style={styles.month}>
            <Text style={styles.monthTitle}>
              {MONTHS[monthData.month]}
            </Text>
            <View style={styles.calendar}>
              {Array.from({ length: 6 }).map((_, weekIndex) => (
                <View key={weekIndex} style={styles.week}>
                  {monthData.days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                    <View
                      key={dayIndex}
                      style={[
                        styles.dayCell,
                        isToday(day.date, monthData) && styles.todayCell
                      ]}
                    >
                      <Text style={[
                        styles.dayNumber,
                        !day.isCurrentMonth && styles.inactiveDayText,
                        isToday(day.date, monthData) && styles.todayText
                      ]}>
                        {day.date}
                      </Text>
                      <View style={styles.tasksList}>
                        {day.tasks.slice(0, 3).map((task, taskIndex) => (
                          <TaskSnippet key={taskIndex} task={task} />
                        ))}
                        {day.tasks.length > 3 && (
                          <Text style={styles.moreTasksText}>+{day.tasks.length - 3}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <AddTaskModal
        visible={isAddModalVisible}
        onDismiss={() => setIsAddModalVisible(false)}
        onSubmit={handleSubmit}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  yearButton: {
    flexDirection: 'row',
    alignItems: 'center',
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