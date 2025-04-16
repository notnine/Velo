/**
 * Calendar screen that will show tasks organized by date. This screen helps users
 * view and manage their scheduled tasks in a calendar format.
 */
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import CalendarView from '../components/Calendar/CalendarView';

export default function CalendarScreen() {
  const tasks = useSelector((state: RootState) => state.tasks.items);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <CalendarView tasks={tasks} />
    </SafeAreaView>
  );
} 