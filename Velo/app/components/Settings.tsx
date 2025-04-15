import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Text, List, Portal, Dialog } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootState } from '../store';
import {
  TimeRange,
  setProductiveHours,
  setSleepHours,
  addBlockedHours,
  removeBlockedHours,
  updateBlockedHours,
} from '../store/preferencesSlice';

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

const TimeRangeInput: React.FC<{
  label: string;
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}> = ({ label, value, onChange }) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date | null>(null);
  const [tempRange, setTempRange] = useState<TimeRange>(value);

  const handleTimeChange = (isStart: boolean) => (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
      setShowEndPicker(false);
      
      if (selectedDate) {
        const timeString = dateToTimeString(selectedDate);
        const newRange = {
          ...value,
          [isStart ? 'start' : 'end']: timeString,
        };
        onChange(newRange);
      }
    } else if (selectedDate) {
      const timeString = dateToTimeString(selectedDate);
      setTempRange({
        ...tempRange,
        [isStart ? 'start' : 'end']: timeString,
      });
    }
  };

  const showTimePicker = (isStart: boolean) => {
    const currentTime = isStart ? value.start : value.end;
    setTempTime(timeStringToDate(currentTime));
    setTempRange(value);
    if (isStart) {
      setShowStartPicker(true);
      setShowEndPicker(false);
    } else {
      setShowStartPicker(false);
      setShowEndPicker(true);
    }
  };

  const handleConfirm = () => {
    onChange(tempRange);
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handleCancel = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
    setTempRange(value);
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
            <View style={styles.buttonContainer}>
              <Button onPress={handleCancel}>Cancel</Button>
              <Button mode="contained" onPress={handleConfirm}>Done</Button>
            </View>
          </View>
        </Dialog>
      </Portal>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Title title={label} />
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
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleProductiveHoursChange = (range: TimeRange) => {
    dispatch(setProductiveHours(range));
  };

  const handleSleepHoursChange = (range: TimeRange) => {
    dispatch(setSleepHours(range));
  };

  const handleAddBlockedHours = () => {
    dispatch(addBlockedHours(newBlockedHour));
    setNewBlockedHour({ start: '09:00', end: '10:00' });
    setShowBlockedDialog(false);
  };

  const handleUpdateBlockedHours = () => {
    if (editingBlockedHour) {
      dispatch(updateBlockedHours(editingBlockedHour));
      setEditingBlockedHour(null);
      setShowBlockedDialog(false);
    }
  };

  const handleBlockedTimeChange = (isStart: boolean) => (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
      setShowEndPicker(false);
    }

    if (selectedDate) {
      const timeString = dateToTimeString(selectedDate);
      if (editingBlockedHour) {
        setEditingBlockedHour({
          ...editingBlockedHour,
          range: {
            ...editingBlockedHour.range,
            [isStart ? 'start' : 'end']: timeString,
          },
        });
      } else {
        setNewBlockedHour({
          ...newBlockedHour,
          [isStart ? 'start' : 'end']: timeString,
        });
      }
    }
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
          <List.Section>
            {preferences.blockedHours.map((range, index) => (
              <List.Item
                key={index}
                title={`${range.start} - ${range.end}`}
                right={(props) => (
                  <View style={styles.blockedHourActions}>
                    <Button
                      {...props}
                      onPress={() => {
                        setEditingBlockedHour({ index, range });
                        setShowBlockedDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      {...props}
                      onPress={() => dispatch(removeBlockedHours(index))}
                    >
                      Delete
                    </Button>
                  </View>
                )}
              />
            ))}
          </List.Section>
          <Button
            mode="contained"
            onPress={() => {
              setEditingBlockedHour(null);
              setShowBlockedDialog(true);
            }}
          >
            Add Blocked Hours
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={showBlockedDialog} onDismiss={() => setShowBlockedDialog(false)}>
          <Dialog.Title>
            {editingBlockedHour ? 'Edit Blocked Hours' : 'Add Blocked Hours'}
          </Dialog.Title>
          <Dialog.Content>
            <View style={styles.timeInputContainer}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Text variant="bodyLarge">
                  {editingBlockedHour?.range.start ?? newBlockedHour.start}
                </Text>
              </TouchableOpacity>
              <Text style={styles.timeInputSeparator}>to</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Text variant="bodyLarge">
                  {editingBlockedHour?.range.end ?? newBlockedHour.end}
                </Text>
              </TouchableOpacity>
            </View>

            {(showStartPicker || showEndPicker) && (
              <DateTimePicker
                value={timeStringToDate(
                  showStartPicker
                    ? editingBlockedHour?.range.start ?? newBlockedHour.start
                    : editingBlockedHour?.range.end ?? newBlockedHour.end
                )}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleBlockedTimeChange(showStartPicker)}
                minuteInterval={15}
              />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowBlockedDialog(false)}>Cancel</Button>
            <Button onPress={editingBlockedHour ? handleUpdateBlockedHours : handleAddBlockedHours}>
              {editingBlockedHour ? 'Update' : 'Add'}
            </Button>
          </Dialog.Actions>
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
    justifyContent: 'center',
    gap: 16,
    marginVertical: 8,
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
  blockedHourActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default Settings; 