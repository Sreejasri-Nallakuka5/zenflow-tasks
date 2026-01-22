import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ProgressRing } from '@/components/ProgressRing';
import { StatsCard } from '@/components/StatsCard';
import { NotesView } from '@/components/NotesView';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from 'date-fns';

export function StatsView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'activity' | 'notes'>('activity');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding for the first week
  const startDay = getDay(monthStart);
  const paddingDays = startDay === 0 ? 6 : startDay - 1;

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  // Mock data for demonstration
  const activeDays = [21, 22];
  const overallRate = 18.9;

  return (
    <div className="min-h-screen pb-32 safe-area-top">
      <div className="p-4">
        {/* Progress Ring */}
        <div className="flex justify-center py-8">
          <ProgressRing percent={overallRate} />
        </div>

        {/* Stats Cards */}
        <div className="bg-card rounded-2xl p-4 mb-6">
          <div className="flex justify-around mb-6">
            <StatsCard value={0} label="Streak days" />
            <div className="w-px bg-primary/30" />
            <StatsCard value={0} label="Perfect days" />
            <div className="w-px bg-primary/30" />
            <StatsCard
              value={2}
              label="Active days"
              icon={<Check className="w-4 h-4 text-primary" />}
            />
          </div>

          {/* Tab Switch */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('activity')}
                className={cn(
                  "font-medium transition-colors",
                  activeTab === 'activity' ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Activity
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => setActiveTab('notes')}
                className={cn(
                  "font-medium transition-colors",
                  activeTab === 'notes' ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Notes
              </button>
            </div>
            {activeTab === 'activity' && (
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="touch-feedback p-1">
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <span className="text-sm font-medium">
                  {format(currentMonth, 'MMMM')}
                </span>
                <button onClick={nextMonth} className="touch-feedback p-1">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'activity' ? (
            <>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-xs text-muted-foreground py-2">
                    {day}
                  </div>
                ))}

                {/* Padding cells */}
                {Array.from({ length: paddingDays }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}

                {/* Day cells */}
                {days.map((day, index) => {
                  const dayNum = day.getDate();
                  const isActive = activeDays.includes(dayNum);
                  const isTodayDate = isToday(day);

                  return (
                    <div
                      key={index}
                      className={cn(
                        "aspect-square flex items-center justify-center text-sm rounded-full transition-all",
                        isActive && "relative"
                      )}
                    >
                      <span className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full",
                        isActive && "border-2 border-primary text-foreground",
                        !isActive && isSameMonth(day, currentMonth) && "text-muted-foreground"
                      )}>
                        {dayNum}
                      </span>
                      {isActive && (
                        <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <NotesView />
          )}
        </div>

        {/* Motivational Footer - only show for activity tab */}
        {activeTab === 'activity' && (
          <div className="flex items-center justify-center gap-4 py-4">
            <span className="text-2xl">✊</span>
            <div className="flex-1 border-t border-dashed border-primary/50" />
            <p className="text-muted-foreground text-sm">Even small steps lead to big</p>
            <div className="flex-1 border-t border-dashed border-primary/50" />
            <span className="text-primary">✿</span>
          </div>
        )}
      </div>
    </div>
  );
}
