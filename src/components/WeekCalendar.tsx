import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfYear, endOfYear, eachDayOfInterval, isSameDay, isToday, startOfMonth, isSameMonth } from 'date-fns';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function WeekCalendar({ selectedDate, onDateSelect }: WeekCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLButtonElement>(null);

  const currentYear = new Date().getFullYear();
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 11, 31));
  const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });

  // Auto-scroll to today on mount
  useEffect(() => {
    if (todayRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const todayElement = todayRef.current;
      const scrollPosition = todayElement.offsetLeft - (container.clientWidth / 2) + (todayElement.clientWidth / 2);
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, []);

  const displayDate = isToday(selectedDate)
    ? 'Today'
    : format(selectedDate, 'd MMMM');

  // Group days by month for rendering month headers
  const daysByMonth: { month: Date; days: Date[] }[] = [];
  let currentMonth: Date | null = null;
  let currentDays: Date[] = [];

  allDays.forEach((day, index) => {
    if (!currentMonth || !isSameMonth(day, currentMonth)) {
      if (currentMonth) {
        daysByMonth.push({ month: currentMonth, days: currentDays });
      }
      currentMonth = day;
      currentDays = [day];
    } else {
      currentDays.push(day);
    }

    if (index === allDays.length - 1) {
      daysByMonth.push({ month: currentMonth, days: currentDays });
    }
  });

  return (
    <div className="animate-slide-down">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 mb-4 touch-feedback"
      >
        <h1 className="text-3xl font-handwritten font-bold text-foreground">
          {displayDate}
        </h1>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto mb-4 pb-2 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex gap-6">
            {daysByMonth.map(({ month, days }) => (
              <div key={month.toISOString()} className="flex-shrink-0">
                {/* Month Header */}
                <div className="text-xs font-semibold text-primary mb-2 px-2">
                  {format(month, 'MMMM')}
                </div>

                {/* Days in Month */}
                <div className="flex gap-1">
                  {days.map((day) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);

                    return (
                      <button
                        key={day.toISOString()}
                        ref={isTodayDate ? todayRef : null}
                        onClick={() => onDateSelect(day)}
                        className={cn(
                          "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 touch-feedback flex-shrink-0",
                          isSelected && "relative"
                        )}
                      >
                        <span className={cn(
                          "text-xs font-medium mb-1",
                          isSelected ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {format(day, 'EEE')}
                        </span>
                        <span className={cn(
                          "text-lg font-semibold w-8 h-8 flex items-center justify-center rounded-full transition-all",
                          isSelected && "text-primary",
                          isTodayDate && !isSelected && "text-primary/70"
                        )}>
                          {format(day, 'd')}
                        </span>
                        {isSelected && (
                          <svg
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            viewBox="0 0 50 60"
                          >
                            <ellipse
                              cx="25"
                              cy="40"
                              rx="18"
                              ry="14"
                              fill="none"
                              stroke="hsl(var(--primary))"
                              strokeWidth="2"
                              className="animate-scale-in"
                              style={{
                                strokeDasharray: '4 3',
                                transform: 'rotate(-5deg)',
                                transformOrigin: 'center'
                              }}
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
