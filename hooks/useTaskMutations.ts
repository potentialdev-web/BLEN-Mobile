import { useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/db/client';
import { tasks as TaskSchema, NewTask } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  // Add Task Mutation
  const addTask = useMutation({
    mutationFn: async (task: NewTask) => {
      try {
        await db.insert(TaskSchema).values(task);
      } catch (error) {
        console.error('Error adding task:', error);
        throw new Error('Failed to add task.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
        exact: true,
        refetchType: 'active',
      });
    },
    onError: (error) => {
      console.error('Add Task Error:', error);
    },
  });

  // Edit Task Mutation
  const editTask = useMutation({
    mutationFn: async (task: NewTask) => {
      try {
        await db.update(TaskSchema).set(task).where(sql`${TaskSchema.id} = ${task.id}`);
      } catch (error) {
        console.error('Error editing task:', error);
        throw new Error('Failed to edit task.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
        exact: true,
        refetchType: 'active',
      });
    },
    onError: (error) => {
      console.error('Edit Task Error:', error);
    },
  });

  // Delete Task Mutation
  const deleteTask = useMutation({
    mutationFn: async (id: number | string) => {
      try {
        await db.delete(TaskSchema).where(sql`${TaskSchema.id} = ${id}`);
      } catch (error) {
        console.error(`Error deleting task with ID ${id}:`, error);
        throw new Error('Failed to delete task.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
        exact: true,
        refetchType: 'active',
      });
    },
    onError: (error) => {
      console.error('Delete Task Error:', error);
    },
  });

  return { addTask, editTask, deleteTask };
};
