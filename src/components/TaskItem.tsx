import { Task } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useLongPress } from '@/hooks/useLongPress';
import { ActionMenu } from './ActionMenu';
import { useTasks } from '@/hooks/useTasks';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
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

export function TaskItem({ task, onToggle }: TaskItemProps) {
  const { deleteTask, postponeTask } = useTasks();
  const [showMenu, setShowMenu] = useState(false);

  const longPressProps = useLongPress(() => {
    setShowMenu(true);
  });

  return (
    <>
      <div
        className="flex items-center justify-between p-4 card-sketchy mb-3 animate-slide-up touch-feedback select-none cursor-pointer group"
        onPointerDown={longPressProps.onTouchStart}
        onPointerUp={(e) => {
          longPressProps.onTouchEnd();
          if (!longPressProps.isLongPress()) {
            onToggle(task.id);
          }
        }}
        onPointerMove={longPressProps.onTouchMove}
        onPointerLeave={longPressProps.onTouchEnd}
      >
        <div className="flex-1">
          <span className={cn(
            "font-medium transition-all text-foreground text-lg",
            task.isCompleted && "line-through text-muted-foreground"
          )}>
            {task.title}
          </span>
        </div>

        <div className={cn(
          "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 overflow-hidden relative",
          task.isCompleted
            ? "border-primary bg-primary shadow-sm shadow-primary/20"
            : "border-muted-foreground/30"
        )}>
          {task.isCompleted && <ScribbleScribble />}
        </div>
      </div>

      <ActionMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        title={task.title}
        type="task"
        onDelete={() => deleteTask(task.id)}
        onPostpone={() => postponeTask(task.id)}
      />
    </>
  );
}
