import { useState } from 'react';
import { TaskItem } from '@/components/TaskItem';
import { AddButton } from '@/components/AddButton';
import { AddTaskModal } from '@/components/AddTaskModal';
import { useTasks } from '@/hooks/useTasks';
import { TaskFilter } from '@/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function TasksView() {
  const { t } = useLanguage();
  const { filteredTasks, filter, setFilter, addTask, toggleTask } = useTasks();

  const filters: { id: TaskFilter; label: string }[] = [
    { id: 'upcoming', label: t('today') },
    { id: 'no-date', label: t('todos') },
    { id: 'completed', label: t('done') },
  ];

  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <div className="min-h-screen pb-32 safe-area-top bg-dots">
      <div className="p-4">
        <div className="flex items-center justify-between mb-8 mt-4">
          <h1 className="text-4xl font-handwritten font-bold text-foreground">{t('all_tasks')}</h1>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={cn(
                "px-5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all touch-feedback border-b-4",
                filter === id
                  ? "bg-primary text-primary-foreground border-primary/30 shadow-sm"
                  : "bg-secondary/40 text-muted-foreground border-transparent"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="stagger-children space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-24 px-6 animate-fade-in">
            <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <p className="text-lg font-medium text-foreground/70">{t('no_tasks_found')}</p>
            <p className="text-sm text-muted-foreground mt-2">{t('add_task_started')}</p>
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
