import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { addDays, startOfDay, isSameDay } from 'date-fns';
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
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [activeTab, setActiveTab] = useState<TabType>('habits');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const { habits, addHabit, toggleHabit, progressPercent } = useHabits();
  const { tasks, addTask, toggleTask, pendingCount } = useTasks();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    containScroll: 'trimSnaps'
  });

  const days = Array.from({ length: 61 }, (_, i) => addDays(startOfDay(new Date()), i - 30));
  const todayIndex = 30;

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(todayIndex, true);

    emblaApi.on('select', () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedDate(days[index]);
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const index = days.findIndex(d => isSameDay(d, selectedDate));
    if (index !== -1 && index !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(index);
    }
  }, [selectedDate, emblaApi]);

  const incompleteTasks = tasks.filter(t => !t.isCompleted);

  return (
    <div className="min-h-screen pb-32 safe-area-top">
      <WeekCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {days.map((day) => (
            <div key={day.toISOString()} className="flex-[0_0_100%] min-w-0 p-4">
              <TabSwitch
                activeTab={activeTab}
                onTabChange={setActiveTab}
                todosCount={pendingCount > 0 ? pendingCount : undefined}
              />

              {activeTab === 'habits' ? (
                <div className="animate-fade-in space-y-4">
                  {habits.length > 0 && isSameDay(day, new Date()) && (
                    <ProgressBar percent={progressPercent} />
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
