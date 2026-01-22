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

  const toggleHabit = useCallback((id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        if (habit.targetCount) {
          const newCount = (habit.currentCount || 0) + 1;
          return {
            ...habit,
            currentCount: newCount >= habit.targetCount ? habit.targetCount : newCount,
            isCompleted: newCount >= habit.targetCount,
          };
        }
        return { ...habit, isCompleted: !habit.isCompleted };
      }
      return habit;
    }));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const completedCount = habits.filter(h => h.isCompleted).length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return { habits, addHabit, toggleHabit, deleteHabit, completedCount, totalCount, progressPercent };
}
