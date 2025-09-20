import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
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
  console.log('[DayDetailView] Component render - visible:', visible, 'date:', date.toISOString());
  console.log('[DayDetailView] Component instance created/remounted');
  
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasAnimated = useRef(false);
  const [gestureEnabled, setGestureEnabled] = useState(false);
  const animationId = useRef(Math.random().toString(36).substr(2, 9)).current;
  const currentAnimation = useRef<any>(null);
  
  // Horizontal sliding animations
  const translateX = useRef(new Animated.Value(0)).current;
  const [currentDate, setCurrentDate] = useState(date);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update current date when prop changes
  useEffect(() => {
    setCurrentDate(date);
  }, [date]);

  // Simple animation on visibility change
  useEffect(() => {
    console.log('[DayDetailView] useEffect triggered - visible:', visible, 'hasAnimated:', hasAnimated.current);
    if (visible && !hasAnimated.current) {
      console.log('[DayDetailView] Starting slide up animation - ID:', animationId);
      hasAnimated.current = true;
      
      // Cancel any existing animation
      if (currentAnimation.current) {
        currentAnimation.current.stop();
      }
      
      currentAnimation.current = Animated.parallel([
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
      ]);
      
      currentAnimation.current.start(() => {
        console.log('[DayDetailView] Slide up animation completed - ID:', animationId);
        // Enable gestures after animation completes
        setGestureEnabled(true);
        currentAnimation.current = null;
      });
    } else if (!visible) {
      console.log('[DayDetailView] Resetting animation values');
      hasAnimated.current = false;
      setGestureEnabled(false);
      // Cancel any running animation
      if (currentAnimation.current) {
        currentAnimation.current.stop();
        currentAnimation.current = null;
      }
      // Reset when not visible
      slideAnim.setValue(SCREEN_HEIGHT);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  // Cleanup effect to cancel animations on unmount
  useEffect(() => {
    return () => {
      console.log('[DayDetailView] Component unmounting, canceling animations - ID:', animationId);
      if (currentAnimation.current) {
        currentAnimation.current.stop();
        currentAnimation.current = null;
      }
    };
  }, []);

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
      const { translationX, velocityX } = event.nativeEvent;
      
      // Determine if swipe is significant enough
      const threshold = 50;
      const velocityThreshold = 500;
      
      if (translationX > threshold || velocityX > velocityThreshold) {
        // Swipe right - go to previous day
        navigateToPreviousDay();
      } else if (translationX < -threshold || velocityX < -velocityThreshold) {
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
  // Custom dismiss function that handles slide down animation
  const handleDismiss = () => {
    console.log('[DayDetailView] handleDismiss called - ID:', animationId, 'Stack trace:', new Error().stack);
    
    // Cancel any existing animation
    if (currentAnimation.current) {
      currentAnimation.current.stop();
    }
    
    currentAnimation.current = Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);
    
    currentAnimation.current.start(() => {
      console.log('[DayDetailView] Slide down animation completed, calling onDismiss - ID:', animationId);
      currentAnimation.current = null;
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

  console.log('[DayDetailView] Render check - visible:', visible);
  if (!visible) {
    console.log('[DayDetailView] Not rendering - visible is false');
    return null;
  }
  console.log('[DayDetailView] Rendering modal');

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
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            activeOffsetX={[-50, 50]}
            failOffsetY={[-20, 20]}
            shouldCancelWhenOutside={false}
            enabled={gestureEnabled}
          >
            <Animated.View 
              style={[
                styles.container,
                {
                  transform: [{ translateX }]
                }
              ]}
            >
              <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={styles.headerDate}>{formatHeaderDate()}</Text>
              </View>
              <View style={styles.headerBottom}>
                  <TouchableOpacity onPress={() => {
                    console.log('[DayDetailView] Back button pressed');
                    handleDismiss();
                  }} style={styles.backButton}>
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