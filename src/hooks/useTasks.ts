import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskFilter } from '@/types';

export function useTasks() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TaskFilter>('upcoming');

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async ({ title, dueDate }: { title: string; dueDate?: Date }) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, dueDate, isCompleted: false }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const task = tasks.find((t: Task) => t.id === id);
      if (!task) throw new Error('Task not found');

      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !task.isCompleted }),
      });
      if (!res.ok) throw new Error('Failed to toggle task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const addTask = useCallback((title: string, dueDate?: Date) => {
    addTaskMutation.mutate({ title, dueDate });
  }, [addTaskMutation]);

  const toggleTask = useCallback((id: string) => {
    toggleTaskMutation.mutate(id);
  }, [toggleTaskMutation]);

  const deleteTask = useCallback((id: string) => {
    deleteTaskMutation.mutate(id);
  }, [deleteTaskMutation]);

  const filteredTasks = tasks.filter((task: Task) => {
    switch (filter) {
      case 'upcoming':
        return !task.isCompleted && task.dueDate;
      case 'no-date':
        return !task.isCompleted && !task.dueDate;
      case 'completed':
        return task.isCompleted;
      default:
        return true;
    }
  });

  const pendingCount = tasks.filter((t: Task) => !t.isCompleted).length;

  return { tasks, filteredTasks, filter, setFilter, addTask, toggleTask, deleteTask, pendingCount };
}
