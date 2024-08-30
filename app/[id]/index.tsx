import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { usePathname, useRouter } from 'expo-router';
import { useTasks } from '@/hooks/useTasks';
import { useTaskMutations } from '@/hooks/useTaskMutations';

export default function TaskDetailScreen() {
  // Navigation Hooks
  const router = useRouter();
  const id = usePathname().split('/')[1] || 0;

  // Task Data Hooks
  const { getTaskItem } = useTasks();
  const { deleteTask } = useTaskMutations();

  // Fetch Task Data
  if (!id) return <Text>Task Not Found</Text>;
  const { data: task, isFetching } = getTaskItem(id);

  // Handle Task Deletion
  const onDeleteTask = async () => {
    await deleteTask.mutateAsync(id);
    router.replace('/');
  };

  // Render Loading or Task Not Found
  if (isFetching) return <Text>Loading...</Text>;
  if (!task) return <Text>Task Not Found</Text>;

  // Determine Task Priority Label
  const priority = task.priority === 1 ? 'Low' : task.priority === 2 ? 'Medium' : 'High';

  // Render Task Details
  return (
    <View style={styles.container}>
      <Text>Title: {task.title}</Text>
      <Text>Description: {task.description}</Text>
      <Text>Due Date: {task.dueDate.toString()}</Text>
      <Text>Priority: {priority}</Text>
      <Button title="Edit Task" onPress={() => router.replace(`/${id}/edit`)} />
      <Button title="Delete Task" onPress={onDeleteTask} />
      <Button title="Back" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
