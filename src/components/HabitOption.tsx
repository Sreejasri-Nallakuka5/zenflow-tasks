import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitOptionProps {
  emoji: string;
  title: string;
  onAdd: () => void;
  color?: string;
}

export function HabitOption({ emoji, title, onAdd, color = 'text-primary' }: HabitOptionProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/30 animate-slide-up">
      <div className="flex items-center gap-3">
        <span className="text-xl">{emoji}</span>
        <span className="font-medium">{title}</span>
      </div>
      <button
        onClick={onAdd}
        className={cn(
          "w-8 h-8 flex items-center justify-center touch-feedback transition-transform hover:scale-110",
          color
        )}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
