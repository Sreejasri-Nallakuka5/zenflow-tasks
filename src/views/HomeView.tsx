import { useState, useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { addDays, startOfDay, isSameDay, format, isToday } from 'date-fns';
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

export function HomeView() {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [activeTab, setActiveTab] = useState<TabType>('habits');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);

  const { habits, addHabit, toggleHabit, progressPercent } = useHabits();
  const { tasks, addTask, toggleTask, pendingCount } = useTasks();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    containScroll: 'trimSnaps',
    startIndex: 30
  });

  const days = Array.from({ length: 61 }, (_, i) => addDays(startOfDay(new Date()), i - 30));
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      isInternalChange.current = true;
      const index = emblaApi.selectedScrollSnap();
      setSelectedDate(days[index]);
      setTimeout(() => { isInternalChange.current = false; }, 100);
    };

    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || isInternalChange.current) return;
    const index = days.findIndex(d => isSameDay(d, selectedDate));
    if (index !== -1 && index !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(index, true);
    }
  }, [selectedDate, emblaApi]);

  const incompleteTasks = tasks.filter(t => !t.isCompleted);

  const displayTitle = isToday(selectedDate)
    ? "Today"
    : format(selectedDate, 'EEEE, d MMMM');

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden pb-4">
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
          "transition-all duration-300 ease-in-out origin-top overflow-hidden border-b border-border/10",
          isCalendarOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 px-0"
        )}>
          <WeekCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>

      {/* Swipeable Content Area */}
      <div className="flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {days.map((day) => (
            <div key={day.toISOString()} className="flex-[0_0_100%] min-w-0 h-full overflow-y-auto px-4 pt-6 pb-32">
              <TabSwitch
                activeTab={activeTab}
                onTabChange={setActiveTab}
                todosCount={pendingCount > 0 ? pendingCount : undefined}
              />

              {activeTab === 'habits' ? (
                <div className="animate-fade-in space-y-4">
                  {habits.length > 0 && isSameDay(day, new Date()) && (
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

                  <AddButton onClick={() => setShowAddHabit(true)} label="Add new habit" />
                </div>
              ) : (
                <div className="animate-fade-in space-y-4">
                  <div className="stagger-children space-y-3">
                    {incompleteTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                      />
                    ))}
                  </div>

                  <AddButton onClick={() => setShowAddTask(true)} label="Add new task" />
                </div>
              )}
            </div>
          ))}
        </div>
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
