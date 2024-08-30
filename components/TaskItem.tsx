import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '@/db/schema';
import { useRouter } from 'expo-router';

type TaskItemProps = {
  task: Task;
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const router = useRouter();

  const taskPriority = (priority: number): string => {
    switch (priority) {
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      default:
        return 'Unknown';
    }
  };

  const priorityStyle = (priority: number): object => {
    switch (priority) {
      case 1:
        return { color: '#080' }; // Green for Low
      case 2:
        return { color: '#008' }; // Blue for Medium
      case 3:
        return { color: '#800' }; // Red for High
      default:
        return { color: 'black' }; // Default to black for unknown priority
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.replace(`${task.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Task: ${task.title}`}
      accessibilityHint="Tap to view task details"
    >
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.dueDate}>{new Date(task.dueDate).toDateString()}</Text>
      <Text style={[styles.priority, priorityStyle(task.priority)]}>
        {taskPriority(task.priority)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 14,
    color: 'gray',
  },
  priority: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
