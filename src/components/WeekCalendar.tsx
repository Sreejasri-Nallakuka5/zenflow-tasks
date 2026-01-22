import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function WeekCalendar({ selectedDate, onDateSelect }: WeekCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const displayDate = isToday(selectedDate) 
    ? 'Today' 
    : format(selectedDate, 'd MMMM');

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

      <div className="flex justify-between gap-1 mb-4">
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 touch-feedback",
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
  );
}
