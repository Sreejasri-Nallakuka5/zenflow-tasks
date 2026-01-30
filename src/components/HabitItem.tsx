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

const ScribbleScribble = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-primary-foreground animate-in fade-in zoom-in duration-500">
    <path
      d="M4 7c2-1 4 2 6 0s3-4 5-1 4 3 6 0M3 10c3-1 6 3 9 0s4-5 7-1M4 13c2-1 4 4 7 1s3-6 6-2 3 4 5 0M3 16c3-1 5 3 8 0s4-4 7-1 3 3 5 0M4 19c2-1 5 4 8 1s4-5 7-2"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-80"
    />
    <path
      d="M5 8c2 1 4-2 7 0s3 4 6 1M4 11c3 1 5-3 8 0s4 4 7 1M5 14c2 1 4-3 7 0s3 5 6 1M4 17c3 1 6-2 9 0s4 4 7 1"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-60"
    />
  </svg>
);

export function HabitItem({ habit, onToggle }: HabitItemProps) {
  const { deleteHabit, updateHabitStatus } = useHabits();
  const [showMenu, setShowMenu] = useState(false);

  // Only show numeric counter if target is more than 1
  const showCounter = habit.targetCount !== undefined && habit.targetCount > 1;
  const isComplete = habit.isCompleted;

  const longPressProps = useLongPress(() => {
    setShowMenu(true);
  });

  const handleToggleAction = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (longPressProps.isLongPress()) return;
    e.stopPropagation();

    if (!showCounter) {
      onToggle(habit.id, isComplete ? 'down' : 'up');
    } else {
      onToggle(habit.id, 'up');
    }
  };

  const handleDecrement = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    e.stopPropagation();
    if (showCounter && (habit.currentCount || 0) > 0) {
      onToggle(habit.id, 'down');
    }
  };

  // Map categories to colors from the reference image
  const getCategoryColor = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'health': return 'text-[hsl(var(--cat-green))] border-[hsl(var(--cat-green))]';
      case 'personal': return 'text-[hsl(var(--cat-pink))] border-[hsl(var(--cat-pink))]';
      case 'work': return 'text-[hsl(var(--cat-cyan))] border-[hsl(var(--cat-cyan))]';
      default: return 'text-primary border-primary';
    }
  };

  const colorClasses = isComplete ? getCategoryColor(habit.category) : 'text-muted-foreground border-muted-foreground/30';

  return (
    <>
      <div
        className="flex items-center justify-between p-4 card-sketchy mb-3 animate-slide-up touch-feedback select-none cursor-pointer group"
        onPointerDown={longPressProps.onTouchStart}
        onPointerUp={(e) => {
          longPressProps.onTouchEnd();
          if (!longPressProps.isLongPress()) {
            handleToggleAction(e);
          }
        }}
        onPointerMove={longPressProps.onTouchMove}
        onPointerLeave={longPressProps.onTouchEnd}
      >
        <div className="flex items-center gap-3">
          {habit.emoji && <span className="text-xl">{habit.emoji}</span>}
          <div className="flex flex-col">
            <span className={cn(
              "font-medium transition-all text-foreground",
              isComplete && "line-through text-muted-foreground"
            )}>
              {habit.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showCounter && (habit.currentCount || 0) > 0 && (
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={handleDecrement}
              className="w-10 h-10 rounded-lg bg-secondary/40 flex items-center justify-center text-foreground hover:bg-secondary/60 transition-all touch-feedback z-20"
            >
              <span className="text-xl font-bold">-</span>
            </button>
          )}

          <div className={cn(
            "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all overflow-hidden relative",
            isComplete
              ? "border-primary bg-primary shadow-sm shadow-primary/20"
              : "border-muted-foreground/30"
          )}>
            {showCounter ? (
              <div className="flex flex-col items-center justify-center leading-none">
                <span className="text-xs font-bold opacity-80">{habit.currentCount}</span>
                <div className="w-4 h-px bg-current my-0.5 opacity-50" />
                <span className="text-[10px] opacity-60 uppercase">{habit.targetCount}</span>
              </div>
            ) : (
              isComplete && <ScribbleScribble />
            )}

            {isComplete && showCounter && (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <ScribbleScribble />
              </div>
            )}
          </div>
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
