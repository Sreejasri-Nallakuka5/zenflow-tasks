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

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update task');
      return res.json();
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map(task => task.id === id ? { ...task, ...updates } : task)
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.filter(task => task.id !== id)
      );
      return { previousTasks };
    },
    onError: (err, id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const addTask = useCallback((title: string, dueDate?: Date, options: any = {}) => {
    addTaskMutation.mutate({ title, dueDate, ...options });
  }, [addTaskMutation]);

  const toggleTask = useCallback((id: string) => {
    const task = tasks.find((t: Task) => t.id === id);
    if (task) {
      updateTaskMutation.mutate({ id, updates: { isCompleted: !task.isCompleted } });
    }
  }, [tasks, updateTaskMutation]);

  const deleteTask = useCallback((id: string) => {
    deleteTaskMutation.mutate(id);
  }, [deleteTaskMutation]);

  const postponeTask = useCallback((id: string) => {
    const task = tasks.find((t: Task) => t.id === id);
    if (task) {
      const currentDue = task.dueDate ? new Date(task.dueDate) : new Date();
      const nextDay = new Date(currentDue);
      nextDay.setDate(nextDay.getDate() + 1);
      updateTaskMutation.mutate({ id, updates: { dueDate: nextDay } });
    }
  }, [tasks, updateTaskMutation]);

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

  return { tasks, filteredTasks, filter, setFilter, addTask, toggleTask, deleteTask, postponeTask, pendingCount };
}
