import AppProviders from '@/providers/app-providers';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Task List' }} />
        <Stack.Screen name="add" options={{ title: 'Add Task' }} />
        <Stack.Screen name="[id]/index" options={{ title: 'Task Details' }} />
        <Stack.Screen name="[id]/edit" options={{ title: 'Edit Task' }} />
      </Stack>
    </AppProviders>
  );
}
