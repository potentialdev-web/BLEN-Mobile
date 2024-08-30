import React, { useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { usePathname, useRouter } from 'expo-router';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { useTasks } from '@/hooks/useTasks';

export default function EditTaskScreen() {
  // Task Data Hooks
  const { getTaskItem } = useTasks();
  const { editTask } = useTaskMutations();

  // Navigation Hooks
  const router = useRouter();
  const id = +usePathname().split('/')[1] || 0;

  // State Hooks
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  // Fetch Task Data
  const { data: task, isFetching } = getTaskItem(id);

  // Set State When Task is Fetched
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate.toString());
      setPriority(task.priority);
    }
  }, [task]);

  // Handle Task Editing
  const handleEditTask = async () => {
    await editTask.mutateAsync({
      id,
      title,
      description,
      dueDate: new Date(dueDate),
      priority,
    });
    router.replace(`${id}`);
  };

  // Handle Date Picker Change
  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setOpen(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // Render Loading or Task Not Found
  if (isFetching) return <Text>Loading...</Text>;
  if (!task) return <Text>Task Not Found</Text>;

  // Render Edit Task Screen
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
      <Button title="Save Changes" onPress={handleEditTask} />
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
