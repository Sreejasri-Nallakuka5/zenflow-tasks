import { Habit } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

export function HabitItem({ habit, onToggle }: HabitItemProps) {
  const hasCounter = habit.targetCount !== undefined;
  const isComplete = habit.isCompleted;

  return (
    <div 
      className="flex items-center justify-between py-4 border-b border-border/50 animate-slide-up touch-feedback"
      onClick={() => onToggle(habit.id)}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{habit.emoji}</span>
        <span className={cn(
          "font-medium transition-all",
          isComplete && "line-through text-muted-foreground"
        )}>
          {habit.title}
        </span>
      </div>

      {hasCounter ? (
        <div className={cn(
          "w-12 h-12 rounded-lg border-2 flex items-center justify-center font-medium transition-all",
          isComplete 
            ? "border-primary bg-primary/20 text-primary" 
            : "border-primary/50 text-muted-foreground"
        )}>
          {habit.currentCount}/{habit.targetCount}
        </div>
      ) : (
        <div className={cn(
          "w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all",
          isComplete 
            ? "border-primary bg-primary text-primary-foreground" 
            : "border-muted-foreground/50"
        )}>
          {isComplete && <Check className="w-5 h-5" />}
        </div>
      )}
    </div>
  );
}
