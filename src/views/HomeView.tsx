import { useState } from 'react';
import { WeekCalendar } from '@/components/WeekCalendar';
import { TabSwitch } from '@/components/TabSwitch';
import { ProgressBar } from '@/components/ProgressBar';
import { HabitItem } from '@/components/HabitItem';
import { TaskItem } from '@/components/TaskItem';
import { AddButton } from '@/components/AddButton';
import { AddHabitModal } from '@/components/AddHabitModal';
import { AddTaskModal } from '@/components/AddTaskModal';
import { TabType } from '@/types';
import { useHabits } from '@/hooks/useHabits';
import { useTasks } from '@/hooks/useTasks';

export function HomeView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('habits');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const { habits, addHabit, toggleHabit, progressPercent } = useHabits();
  const { tasks, addTask, toggleTask, pendingCount } = useTasks();

  const incompleteTasks = tasks.filter(t => !t.isCompleted);

  return (
    <div className="min-h-screen pb-32 safe-area-top">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <WeekCalendar 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
          />
          <div className="flex gap-1 bg-secondary rounded-full p-1">
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l16 16M4 20L20 4" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </button>
          </div>
        </div>

        <TabSwitch 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          todosCount={pendingCount > 0 ? pendingCount : undefined}
        />

        {activeTab === 'habits' ? (
          <div className="animate-fade-in">
            {habits.length > 0 && (
              <ProgressBar percent={progressPercent} className="mb-6" />
            )}
            
            <div className="stagger-children">
              {habits.map((habit) => (
                <HabitItem 
                  key={habit.id} 
                  habit={habit} 
                  onToggle={toggleHabit}
                />
              ))}
            </div>

            {habits.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg mb-2">No habits for this day.</p>
                <p className="mb-4">Start shaping your day</p>
                <p>
                  by{' '}
                  <button 
                    onClick={() => setShowAddHabit(true)}
                    className="text-success bg-success/20 px-2 py-1 rounded"
                  >
                    adding new habits
                  </button>
                </p>
              </div>
            ) : (
              <AddButton 
                onClick={() => setShowAddHabit(true)} 
                label="Add new habit"
                className="mt-6"
              />
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="stagger-children">
              {incompleteTasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask}
                />
              ))}
            </div>

            <button 
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-4 py-3 text-muted-foreground touch-feedback"
            >
              <div className="w-7 h-7 rounded-full border-2 border-dashed border-muted-foreground/50" />
              <span>+ Add new task</span>
            </button>
          </div>
        )}
      </div>

      <AddHabitModal 
        isOpen={showAddHabit}
        onClose={() => setShowAddHabit(false)}
        onAddHabit={addHabit}
      />

      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAddTask={addTask}
      />
    </div>
  );
}
