/**
 * Modal component (dialog that forces user to respond) for adding new tasks. Provides a form with title and optional
 * description inputs. Handles validation and submission of new task data.
 */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, TextInput, Button, Text } from 'react-native-paper';

interface AddTaskModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (title: string, description: string) => void;
}

export default function AddTaskModal({ visible, onDismiss, onSubmit }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text variant="titleLarge" style={styles.title}>Add New Task</Text>
        
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <View style={styles.buttons}>
          <Button onPress={onDismiss} style={styles.button}>Cancel</Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!title.trim()}
            style={styles.button}
          >
            Add Task
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    marginLeft: 8,
  },
}); 