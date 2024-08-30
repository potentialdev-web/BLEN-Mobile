import React, { useState } from 'react';
import { Button, Platform, StyleSheet, TextInput, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { useRouter } from 'expo-router';
import { useTaskMutations } from '@/hooks/useTaskMutations';

export default function AddTaskScreen() {
  // Navigation Hook
  const router = useRouter();

  // State Hooks
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  // Task Mutations Hook
  const { addTask } = useTaskMutations();

  // Handle Date Picker Change
  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setOpen(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Handle Task Addition
  const handleAddTask = async () => {
    if (title.trim().length === 0) {
      return;
    } else {
      await addTask.mutateAsync({ title, description, dueDate: date, priority });
      router.replace('/');
    }
  };

  // Render Add Task Screen
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title={date.toDateString()} onPress={() => setOpen(true)} />
      {open && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      <Picker selectedValue={priority} onValueChange={setPriority} style={styles.picker}>
        <Picker.Item label="Low" value={1} />
        <Picker.Item label="Medium" value={2} />
        <Picker.Item label="High" value={3} />
      </Picker>
      <Button
        disabled={addTask.isPending}
        title={addTask.isPending ? "Saving task ..." : "Save Task"}
        onPress={handleAddTask}
      />
      <Button title="Back" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
});
