import React, { useEffect, useLayoutEffect, useRef, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Text, Portal, IconButton } from 'react-native-paper';
import { Task } from '../store/taskSlice';

interface DayDetailViewProps {
  visible: boolean;
  onDismiss: () => void;
  onTaskPress: (task: Task) => void;
  date: Date; // Selected date
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

const DayDetailView = React.memo(function DayDetailView({
  visible,
  onDismiss,
  onTaskPress,
  date,
  tasks,
  month,
  onDateChange,
}: DayDetailViewProps) {
  const componentRenderStartTime = performance.now();
  console.log('[DayDetailView] 🎬 COMPONENT RENDER START - visible:', visible, 'date:', date.toISOString(), 'Time:', componentRenderStartTime);
  
  // Check if this is the initial render at startup
  if (componentRenderStartTime < 10000) { // Within first 10 seconds of app start
    console.log('[DayDetailView] 🚀 INITIAL STARTUP RENDER - Component created at app startup');
  } else {
    console.log('[DayDetailView] 🔄 RUNTIME RENDER - Component re-rendered during app usage');
  }
  
  // Calculate latency from tap to component render
  if ((global as any).tapStartTime) {
    const renderLatency = componentRenderStartTime - (global as any).tapStartTime;
    console.log('[DayDetailView] ⏱️ RENDER LATENCY - Time from tap to render:', renderLatency, 'ms');
  }
  
  const refsInitTime = performance.now();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasAnimated = useRef(false);
  const [gestureEnabled, setGestureEnabled] = useState(false);
  const animationId = useRef(Math.random().toString(36).substr(2, 9)).current;
  const currentAnimation = useRef<any>(null);
  const refsInitEndTime = performance.now();
  console.log('[DayDetailView] 🔧 REFS INIT - Time:', refsInitEndTime - refsInitTime, 'ms');
  
  // Horizontal sliding animations
  const stateInitTime = performance.now();
  const translateX = useRef(new Animated.Value(0)).current;
  const [currentDate, setCurrentDate] = useState(date);
  const [isAnimating, setIsAnimating] = useState(false);
  const stateInitEndTime = performance.now();
  console.log('[DayDetailView] 🔄 STATE INIT - Time:', stateInitEndTime - stateInitTime, 'ms');

  // Update current date when date prop changes
  useEffect(() => {
    console.log('[DayDetailView] 📅 DATE PROP CHANGED - from:', currentDate.toISOString(), 'to:', date.toISOString());
    setCurrentDate(date);
  }, [date]);

  // Pre-create animation configurations for instant execution
  const slideUpAnimation = useMemo(() => Animated.parallel([
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
  ]), [slideAnim, fadeAnim]);

  const slideDownAnimation = useMemo(() => Animated.parallel([
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
  ]), [slideAnim, fadeAnim]);

  // Optimized animation on visibility change - useLayoutEffect for immediate execution
  useLayoutEffect(() => {
    const effectStartTime = performance.now();
    console.log('[DayDetailView] 🎭 USELAYOUTEFFECT TRIGGERED - visible:', visible, 'hasAnimated:', hasAnimated.current, 'Time:', effectStartTime);
    
    if (visible && !hasAnimated.current) {
      const animationStartTime = performance.now();
      console.log('[DayDetailView] 🚀 ANIMATION START - Starting slide up animation - ID:', animationId, 'Time:', animationStartTime);
      
      // Calculate total latency from tap to animation start
      if ((global as any).tapStartTime) {
        const totalLatency = animationStartTime - (global as any).tapStartTime;
        console.log('[DayDetailView] ⏱️ TOTAL LATENCY - Time from tap to animation start:', totalLatency, 'ms');
      }
      
      hasAnimated.current = true;
      
      // Cancel any existing animation
      if (currentAnimation.current) {
        currentAnimation.current.stop();
      }
      
      const animationCreateTime = performance.now();
      // Use pre-created animation for instant execution
      currentAnimation.current = slideUpAnimation;
      
      const animationStartCallTime = performance.now();
      console.log('[DayDetailView] ⚡ ANIMATION CREATE TIME - Time to create animation:', animationStartCallTime - animationCreateTime, 'ms');
      
      currentAnimation.current.start(() => {
        const animationCompleteTime = performance.now();
        console.log('[DayDetailView] ✅ ANIMATION COMPLETE - Slide up animation completed - ID:', animationId, 'Time:', animationCompleteTime);
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
  }, [visible, slideUpAnimation]);

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

  // Navigation functions - memoized to prevent recreation
  const navigateToPreviousDay = useCallback(() => {
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
  }, [isAnimating, currentDate, onDateChange, translateX]);

  const navigateToNextDay = useCallback(() => {
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
  }, [isAnimating, currentDate, onDateChange, translateX]);

  // Gesture handler - memoized to prevent recreation
  const onGestureEvent = useMemo(() => 
    Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    ), [translateX]
  );

  const onHandlerStateChange = useCallback((event: any) => {
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
  }, [navigateToPreviousDay, navigateToNextDay, translateX]);

  // Custom dismiss function that handles slide down animation - memoized
  const handleDismiss = useCallback(() => {
    console.log('[DayDetailView] handleDismiss called - ID:', animationId, 'Stack trace:', new Error().stack);
    
    // Cancel any existing animation
    if (currentAnimation.current) {
      currentAnimation.current.stop();
    }
    
    // Use pre-created slide down animation for instant execution
    currentAnimation.current = slideDownAnimation;
    
    currentAnimation.current.start(() => {
      console.log('[DayDetailView] Slide down animation completed, calling onDismiss - ID:', animationId);
      currentAnimation.current = null;
      onDismiss();
    });
  }, [animationId, slideDownAnimation, onDismiss]);

  const formatHeaderDate = useMemo(() => {
    const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    
    return `${weekday} — ${month} ${day}, ${year}`;
  }, [currentDate]);

  // Memoize tasks for current date to avoid filtering on every render
  const memoizedCalcTime = performance.now();
  const tasksForCurrentDate = useMemo(() => {
    const currentDateStr = currentDate.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.scheduledDate) return false;
      return task.scheduledDate === currentDateStr || (task.endDate && task.endDate === currentDateStr);
    });
  }, [tasks, currentDate]);
  const memoizedCalcEndTime = performance.now();
  console.log('[DayDetailView] 🧮 MEMOIZED CALC - Time:', memoizedCalcEndTime - memoizedCalcTime, 'ms');

  const getTasksForHour = (hour: number) => {
    return tasksForCurrentDate.filter(task => {
      if (!task.startTime) return false;
      const taskHour = parseInt(task.startTime.match(/(\d+):/)?.[1] || '0');
      const taskPeriod = task.startTime.includes('PM');
      const normalizedTaskHour = taskPeriod && taskHour !== 12 ? taskHour + 12 : taskHour;
      return normalizedTaskHour === hour;
    });
  };

  const renderCheckTime = performance.now();
  console.log('[DayDetailView] 🎨 RENDER CHECK - visible:', visible, 'Time:', renderCheckTime);
  
  // Calculate latency from tap to render check
  if ((global as any).tapStartTime) {
    const renderCheckLatency = renderCheckTime - (global as any).tapStartTime;
    console.log('[DayDetailView] ⏱️ RENDER CHECK LATENCY - Time from tap to render check:', renderCheckLatency, 'ms');
  }
  
  if (!visible) {
    console.log('[DayDetailView] Component mounted but not visible - returning hidden view');
    // Return a hidden view that takes no space but keeps the component mounted
    return (
      <View style={{ 
        position: 'absolute', 
        left: -9999, 
        top: -9999, 
        width: 1, 
        height: 1,
        opacity: 0,
        pointerEvents: 'none'
      }} />
    );
  }
  
  const jsxCreationTime = performance.now();
  console.log('[DayDetailView] 🎬 RENDERING MODAL - Starting modal render');

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
                <Text style={styles.headerDate}>{formatHeaderDate}</Text>
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
  
  const jsxCreationEndTime = performance.now();
  console.log('[DayDetailView] 🎨 JSX CREATION - Time:', jsxCreationEndTime - jsxCreationTime, 'ms');
  
  const componentRenderEndTime = performance.now();
  console.log('[DayDetailView] 🎬 COMPONENT RENDER END - Total Time:', componentRenderEndTime - componentRenderStartTime, 'ms');
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if visible state changes or date changes significantly
  const visibleChanged = prevProps.visible !== nextProps.visible;
  const dateChanged = prevProps.date.getTime() !== nextProps.date.getTime();
  const tasksChanged = prevProps.tasks !== nextProps.tasks;
  const monthChanged = prevProps.month !== nextProps.month;
  
  // Re-render if any of these critical props changed
  const shouldRerender = visibleChanged || dateChanged || tasksChanged || monthChanged;
  
  console.log('[DayDetailView] 🔍 MEMO COMPARISON - visible:', visibleChanged, 'date:', dateChanged, 'tasks:', tasksChanged, 'month:', monthChanged, 'shouldRerender:', shouldRerender);
  
  return !shouldRerender; // Return true to skip re-render, false to re-render
});

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

export default DayDetailView; 