import { useState, useCallback } from 'react';
import { Task, TaskFilter } from '@/types';

const defaultTasks: Task[] = [
  { id: '1', title: 'Oiling hair', isCompleted: false, dueDate: new Date(), createdAt: new Date() },
  { id: '2', title: 'Hair wash', isCompleted: false, dueDate: new Date(), createdAt: new Date() },
  { id: '3', title: 'Assignment', isCompleted: true, dueDate: new Date(), createdAt: new Date() },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [filter, setFilter] = useState<TaskFilter>('upcoming');

  const addTask = useCallback((title: string, dueDate?: Date) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      isCompleted: false,
      dueDate,
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredTasks = tasks.filter(task => {
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

  const pendingCount = tasks.filter(t => !t.isCompleted).length;

  return { tasks, filteredTasks, filter, setFilter, addTask, toggleTask, deleteTask, pendingCount };
}
