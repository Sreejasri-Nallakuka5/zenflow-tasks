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
    mutationFn: async (newHabit: Omit<Habit, 'id' | 'createdAt' | 'isCompleted' | 'currentCount'>) => {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHabit),
      });
      if (!res.ok) throw new Error('Failed to add habit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      // toast({ title: "Habit added successfully" });
    },
  });

  const toggleHabitMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      // Optimistic update logic is complex here without endpoint refactor, 
      // but we can try to reuse existing endpoint if it supports partial updates or creating a specific toggle endpoint.
      // For now, let's assume updateHabit endpoint handles the logic or we calculate new values client side and send them.
      // However, the backend updateHabit logic seems to just take fields.
      // Let's implement a basic client-side calculation and send the update to the server.
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


  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'isCompleted' | 'currentCount'>) => {
    addHabitMutation.mutate(habit);
  };

  const toggleHabit = (id: string, direction: 'up' | 'down' = 'up') => {
    toggleHabitMutation.mutate({ id, direction });
  };

  const deleteHabit = (id: string) => {
    deleteHabitMutation.mutate(id);
  };

  const totalPossibleTicks = habits.reduce((acc: number, h: Habit) => acc + (h.targetCount || 1), 0);
  const currentTicks = habits.reduce((acc: number, h: Habit) => {
    if (h.targetCount !== undefined) return acc + (h.currentCount || 0);
    return acc + (h.isCompleted ? 1 : 0);
  }, 0);

  const progressPercent = totalPossibleTicks > 0
    ? Math.round((currentTicks / totalPossibleTicks) * 100)
    : 0;

  return { habits, addHabit, toggleHabit, deleteHabit, progressPercent, currentTicks, totalPossibleTicks };
}
