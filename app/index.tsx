import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Button, RefreshControl, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from '@/components/TaskItem';
import { useRouter } from 'expo-router';

export default function TaskListScreen() {
  // Navigation Hook
  const router = useRouter();

  // Task Data Hook
  const { getTasks: { data: tasks, refetch, isFetching } } = useTasks();

  // State Hook for Priority Sorting
  const [priority, setPriority] = useState(1);

  // Memoized Task Sorting
  const sortedTasks = useMemo(() => {
    return tasks?.sort((a, b) => {
      if (a.priority > b.priority) return priority;
      if (a.priority === b.priority) return 0;
      return -priority;
    }) || [];
  }, [priority, tasks]);

  // Render Task List Screen
  return (
    <View style={styles.container}>
      <View style={styles.controlContainer}>
        <Button title="Add New Task" onPress={() => router.replace('/add')} />
        <Button title="Refresh List" onPress={() => refetch()} />
        <Picker selectedValue={priority} onValueChange={setPriority} style={styles.picker}>
          <Picker.Item label="Low priority" value={1} />
          <Picker.Item label="High priority" value={-1} />
        </Picker>
      </View>
      <FlatList
        data={sortedTasks}
        renderItem={({ item }) => <TaskItem task={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  controlContainer: {
    flexDirection: 'column',
    columnGap: 8,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
