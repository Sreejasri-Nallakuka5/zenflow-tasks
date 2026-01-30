import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, Award } from 'lucide-react';
import { Gauge } from '@/components/Gauge';
import { StatsCard } from '@/components/StatsCard';
import { NotesView } from '@/components/NotesView';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, isSameDay } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';

export function StatsView() {
  const { t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'activity' | 'notes'>('activity');

  const { data: stats = { streak: 0, perfectDays: 0, activeDays: 0, overallRate: 0, activityData: {} } } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = getDay(monthStart);
  const paddingDays = startDay === 0 ? 6 : startDay - 1;

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const activityData = stats.activityData || {};
  const overallRate = stats.overallRate || 0;

  return (
    <div className="h-full pb-32 bg-background flex flex-col items-center p-6 pt-12 overflow-y-auto overflow-x-hidden">
      {/* Overall Rate Gauge */}
      <Gauge percent={overallRate} className="mb-12 flex-shrink-0" />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-1 w-full mb-12 flex-shrink-0">
        <StatsCard value={stats.streak} label={t('streak_days')} icon={<Check className="w-3 h-3 text-primary" />} />
        <div className="w-px h-10 bg-border/30 self-center justify-self-center" />
        <StatsCard value={stats.perfectDays} label={t('perfect_days')} icon={<Award className="w-3 h-3 text-primary" />} />
        <div className="w-px h-10 bg-border/30 self-center justify-self-center" />
        <StatsCard value={stats.activeDays} label={t('active_days')} icon={<div className="w-3 h-3 bg-primary rounded-sm" />} />
      </div>

      <div className="w-full bg-card/30 rounded-[2.5rem] p-6 border border-border/20 flex-shrink-0 mb-8">
        {/* Tab Switch */}
        <div className="flex items-center gap-6 mb-8 border-b border-border/10 pb-4">
          <button
            onClick={() => setActiveTab('activity')}
            className={cn(
              "text-lg font-bold transition-all relative",
              activeTab === 'activity' ? "text-foreground" : "text-muted-foreground/40"
            )}
          >
            {t('activity')}
            {activeTab === 'activity' && (
              <div className="absolute -bottom-4 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={cn(
              "text-lg font-bold transition-all relative",
              activeTab === 'notes' ? "text-foreground" : "text-muted-foreground/40"
            )}
          >
            {t('notes_tab')}
            {activeTab === 'notes' && (
              <div className="absolute -bottom-4 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {activeTab === 'activity' ? (
          <div className="animate-fade-in">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-8 px-2">
              <button onClick={prevMonth} className="p-2 bg-secondary/50 rounded-full active:scale-95 transition-all">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h2 className="text-xl font-bold">
                {format(currentMonth, 'MMMM')}
              </h2>
              <button onClick={nextMonth} className="p-2 bg-secondary/50 rounded-full active:scale-95 transition-all">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-6">
              {[t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')].map(day => (
                <div key={day} className="text-center text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
                  {day}
                </div>
              ))}

              {Array.from({ length: paddingDays }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}

              {days.map((day, index) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const completion = activityData[dateKey] || 0;
                const isPerfect = completion >= 100;
                const radius = 18;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (completion / 100) * circumference;

                return (
                  <div key={index} className="flex items-center justify-center relative aspect-square">
                    {completion > 0 && !isPerfect && (
                      <svg className="absolute w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r={radius}
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          className="transition-all duration-500"
                        />
                      </svg>
                    )}

                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold relative z-10",
                      completion > 0 && "bg-secondary/30",
                      isPerfect && "bg-transparent"
                    )}>
                      {isPerfect ? (
                        <div className="relative group touch-feedback">
                          <svg className="w-9 h-9 text-primary animate-scale-in" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M6 6C7.1 6 8 6.9 8 8C8 9.1 7.1 10 6 10C4.9 10 4 9.1 4 8C4 6.9 4.9 6 6 6M18 6C19.1 6 20 6.9 20 8C20 9.1 19.1 10 18 10C16.9 10 16 9.1 16 8C16 6.9 16.9 6 18 6M7 16C7 14.3 8.3 13 10 13H14C15.7 13 17 14.3 17 16V18C17 19.7 15.7 21 14 21H10C8.3 21 7 19.7 7 18V16Z" opacity="0.8" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-primary-foreground transform rotate-[-10deg]">
                            DONE
                          </div>
                        </div>
                      ) : (
                        <span className={cn(
                          completion > 0 ? "text-foreground" : "text-muted-foreground/30"
                        )}>
                          {day.getDate()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* King Crown Badge Footer */}
            <div className="mt-12 flex justify-center">
              <div className="relative p-4 rounded-full bg-primary/10 border border-primary/20 animate-bounce-soft">
                <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <NotesView />
        )}
      </div>
    </div>
  );
}
