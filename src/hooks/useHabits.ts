import { useState, useCallback } from 'react';
import { Habit } from '@/types';

const defaultHabits: Habit[] = [
  { id: '1', title: 'Drink 8 glasses of water', emoji: '💧', category: 'Health & Wellness', targetCount: 8, currentCount: 3, isCompleted: false, createdAt: new Date() },
  { id: '2', title: 'Exercise for 30 minutes', emoji: '🏃', category: 'Health & Wellness', isCompleted: false, createdAt: new Date() },
  { id: '3', title: 'Take a shower', emoji: '🚿', category: 'Morning Routine', targetCount: 2, currentCount: 0, isCompleted: false, createdAt: new Date() },
  { id: '4', title: 'Plan for tomorrow', emoji: '📝', category: 'Productivity', isCompleted: false, createdAt: new Date() },
];

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt' | 'isCompleted' | 'currentCount'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      isCompleted: false,
      currentCount: 0,
      createdAt: new Date(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const toggleHabit = useCallback((id: string, direction: 'up' | 'down' = 'up') => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        if (habit.targetCount !== undefined) {
          const current = habit.currentCount || 0;
          const newCount = direction === 'up'
            ? Math.min(current + 1, habit.targetCount)
            : Math.max(current - 1, 0);

          return {
            ...habit,
            currentCount: newCount,
            isCompleted: newCount >= habit.targetCount,
          };
        }
        return { ...habit, isCompleted: direction === 'up' ? !habit.isCompleted : false };
      }
      return habit;
    }));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const totalPossibleTicks = habits.reduce((acc, h) => acc + (h.targetCount || 1), 0);
  const currentTicks = habits.reduce((acc, h) => {
    if (h.targetCount !== undefined) return acc + (h.currentCount || 0);
    return acc + (h.isCompleted ? 1 : 0);
  }, 0);

  const progressPercent = totalPossibleTicks > 0
    ? Math.round((currentTicks / totalPossibleTicks) * 100)
    : 0;

  return { habits, addHabit, toggleHabit, deleteHabit, progressPercent, currentTicks, totalPossibleTicks };
}
