import { useQuery } from '@tanstack/react-query';
import { db } from '@/db/client';
import { tasks } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const useTasks = () => {
  // Fetch all tasks with error handling
  const getTasks = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        // Fetch all tasks from the database
        const allTasks = await db.select().from(tasks).all();
        return allTasks;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error('Failed to fetch tasks.');
      }
    },
    retry: false, // Disable retry to avoid repeated failed attempts
  });

  // Fetch a specific task by ID with error handling
  const getTaskItem = (id: string | number) => {
    return useQuery({
      queryKey: ['task', id],
      queryFn: async () => {
        try {
          // Fetch the task with the specified ID from the database
          const result = await db.select().from(tasks).where(sql`${tasks.id} = ${id}`);
          if (result.length === 0) {
            throw new Error(`Task with ID ${id} not found.`);
          }
          return result[0];
        } catch (error) {
          console.error(`Error fetching task with ID ${id}:`, error);
          throw new Error(`Failed to fetch task with ID ${id}.`);
        }
      },
      retry: false, // Disable retry for individual task fetch
      enabled: !!id, // Ensure query is only enabled if the ID is valid
    });
  };

  return { getTaskItem, getTasks };
};
