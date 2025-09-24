import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
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


// Hour grid aligned with 24-hour decimal calculation
// Index 0 = 12 AM (0.0), Index 1 = 1 AM (1.0), ..., Index 12 = 12 PM (12.0), Index 13 = 1 PM (13.0), ..., Index 23 = 11 PM (23.0)
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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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
    
    // Show task on its start date
    if (task.scheduledDate === currentDateStr) {
      // For single-day tasks (same start and end date), always show them
      if (task.scheduledDate === task.endDate) {
        return true;
      }
      // For multi-day tasks, don't show on start date if it starts at midnight
      if (task.startTime === '12:00AM') {
        return false;
      }
      return true;
    }
    
    // Show task on its end date only if:
    // 1. It has an end date different from start date (multi-day task)
    // 2. It doesn't end at midnight (12:00AM) - edge case fix
    if (task.endDate && task.endDate === currentDateStr && task.endDate !== task.scheduledDate) {
      // Don't show task on end date if it ends at midnight
      if (task.endTime === '12:00AM') {
        return false;
      }
      return true;
    }
    
    return false;
  });

  // Parse time string to get hours and minutes as decimals
  const parseTimeToDecimal = (timeStr: string) => {
    if (!timeStr) return 0;
    
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours + minutes / 60;
  };

  // Adjust task times for multi-day tasks based on current date
  const getAdjustedTaskTimes = (task: Task, currentDateStr: string) => {
    if (!task.startTime || !task.endTime) return { startTime: null, endTime: null };
    
    // If task doesn't span multiple days, return original times
    if (task.scheduledDate === task.endDate) {
      return { startTime: task.startTime, endTime: task.endTime };
    }
    
    // For multi-day tasks, adjust times based on which day we're viewing
    if (task.scheduledDate === currentDateStr) {
      // First day: show from start time to 11:59 PM (end of day)
      return { startTime: task.startTime, endTime: '11:59PM' };
    } else if (task.endDate === currentDateStr) {
      // Last day: show from midnight to end time
      return { startTime: '12:00AM', endTime: task.endTime };
    }
    
    // Middle days (if any): show full day (midnight to 11:59 PM)
    return { startTime: '12:00AM', endTime: '11:59PM' };
  };

  // Assign tasks to columns using optimal column-based layout
  const assignTasksToColumns = (tasks: Array<{task: Task, startDecimal: number, endDecimal: number}>) => {
    // Sort tasks by start time
    const sortedTasks = [...tasks].sort((a, b) => a.startDecimal - b.startDecimal);
    
    // Track columns and their end times
    const columns: Array<Array<{task: Task, startDecimal: number, endDecimal: number, index: number}>> = [];
    
    sortedTasks.forEach((taskData, index) => {
      // Find the first column where this task can fit (doesn't overlap with last task in column)
      let assignedColumn = -1;
      
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const column = columns[colIndex];
        const lastTaskInColumn = column[column.length - 1];
        
        // Check if this task can fit in this column (no overlap with last task)
        if (taskData.startDecimal >= lastTaskInColumn.endDecimal) {
          assignedColumn = colIndex;
          break;
        }
      }
      
      // If no existing column can fit this task, create a new column
      if (assignedColumn === -1) {
        assignedColumn = columns.length;
        columns.push([]);
      }
      
      // Add task to the assigned column
      columns[assignedColumn].push({...taskData, index});
    });
    
    return columns;
  };

  // Get all tasks with Apple Calendar-style positioning and overlap handling
  const getAllTasksWithPositioning = () => {
    // Hour rows have minHeight: 60 + paddingVertical: 20 = 80px total height
    const hourHeight = 80;
    const currentDateStr = formatLocalDateString(currentDate);
    const taskContainerWidth = 300; // Available width for tasks (right margin - left margin)
    const taskMargin = 2; // Small margin between overlapping tasks
    
    // First, prepare all tasks with their time data
    const tasksWithTimes = tasksForCurrentDate.map(task => {
      if (!task.startTime || !task.endTime) return null;
      
      // Get adjusted times for multi-day tasks
      const { startTime, endTime } = getAdjustedTaskTimes(task, currentDateStr);
      if (!startTime || !endTime) return null;
      
      const startDecimal = parseTimeToDecimal(startTime);
      const endDecimal = parseTimeToDecimal(endTime);
      
      return {
        task: {
          ...task,
          startTime,
          endTime
        },
        startDecimal,
        endDecimal
      };
    }).filter(Boolean);

    // Assign tasks to columns using optimal layout
    const columns = assignTasksToColumns(tasksWithTimes);

    // Calculate positioning for each column
    const positionedTasks = columns.flatMap((column, columnIndex) => {
      const columnId = `column-${columnIndex}`;
      const isExpanded = expandedGroups.has(columnId);
      const maxVisibleTasks = 3; // Show max 3 tasks per column, then collapse
      
      // Determine how many tasks to show in this column
      const visibleTasks = isExpanded ? column : column.slice(0, maxVisibleTasks);
      const hiddenCount = column.length - visibleTasks.length;
      
      // Calculate column width based on total number of columns
      const totalColumns = columns.length;
      const columnWidth = (taskContainerWidth - (taskMargin * (totalColumns - 1))) / totalColumns;
      
      const tasks = visibleTasks.map((taskData, taskIndex) => {
        const { task, startDecimal, endDecimal } = taskData;
        
        // Calculate position relative to the top of the scroll view
        const topPosition = startDecimal * hourHeight;
        const height = (endDecimal - startDecimal) * hourHeight;
        
        // Calculate horizontal position based on column
        const leftPosition = 80 + (columnIndex * (columnWidth + taskMargin));
        
        return {
          task: taskData.task, // Use original task with original times
          style: {
            position: 'absolute' as const,
            top: topPosition,
            height: height,
            left: leftPosition,
            width: columnWidth,
            zIndex: totalColumns > 1 ? 2 : 1, // Higher z-index for multiple columns
            backgroundColor: totalColumns > 1 ? 
              `rgba(0, 123, 255, ${0.8 - (columnIndex * 0.1)})` : // Different opacity for different columns
              'rgba(0, 123, 255, 0.8)', // Standard color for single column
            borderRadius: 4,
            padding: 4,
            margin: 1,
          }
        };
      });
      
      // Add expand/collapse indicator if there are hidden tasks in this column
      if (hiddenCount > 0) {
        const firstTask = visibleTasks[0];
        const { startDecimal, endDecimal } = firstTask;
        const topPosition = startDecimal * hourHeight;
        const height = (endDecimal - startDecimal) * hourHeight;
        const leftPosition = 80 + (columnIndex * (columnWidth + taskMargin));
        
        tasks.push({
          task: {
            id: `expand-${columnId}`,
            title: `+${hiddenCount} more`,
            description: '',
            completed: false,
            createdAt: '',
            scheduledDate: '',
            endDate: '',
            startTime: '',
            endTime: ''
          },
          style: {
            position: 'absolute' as const,
            top: topPosition,
            height: height,
            left: leftPosition,
            width: Math.min(80, columnWidth),
            zIndex: 3,
            backgroundColor: 'rgba(0, 123, 255, 0.6)',
            borderRadius: 4,
            padding: 4,
            margin: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          isExpandButton: true,
          groupId: columnId
        });
      }
      
      return tasks;
    });

    return positionedTasks;
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

  // Direct dismiss without animation
  const handleDismiss = () => {
    onDismiss();
  };

  // Handle expand/collapse of overlapping task groups
  const handleExpandCollapse = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  return (
    <Portal>
      <View style={styles.overlay}>
        {/* Invisible overlay for tap-to-dismiss */}
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          onPress={handleDismiss}
          activeOpacity={1}
        />
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.headerDate}>{formatHeaderDate()}</Text>
            </View>
            <View style={styles.headerBottom}>
              <TouchableOpacity onPress={handleDismiss} style={styles.backButton}>
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
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={true}
            bounces={true}
            scrollEventThrottle={16}
          >
            <View style={styles.timelineContainer}>
              {/* Hour grid background */}
              {HOURS.map(({ hour, period }, index) => (
                  <View key={index} style={styles.hourRow}>
                    <View style={styles.hourLabel}>
                      <Text style={styles.hourText}>{hour}</Text>
                      <Text style={styles.periodText}>{period}</Text>
                    </View>
                    <View style={styles.tasksContainer} />
                  </View>
                ))}
              
              {/* Task blocks with precise positioning */}
              {getAllTasksWithPositioning().map(({ task, style, isExpandButton, groupId }, index) => {
                // Determine if this is a narrow overlapping task
                const isNarrowTask = style.width && style.width < 100;
                
                // Handle expand/collapse button
                if (isExpandButton && groupId) {
                  return (
                    <TouchableOpacity
                      key={task.id}
                      style={[styles.taskItem, style]}
                      onPress={() => handleExpandCollapse(groupId)}
                    >
                      <Text style={styles.expandButtonText}>
                        {task.title}
                      </Text>
                    </TouchableOpacity>
                  );
                }
                
                return (
                  <TouchableOpacity
                    key={task.id}
                    style={[styles.taskItem, style]}
                    onPress={() => onTaskPress(task)}
                  >
                    <Text 
                      style={[
                        styles.taskTitle, 
                        isNarrowTask && styles.taskTitleNarrow
                      ]} 
                      numberOfLines={isNarrowTask ? 1 : 2}
                    >
                      {task.title}
                    </Text>
                    {!isNarrowTask && (
                      <Text style={styles.taskTime}>
                        {task.startTime} - {task.endTime}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
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
  overlayTouchable: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  modal: {
    backgroundColor: 'white',
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
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
  timelineContainer: {
    position: 'relative',
  },
  hourRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: 60,
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
    position: 'relative',
    minHeight: 60,
  },
  taskItem: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#0056CC',
  },
  taskTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    marginBottom: 2,
  },
  taskTitleNarrow: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 0,
  },
  taskTime: {
    fontSize: 10,
    color: 'white',
    opacity: 0.8,
  },
  expandButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});

export default DayDetailView;