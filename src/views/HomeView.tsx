import { useState } from 'react';
import { startOfDay, format, isToday } from 'date-fns';
import { ChevronDown } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface DayContentProps {
  date: Date;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onShowAddHabit: () => void;
  onShowAddTask: () => void;
  pendingCount?: number;
}

function DayContent({ date, activeTab, onTabChange, onShowAddHabit, onShowAddTask, pendingCount }: DayContentProps) {
  const { t } = useLanguage();
  const { habits, toggleHabit, progressPercent } = useHabits(date);
  const { tasks, toggleTask } = useTasks();

  const incompleteTasks = tasks.filter(t => !t.isCompleted);

  return (
    <div className="flex-1 w-full flex flex-col px-4 pt-4 pb-32">
      <TabSwitch
        activeTab={activeTab}
        onTabChange={onTabChange}
        todosCount={pendingCount}
      />

      {activeTab === 'habits' ? (
        <div className="animate-fade-in space-y-4 pt-2">
          {habits.length > 0 && (
            <ProgressBar percent={progressPercent} className="mb-6" />
          )}

          <div className="stagger-children space-y-3">
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={toggleHabit}
              />
            ))}
          </div>

          <AddButton onClick={onShowAddHabit} label={t('add_new_habit')} />
        </div>
      ) : (
        <div className="animate-fade-in space-y-4 pt-2">
          <div className="stagger-children space-y-3">
            {incompleteTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
              />
            ))}
          </div>

          <AddButton onClick={onShowAddTask} label={t('add_new_task')} />
        </div>
      )}
    </div>
  );
}

export function HomeView() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [activeTab, setActiveTab] = useState<TabType>('habits');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);

  const { addHabit } = useHabits(selectedDate);
  const { addTask, pendingCount } = useTasks();

  const displayTitle = isToday(selectedDate)
    ? t('today')
    : format(selectedDate, 'EEEE, d MMMM');

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden bg-dots">
      {/* Header Section */}
      <div className="flex-shrink-0 z-40 bg-background pt-6 px-4">
        <div
          className="flex items-center gap-2 cursor-pointer group w-fit mb-4"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <h1 className="text-2xl font-handwritten font-bold text-foreground group-hover:text-primary transition-colors">
            {displayTitle}
          </h1>
          <div className={cn(
            "p-1 rounded-full bg-secondary/50 transition-all duration-300",
            isCalendarOpen ? "rotate-180 bg-primary/10 text-primary" : "rotate-0"
          )}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>

        {/* Toggleable Calendar */}
        <div className={cn(
          "transition-all duration-300 ease-in-out origin-top overflow-hidden",
          isCalendarOpen ? "max-h-[300px] opacity-100 mb-2" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <WeekCalendar
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(startOfDay(date));
            }}
          />
        </div>
      </div>

      {/* Main Content Area - Static View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <DayContent
          date={selectedDate}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onShowAddHabit={() => setShowAddHabit(true)}
          onShowAddTask={() => setShowAddTask(true)}
          pendingCount={pendingCount > 0 ? pendingCount : undefined}
        />
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
