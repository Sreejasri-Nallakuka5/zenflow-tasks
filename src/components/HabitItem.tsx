import { Habit } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { useLongPress } from '@/hooks/useLongPress';
import { ActionMenu } from './ActionMenu';
import { useHabits } from '@/hooks/useHabits';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string, direction?: 'up' | 'down') => void;
}

export function HabitItem({ habit, onToggle }: HabitItemProps) {
  const { deleteHabit, updateHabitStatus } = useHabits();
  const [showMenu, setShowMenu] = useState(false);
  const hasCounter = habit.targetCount !== undefined;
  const isComplete = habit.isCompleted;

  const longPressProps = useLongPress(() => {
    setShowMenu(true);
  });

  const handleIncrement = (e: React.MouseEvent | React.TouchEvent) => {
    if (longPressProps.isLongPress()) return;
    e.stopPropagation();
    onToggle(habit.id, 'up');
  };

  const handleDecrement = (e: React.MouseEvent | React.TouchEvent) => {
    if (longPressProps.isLongPress()) return;
    e.stopPropagation();
    if (hasCounter && (habit.currentCount || 0) > 0) {
      onToggle(habit.id, 'down');
    } else if (!hasCounter && isComplete) {
      onToggle(habit.id, 'down');
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 animate-slide-up touch-feedback select-none"
        onClick={handleIncrement}
        onMouseDown={longPressProps.onMouseDown}
        onMouseUp={longPressProps.onMouseUp}
        onMouseLeave={longPressProps.onMouseLeave}
        onTouchStart={longPressProps.onTouchStart}
        onTouchEnd={longPressProps.onTouchEnd}
        onTouchMove={longPressProps.onTouchMove}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{habit.emoji}</span>
          <div className="flex flex-col">
            <span className={cn(
              "font-medium transition-all text-foreground",
              isComplete && "line-through text-muted-foreground"
            )}>
              {habit.title}
            </span>
            {hasCounter && (
              <span className="text-xs text-muted-foreground">
                {habit.currentCount} / {habit.targetCount} completed
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(hasCounter || isComplete) && (
            <button
              onClick={handleDecrement}
              className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-all touch-feedback"
            >
              <span className="text-xl font-bold">-</span>
            </button>
          )}

          {hasCounter ? (
            <div className={cn(
              "w-12 h-12 rounded-lg border-2 flex items-center justify-center font-medium transition-all",
              isComplete
                ? "border-primary bg-primary/20 text-primary shadow-sm"
                : "border-primary/30 text-muted-foreground"
            )}>
              {habit.currentCount}
            </div>
          ) : (
            <div className={cn(
              "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all",
              isComplete
                ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "border-muted-foreground/30"
            )}>
              {isComplete && <Check className="w-6 h-6" />}
            </div>
          )}
        </div>
      </div>

      <ActionMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        title={habit.title}
        type="habit"
        onStop={() => updateHabitStatus(habit.id, habit.status === 'stopped' ? 'active' : 'stopped')}
        onDelete={() => deleteHabit(habit.id)}
      />
    </>
  );
}
