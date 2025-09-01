import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Text, Portal, IconButton } from 'react-native-paper';
import { Task } from '../store/taskSlice';

interface DayDetailViewProps {
  visible: boolean;
  onDismiss: () => void;
  onTaskPress: (task: Task) => void;
  date: Date;
  tasks: Task[];
  month: string;
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
}: DayDetailViewProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (visible && !shouldRender) {
      setShouldRender(true);
      // Small delay to ensure component is mounted before animation
      setTimeout(() => {
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
      }, 10);
    } else if (!visible && shouldRender) {
      Animated.parallel([
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
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible, slideAnim, fadeAnim, shouldRender]);
  const formatHeaderDate = () => {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${weekday} — ${month} ${day}, ${year}`;
  };

  const getTasksForHour = (hour: number) => {
    return tasks.filter(task => {
      if (!task.startTime) return false;
      const taskHour = parseInt(task.startTime.match(/(\d+):/)?.[1] || '0');
      const taskPeriod = task.startTime.includes('PM');
      const normalizedTaskHour = taskPeriod && taskHour !== 12 ? taskHour + 12 : taskHour;
      return normalizedTaskHour === hour;
    });
  };

  if (!shouldRender) return null;

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
                <TouchableOpacity onPress={onDismiss} style={styles.backButton}>
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