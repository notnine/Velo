import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Portal, Modal, IconButton } from 'react-native-paper';
import { Task } from '../store/taskSlice';

interface TaskDetailsModalProps {
  visible: boolean;
  onDismiss: () => void;
  onEdit: () => void;
  onDelete: () => void;
  task: Task;
  month: string;
}

export default function TaskDetailsModal({ 
  visible, 
  onDismiss, 
  onEdit, 
  onDelete,
  task,
  month
}: TaskDetailsModalProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    // Parse as local date, not UTC
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRangeText = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return '';
    return `from ${startTime} to ${endTime}`;
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onDismiss} style={styles.backButton}>
            <IconButton
              icon="chevron-left"
              size={24}
              iconColor="#FF3B30"
              style={styles.backIcon}
            />
            <Text style={styles.monthText}>{month}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{task.title}</Text>
          
          <View style={styles.dateTimeSection}>
            <Text style={styles.dateText}>
              {formatDate(task.scheduledDate)}
            </Text>
            <Text style={styles.timeText}>
              {getTimeRangeText(task.startTime, task.endTime)}
            </Text>
          </View>

          {task.description && (
            <Text style={styles.description}>{task.description}</Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={onDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Event</Text>
        </TouchableOpacity>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 34, // Add padding for iPhone home indicator
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: 'white',
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    width: 80,
    alignItems: 'flex-end',
  },
  editButtonText: {
    fontSize: 17,
    color: '#FF3B30',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateTimeSection: {
    marginTop: 16,
  },
  dateText: {
    fontSize: 17,
    color: '#000',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 17,
    color: '#666',
  },
  description: {
    fontSize: 17,
    color: '#000',
    marginTop: 16,
  },
  deleteButton: {
    marginTop: 'auto',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
}); 