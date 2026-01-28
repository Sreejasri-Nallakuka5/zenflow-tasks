import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Habit } from '@/types';
// import { toast } from '@/components/ui/use-toast'; // Assuming you have a toast component

export function useHabits() {
  const queryClient = useQueryClient();

  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const res = await fetch('/api/habits');
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
        body: JSON.stringify({ ...newHabit, status: 'active' }),
      });
      if (!res.ok) throw new Error('Failed to add habit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const updateHabitStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'stopped' }) => {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update habit status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
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
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update habit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete habit');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
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
