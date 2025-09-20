import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, Portal, IconButton } from 'react-native-paper';
import { Task } from '../store/taskSlice';

interface DayDetailViewProps {
  visible: boolean;
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

export default function DayDetailView({
  visible,
  onDismiss,
  onTaskPress,
  date,
  tasks,
  month,
  onDateChange,
}: DayDetailViewProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasAnimated = useRef(false);
  
  // Horizontal sliding animations
  const translateX = useRef(new Animated.Value(0)).current;
  const [currentDate, setCurrentDate] = useState(date);
  const [isAnimating, setIsAnimating] = useState(false);
  

  // Update current date when prop changes
  useEffect(() => {
    setCurrentDate(date);
  }, [date]);

  useEffect(() => {
    if (visible && !hasAnimated.current) {
      hasAnimated.current = true;
      // Start animation immediately with minimal delay
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!visible) {
      // Reset to initial state when not visible
      hasAnimated.current = false;
      slideAnim.setValue(SCREEN_HEIGHT);
      fadeAnim.setValue(0);
    }
  }, [visible, slideAnim, fadeAnim]);

  // Navigation functions
  const navigateToPreviousDay = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    
    // Update date immediately for better UX
    setCurrentDate(newDate);
    onDateChange?.(newDate);
    
    // Animate slide to right
    Animated.timing(translateX, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      translateX.setValue(-300);
      
      // Animate slide in from left
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const navigateToNextDay = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    
    // Update date immediately for better UX
    setCurrentDate(newDate);
    onDateChange?.(newDate);
    
    // Animate slide to left
    Animated.timing(translateX, {
      toValue: -300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      translateX.setValue(300);
      
      // Animate slide in from right
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    });
  };

  // Gesture handler
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY, velocityX, velocityY } = event.nativeEvent;
      
      // Only handle horizontal swipes, ignore vertical ones
      const horizontalThreshold = 50;
      const verticalThreshold = 100;
      const velocityThreshold = 500;
      
      // If it's primarily a vertical gesture, don't handle it (let modal handle it)
      if (Math.abs(translationY) > Math.abs(translationX) && Math.abs(translationY) > verticalThreshold) {
        // Reset horizontal position and let vertical gesture pass through
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        return;
      }
      
      // Handle horizontal gestures
      if (translationX > horizontalThreshold || velocityX > velocityThreshold) {
        // Swipe right - go to previous day
        navigateToPreviousDay();
      } else if (translationX < -horizontalThreshold || velocityX < -velocityThreshold) {
        // Swipe left - go to next day
        navigateToNextDay();
      } else {
        // Snap back to center
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  // Custom dismiss function that handles animation
  const handleDismiss = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT * 0.9,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const formatHeaderDate = () => {
    const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    
    return `${weekday} — ${month} ${day}, ${year}`;
  };

  // Memoize tasks for current date to avoid filtering on every render
  const tasksForCurrentDate = useMemo(() => {
    const currentDateStr = currentDate.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.scheduledDate) return false;
      return task.scheduledDate === currentDateStr || (task.endDate && task.endDate === currentDateStr);
    });
  }, [tasks, currentDate]);

  const getTasksForHour = (hour: number) => {
    return tasksForCurrentDate.filter(task => {
      if (!task.startTime) return false;
      const taskHour = parseInt(task.startTime.match(/(\d+):/)?.[1] || '0');
      const taskPeriod = task.startTime.includes('PM');
      const normalizedTaskHour = taskPeriod && taskHour !== 12 ? taskHour + 12 : taskHour;
      return normalizedTaskHour === hour;
    });
  };

  if (!visible) return null;

  return (
    <Portal>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.container}>
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
                    style={styles.backIcon}
                  />
                  <Text style={styles.monthText}>{month}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
              activeOffsetX={[-10, 10]}
              failOffsetY={[-50, 50]}
              shouldCancelWhenOutside={false}
            >
              <Animated.View 
                style={[
                  styles.scrollContainer,
                  {
                    transform: [{ translateX }]
                  }
                ]}
              >
                <ScrollView 
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                >
              {HOURS.map((time, index) => {
                const tasksForThisHour = getTasksForHour(index);
                return (
                  <View key={index} style={styles.hourRow}>
                    <View style={styles.hourLabelContainer}>
                      <Text style={styles.hourLabel}>
                        {time.hour}<Text style={styles.periodText}> {time.period}</Text>
                      </Text>
                    </View>
                    <View style={styles.hourContent}>
                      <View style={styles.hourLine} />
                      {tasksForThisHour.map((task) => (
                        <TouchableOpacity
                          key={task.id}
                          style={[
                            styles.taskItem,
                            { backgroundColor: task.completed ? '#666' : '#6750A4' }
                          ]}
                          onPress={() => onTaskPress(task)}
                        >
                          <Text style={styles.taskTitle} numberOfLines={1}>
                            {task.title}
                          </Text>
                          <Text style={styles.taskTime}>
                            {task.startTime} - {task.endTime}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
                  <View style={styles.bottomPadding} />
                </ScrollView>
              </Animated.View>
            </PanGestureHandler>
          </View>
        </Animated.View>
      </Animated.View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    height: SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: 'white',
  },
  headerTop: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    margin: 0,
    marginLeft: -8,
  },
  monthText: {
    fontSize: 17,
    color: '#FF3B30',
    marginLeft: -8,
  },
  headerDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  headerRight: {
    width: 80,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  hourRow: {
    flexDirection: 'row',
    minHeight: 44,
  },
  hourLabelContainer: {
    width: 65,
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  hourLabel: {
    fontSize: 13,
    color: '#8E8E93',
    paddingRight: 12,
  },
  periodText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  hourContent: {
    flex: 1,
    minHeight: 44,
    paddingLeft: 12,
    paddingRight: 16,
    position: 'relative',
  },
  hourLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 15,
    height: 0.5,
    backgroundColor: '#E5E5EA',
  },
  taskItem: {
    marginVertical: 2,
    padding: 8,
    borderRadius: 6,
    minHeight: 44,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  taskTime: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.8,
    marginTop: 2,
  },
  bottomPadding: {
    height: 44,
  },
}); 