/**
 * Modal component (dialog that forces user to respond) for adding new tasks. Provides a form with title and optional
 * description inputs. Handles validation and submission of new task data.
 */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Keyboard } from 'react-native';
import { Modal, Portal, TextInput, Button, Text, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task } from '../store/taskSlice';

interface AddTaskModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (title: string, description: string, startDate: Date, endDate: Date) => void;
  editTask?: Task;
}

export default function AddTaskModal({ visible, onDismiss, onSubmit, editTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 60 * 60 * 1000));
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      
      // Parse the scheduled date, ensuring we get the correct local date
      let taskDate = new Date();
      if (editTask.scheduledDate) {
        const [year, month, day] = editTask.scheduledDate.split('-').map(Number);
        taskDate = new Date(year, month - 1, day); // month is 0-based in Date constructor
      }
      
      // Parse time strings (e.g., "1:00PM")
      const parseTime = (timeStr: string, baseDate: Date) => {
        const [time, period] = timeStr.match(/(\d+:\d+)(AM|PM)/)?.slice(1) || [];
        if (time && period) {
          const [hours, minutes] = time.split(':').map(Number);
          const date = new Date(baseDate);
          date.setHours(
            period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours),
            minutes
          );
          return date;
        }
        return baseDate;
      };

      if (editTask.startTime && editTask.endTime) {
        setStartDate(parseTime(editTask.startTime, taskDate));
        setEndDate(parseTime(editTask.endTime, taskDate));
      } else {
        setStartDate(taskDate);
        setEndDate(new Date(taskDate.getTime() + 60 * 60 * 1000));
      }
    } else {
      setTitle('');
      setDescription('');
      setStartDate(new Date());
      setEndDate(new Date(new Date().getTime() + 60 * 60 * 1000));
    }
  }, [editTask, visible]);

  const handleDescriptionSubmit = () => {
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title.trim(), description.trim(), startDate, endDate);
      setTitle('');
      setDescription('');
      setStartDate(new Date());
      setEndDate(new Date(new Date().getTime() + 60 * 60 * 1000));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(/\s+/g, '');
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDate(Platform.OS === 'ios');
    if (selectedDate) {
      const newStartDate = new Date(selectedDate);
      newStartDate.setHours(startDate.getHours(), startDate.getMinutes());
      setStartDate(newStartDate);
      
      // Update end date to maintain the same time difference
      const timeDiff = endDate.getTime() - startDate.getTime();
      setEndDate(new Date(newStartDate.getTime() + timeDiff));
    }
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTime(Platform.OS === 'ios');
    if (selectedDate) {
      const newStartDate = new Date(startDate);
      newStartDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setStartDate(newStartDate);
      
      // Set end time to 1 hour later if it's earlier than start time
      const newEndDate = new Date(endDate);
      if (newEndDate.getTime() <= newStartDate.getTime()) {
        newEndDate.setTime(newStartDate.getTime() + 60 * 60 * 1000);
        setEndDate(newEndDate);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDate(Platform.OS === 'ios');
    if (selectedDate) {
      const newEndDate = new Date(selectedDate);
      newEndDate.setHours(endDate.getHours(), endDate.getMinutes());
      if (newEndDate.getTime() <= startDate.getTime()) {
        newEndDate.setTime(startDate.getTime() + 60 * 60 * 1000);
      }
      setEndDate(newEndDate);
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTime(Platform.OS === 'ios');
    if (selectedDate) {
      const newEndDate = new Date(endDate);
      newEndDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      if (newEndDate.getTime() <= startDate.getTime()) {
        newEndDate.setTime(startDate.getTime() + 60 * 60 * 1000);
      }
      setEndDate(newEndDate);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text variant="titleLarge" style={styles.title}>
          {editTask ? 'Edit Task' : 'Add New Task'}
        </Text>
        
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          returnKeyType="done"
        />

        <TextInput
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline={false}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleDescriptionSubmit}
        />

        <View style={styles.dateTimeContainer}>
          <Text variant="bodyMedium" style={styles.label}>Starts</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                Keyboard.dismiss();
                setShowStartDate(true);
                setShowStartTime(false);
                setShowEndDate(false);
                setShowEndTime(false);
              }}
            >
              <Text variant="bodyLarge">{formatDate(startDate)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                Keyboard.dismiss();
                setShowStartTime(true);
                setShowStartDate(false);
                setShowEndDate(false);
                setShowEndTime(false);
              }}
            >
              <Text variant="bodyLarge">{formatTime(startDate)}</Text>
            </TouchableOpacity>
          </View>

          <Text variant="bodyMedium" style={[styles.label, styles.endsLabel]}>Ends</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                Keyboard.dismiss();
                setShowEndDate(true);
                setShowEndTime(false);
                setShowStartDate(false);
                setShowStartTime(false);
              }}
            >
              <Text variant="bodyLarge">{formatDate(endDate)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                Keyboard.dismiss();
                setShowEndTime(true);
                setShowEndDate(false);
                setShowStartDate(false);
                setShowStartTime(false);
              }}
            >
              <Text variant="bodyLarge">{formatTime(endDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showStartDate && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleStartDateChange}
          />
        )}
        {showStartTime && (
          <DateTimePicker
            value={startDate}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartTimeChange}
            minuteInterval={5}
          />
        )}
        {showEndDate && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleEndDateChange}
            minimumDate={startDate}
          />
        )}
        {showEndTime && (
          <DateTimePicker
            value={endDate}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndTimeChange}
            minuteInterval={5}
          />
        )}

        <View style={styles.buttons}>
          <Button onPress={onDismiss} style={styles.button}>Cancel</Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!title.trim()}
            style={styles.button}
          >
            {editTask ? 'Save Changes' : 'Add Task'}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  dateTimeContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  endsLabel: {
    marginTop: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 2,
    alignItems: 'center',
  },
  timeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 1,
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    marginLeft: 8,
  },
}); 