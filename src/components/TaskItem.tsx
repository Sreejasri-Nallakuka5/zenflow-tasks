import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <div 
      className="flex items-center gap-4 py-3 animate-slide-up touch-feedback"
      onClick={() => onToggle(task.id)}
    >
      <div className={cn(
        "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300",
        task.isCompleted 
          ? "border-primary bg-primary" 
          : "border-primary/50"
      )}>
        {task.isCompleted && (
          <svg className="w-4 h-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
            <path 
              d="M5 12l5 5L20 7" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-scale-in"
              style={{ 
                strokeDasharray: 24,
                strokeDashoffset: 0,
              }}
            />
          </svg>
        )}
      </div>
      <span className={cn(
        "flex-1 font-medium transition-all",
        task.isCompleted && "line-through text-muted-foreground"
      )}>
        {task.title}
      </span>
    </div>
  );
}
