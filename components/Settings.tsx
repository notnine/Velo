import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Text, List, Portal, Dialog, HelperText, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootState } from '../app/store';
import {
  TimeRange,
  setProductiveHours,
  setSleepHours,
  addBlockedHours,
  removeBlockedHours,
  updateBlockedHours,
} from '../app/store/preferencesSlice';

// Helper to convert HH:mm to Date
const timeStringToDate = (timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Helper to convert Date to HH:mm
const dateToTimeString = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// Helper to compare two time strings (HH:mm format)
// Now properly handles overnight ranges (e.g., 23:00 to 07:00)
const isStartTimeBeforeEndTime = (start: string, end: string): boolean => {
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);
  
  // Convert to minutes for easier comparison
  const startMinutesTotal = startHours * 60 + startMinutes;
  const endMinutesTotal = endHours * 60 + endMinutes;
  
  // If end time is before start time, it's likely overnight
  // For overnight ranges, we consider them valid if the difference is reasonable
  if (endMinutesTotal < startMinutesTotal) {
    // Check if it's a reasonable overnight range (at least 1 hour, at most 23 hours)
    const overnightDuration = (24 * 60) - startMinutesTotal + endMinutesTotal;
    return overnightDuration >= 60 && overnightDuration <= 23 * 60;
  }
  
  // Regular same-day range
  return endMinutesTotal > startMinutesTotal;
};

// Helper to add one hour to a time string (HH:mm format)
const addOneHour = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  date.setHours(date.getHours() + 1);
  return dateToTimeString(date);
};

const TimeRangeInput: React.FC<{
  label: string;
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}> = ({ label, value, onChange }) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date | null>(null);
  const [tempRange, setTempRange] = useState<TimeRange>(value);
  const [error, setError] = useState<string>('');

  const validateTimeRange = (range: TimeRange): boolean => {
    if (!isStartTimeBeforeEndTime(range.start, range.end)) {
      setError('End time must be after start time');
      return false;
    }
    setError('');
    return true;
  };

  const handleTimeChange = (isStart: boolean) => (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
      setShowEndPicker(false);
      
      if (selectedDate) {
        const timeString = dateToTimeString(selectedDate);
        let newRange: TimeRange;
        
        if (isStart) {
          // When setting start time, automatically set end time to start + 1 hour
          const newEndTime = addOneHour(timeString);
          newRange = {
            start: timeString,
            end: newEndTime
          };
        } else {
          newRange = {
            ...value,
            end: timeString
          };
          if (!validateTimeRange(newRange)) {
            return;
          }
        }
        onChange(newRange);
      }
    } else if (selectedDate) {
      const timeString = dateToTimeString(selectedDate);
      let newRange: TimeRange;
      
      if (isStart) {
        // When setting start time, automatically set end time to start + 1 hour
        const newEndTime = addOneHour(timeString);
        newRange = {
          start: timeString,
          end: newEndTime
        };
      } else {
        newRange = {
          ...tempRange,
          end: timeString
        };
      }
      setTempRange(newRange);
      validateTimeRange(newRange);
    }
  };

  const showTimePicker = (isStart: boolean) => {
    const currentTime = isStart ? value.start : value.end;
    setTempTime(timeStringToDate(currentTime));
    setTempRange(value);
    setError('');
    if (isStart) {
      setShowStartPicker(true);
      setShowEndPicker(false);
    } else {
      setShowStartPicker(false);
      setShowEndPicker(true);
    }
  };

  const handleConfirm = () => {
    if (validateTimeRange(tempRange)) {
      onChange(tempRange);
      setShowStartPicker(false);
      setShowEndPicker(false);
    }
  };

  const handleCancel = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
    setTempRange(value);
    setError('');
  };

  const renderTimePicker = () => {
    if (!showStartPicker && !showEndPicker) return null;

    const pickerProps = {
      value: tempTime || new Date(),
      mode: "time" as const,
      is24Hour: true,
      minuteInterval: 15,
      onChange: handleTimeChange(showStartPicker),
    };

    if (Platform.OS === 'android') {
      return (
        <DateTimePicker
          {...pickerProps}
          display="default"
        />
      );
    }

    return (
      <Portal>
        <Dialog visible style={styles.dialog}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                {...pickerProps}
                display="spinner"
                style={styles.picker}
                textColor="#000000"
              />
            </View>
            {error ? (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            ) : null}
            <View style={styles.buttonContainer}>
              <Button onPress={handleCancel}>Cancel</Button>
              <Button 
                mode="contained" 
                onPress={handleConfirm}
                disabled={!!error}
              >
                Done
              </Button>
            </View>
          </View>
        </Dialog>
      </Portal>
    );
  };

  return (
    <Card style={[styles.card, !label && styles.noLabelCard]}>
      {label && <Card.Title title={label} />}
      <Card.Content>
        <View style={styles.timeInputContainer}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => showTimePicker(true)}
          >
            <Text variant="bodyLarge">{value.start}</Text>
          </TouchableOpacity>
          <Text style={styles.timeInputSeparator}>to</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => showTimePicker(false)}
          >
            <Text variant="bodyLarge">{value.end}</Text>
          </TouchableOpacity>
        </View>
        {renderTimePicker()}
      </Card.Content>
    </Card>
  );
};

export const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const preferences = useSelector((state: RootState) => state.preferences);
  const [showBlockedDialog, setShowBlockedDialog] = useState(false);
  const [editingBlockedHour, setEditingBlockedHour] = useState<{ index: number; range: TimeRange } | null>(null);
  const [newBlockedHour, setNewBlockedHour] = useState<TimeRange>({ start: '09:00', end: '10:00' });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isEditingStart, setIsEditingStart] = useState(true);
  const [tempTime, setTempTime] = useState<Date | null>(null);

  const handleProductiveHoursChange = (range: TimeRange) => {
    dispatch(setProductiveHours(range));
  };

  const handleSleepHoursChange = (range: TimeRange) => {
    dispatch(setSleepHours(range));
  };

  const handleTimePickerChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedDate && editingBlockedHour) {
      const timeString = dateToTimeString(selectedDate);
      let newRange: TimeRange;

      if (isEditingStart) {
        // When setting start time, automatically set end time to start + 1 hour
        const newEndTime = addOneHour(timeString);
        newRange = {
          start: timeString,
          end: newEndTime
        };
      } else {
        newRange = {
          ...editingBlockedHour.range,
          end: timeString
        };
        // Removed validation - allow any time range
      }

      dispatch(updateBlockedHours({ index: editingBlockedHour.index, range: newRange }));
      
      if (Platform.OS === 'android') {
        setEditingBlockedHour(null);
      }
    }
  };

  const showBlockedTimePicker = (index: number, range: TimeRange, isStart: boolean) => {
    setEditingBlockedHour({ index, range });
    setIsEditingStart(isStart);
    setTempTime(timeStringToDate(isStart ? range.start : range.end));
    setShowTimePicker(true);
  };

  const handleTimePickerDismiss = () => {
    setShowTimePicker(false);
    setEditingBlockedHour(null);
  };

  return (
    <ScrollView style={styles.container}>
      <TimeRangeInput
        label="Productive Hours"
        value={preferences.productiveHours}
        onChange={handleProductiveHoursChange}
      />

      <TimeRangeInput
        label="Sleep Hours"
        value={preferences.sleepHours}
        onChange={handleSleepHoursChange}
      />

      <Card style={styles.card}>
        <Card.Title title="Blocked Hours" />
        <Card.Content>
          {preferences.blockedHours.map((range, index) => (
            <View key={index} style={styles.blockedHourContainer}>
              <View style={styles.timeInputContainer}>
                <View style={styles.timeRangeContainer}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => showBlockedTimePicker(index, range, true)}
                  >
                    <Text variant="bodyLarge">{range.start}</Text>
                  </TouchableOpacity>
                  <Text style={styles.timeInputSeparator}>to</Text>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => showBlockedTimePicker(index, range, false)}
                  >
                    <Text variant="bodyLarge">{range.end}</Text>
                  </TouchableOpacity>
                </View>
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => dispatch(removeBlockedHours(index))}
                />
              </View>
            </View>
          ))}
          <Button
            mode="contained"
            onPress={() => {
              setEditingBlockedHour(null);
              setNewBlockedHour({ start: '09:00', end: '10:00' });
              setShowBlockedDialog(true);
            }}
            style={styles.addButton}
          >
            Add Blocked Hours
          </Button>
        </Card.Content>
      </Card>

      {/* Time picker for editing blocked hours */}
      {showTimePicker && Platform.OS === 'ios' && (
        <Portal>
          <Dialog visible style={styles.dialog}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={tempTime || new Date()}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={handleTimePickerChange}
                  minuteInterval={15}
                  style={styles.picker}
                  textColor="#000000"
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button onPress={handleTimePickerDismiss}>Cancel</Button>
                <Button mode="contained" onPress={() => {
                  handleTimePickerDismiss();
                }}>
                  Done
                </Button>
              </View>
            </View>
          </Dialog>
        </Portal>
      )}

      {showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={tempTime || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimePickerChange}
          minuteInterval={15}
        />
      )}

      {/* Dialog for adding new blocked hours */}
      <Portal>
        <Dialog visible={showBlockedDialog} onDismiss={() => setShowBlockedDialog(false)}>
          <Dialog.Title>Add Blocked Hours</Dialog.Title>
          <Dialog.Content>
            <TimeRangeInput
              label=""
              value={newBlockedHour}
              onChange={(range) => {
                dispatch(addBlockedHours(range));
                setShowBlockedDialog(false);
              }}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginVertical: 8,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  timeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
    alignItems: 'center',
  },
  timeInputSeparator: {
    marginHorizontal: 8,
  },
  blockedHourContainer: {
    marginBottom: 8,
  },
  addButton: {
    marginTop: 8,
  },
  dialog: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: 'auto',
    height: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
    width: '100%',
  },
  noLabelCard: {
    marginBottom: 0,
  },
});

export default Settings; 