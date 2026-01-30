import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Habit } from '@/types';
import { format } from 'date-fns';

export function useHabits(date: Date = new Date()) {
  const queryClient = useQueryClient();
  const formattedDate = format(date, 'yyyy-MM-dd');

  const { data: habits = [] } = useQuery({
    queryKey: ['habits', formattedDate],
    queryFn: async () => {
      const res = await fetch(`/api/habits?date=${formattedDate}`);
      if (!res.ok) throw new Error('Failed to fetch habits');
      return res.json();
    },
  });

  const addHabitMutation = useMutation({
    mutationFn: async (newHabit: Omit<Habit, 'id' | 'createdAt' | 'isCompleted' | 'currentCount' | 'status'>) => {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newHabit, status: 'active', date: formattedDate }),
      });
      if (!res.ok) throw new Error('Failed to add habit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', formattedDate] });
    },
  });

  const updateHabitStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'stopped' }) => {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, date: formattedDate }),
      });
      if (!res.ok) throw new Error('Failed to update habit status');
      return res.json();
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['habits', formattedDate] });
      const previousHabits = queryClient.getQueryData<Habit[]>(['habits', formattedDate]);
      queryClient.setQueryData<Habit[]>(['habits', formattedDate], (old) =>
        old?.map(habit => habit.id === id ? { ...habit, status } : habit)
      );
      return { previousHabits };
    },
    onError: (err, variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits', formattedDate], context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', formattedDate] });
    },
  });

  const toggleHabitMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      const habit = habits.find((h: Habit) => h.id === id);
      if (!habit) throw new Error("Habit not found");

      let updates = {};
      if (habit.targetCount !== undefined) {
        const current = habit.currentCount || 0;
        const newCount = direction === 'up'
          ? Math.min(current + 1, habit.targetCount)
          : Math.max(current - 1, 0);
        updates = { currentCount: newCount, isCompleted: newCount >= habit.targetCount };
      } else {
        updates = { isCompleted: direction === 'up' ? !habit.isCompleted : false };
      }

      const res = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, date: formattedDate }),
      });
      if (!res.ok) throw new Error('Failed to update habit');
      return res.json();
    },
    onMutate: async ({ id, direction }) => {
      await queryClient.cancelQueries({ queryKey: ['habits', formattedDate] });
      const previousHabits = queryClient.getQueryData<Habit[]>(['habits', formattedDate]);

      queryClient.setQueryData<Habit[]>(['habits', formattedDate], (old) => {
        return old?.map(habit => {
          if (habit.id === id) {
            let updates = {};
            if (habit.targetCount !== undefined) {
              const current = habit.currentCount || 0;
              const newCount = direction === 'up'
                ? Math.min(current + 1, habit.targetCount)
                : Math.max(current - 1, 0);
              updates = { currentCount: newCount, isCompleted: newCount >= habit.targetCount };
            } else {
              updates = { isCompleted: direction === 'up' ? !habit.isCompleted : false };
            }
            return { ...habit, ...updates };
          }
          return habit;
        });
      });

      return { previousHabits };
    },
    onError: (err, variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits', formattedDate], context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', formattedDate] });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete habit');
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['habits', formattedDate] });
      const previousHabits = queryClient.getQueryData<Habit[]>(['habits', formattedDate]);
      queryClient.setQueryData<Habit[]>(['habits', formattedDate], (old) =>
        old?.filter(habit => habit.id !== id)
      );
      return { previousHabits };
    },
    onError: (err, id, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits', formattedDate], context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', formattedDate] });
    },
  });

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'isCompleted' | 'currentCount' | 'status'>) => {
    addHabitMutation.mutate(habit);
  };

  const toggleHabit = (id: string, direction: 'up' | 'down' = 'up') => {
    toggleHabitMutation.mutate({ id, direction });
  };

  const deleteHabit = (id: string) => {
    deleteHabitMutation.mutate(id);
  };

  const updateHabitStatus = (id: string, status: 'active' | 'stopped') => {
    updateHabitStatusMutation.mutate({ id, status });
  };

  const activeHabits = habits.filter((h: Habit) => h.status === 'active' || !h.status);

  const totalPossibleTicks = activeHabits.reduce((acc: number, h: Habit) => acc + (h.targetCount || 1), 0);
  const currentTicks = activeHabits.reduce((acc: number, h: Habit) => {
    if (h.targetCount !== undefined) return acc + (h.currentCount || 0);
    return acc + (h.isCompleted ? 1 : 0);
  }, 0);

  const progressPercent = totalPossibleTicks > 0
    ? Math.round((currentTicks / totalPossibleTicks) * 100)
    : 0;

  return {
    habits,
    activeHabits,
    stoppedHabits: habits.filter((h: Habit) => h.status === 'stopped'),
    addHabit,
    toggleHabit,
    deleteHabit,
    updateHabitStatus,
    progressPercent,
    currentTicks,
    totalPossibleTicks
  };
}
