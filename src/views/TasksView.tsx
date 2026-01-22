import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { TaskItem } from '@/components/TaskItem';
import { AddButton } from '@/components/AddButton';
import { AddTaskModal } from '@/components/AddTaskModal';
import { useTasks } from '@/hooks/useTasks';
import { TaskFilter } from '@/types';
import { cn } from '@/lib/utils';

const filters: { id: TaskFilter; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'no-date', label: 'No date' },
  { id: 'completed', label: 'Completed' },
];

export function TasksView() {
  const { filteredTasks, filter, setFilter, addTask, toggleTask } = useTasks();
  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <div className="min-h-screen pb-32 safe-area-top">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <button className="flex items-center gap-2">
            <h1 className="text-3xl font-handwritten font-bold">All Tasks</h1>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="text-foreground font-medium">Edit</button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={cn(
                "px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all touch-feedback",
                filter === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <div className="w-8 border-t border-muted-foreground/30" />
          <span className="flex items-center gap-1">
            Today
            <ChevronDown className="w-4 h-4" />
          </span>
        </div>

        <div className="stagger-children">
          {filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={toggleTask}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No tasks found</p>
            <p className="text-sm mt-2">Add a new task to get started</p>
          </div>
        )}
      </div>

      <AddButton onClick={() => setShowAddTask(true)} variant="primary" />

      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAddTask={addTask}
      />
    </div>
  );
}
