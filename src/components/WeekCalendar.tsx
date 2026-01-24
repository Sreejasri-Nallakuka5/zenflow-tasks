import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { format, startOfWeek, addDays, isSameDay, isToday, addWeeks, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function WeekCalendar({ selectedDate, onDateSelect }: WeekCalendarProps) {
  // Use Embla with dragFree: false for week-by-week snapping
  // Added watchDrag and duration for better responsiveness
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: false,
    containScroll: 'trimSnaps',
    startIndex: 26,
    watchDrag: true,
    duration: 30
  });

  const baseDate = startOfDay(new Date());
  // Pre-calculate weeks for the carousel
  const weeks = Array.from({ length: 52 }, (_, i) => {
    const weekStart = addWeeks(startOfWeek(baseDate, { weekStartsOn: 1 }), i - 26);
    return Array.from({ length: 7 }, (_, d) => addDays(weekStart, d));
  });

  useEffect(() => {
    if (!emblaApi) return;

    // Auto-scroll to the week containing the selectedDate if changed externally
    const weekOfSelected = weeks.findIndex(week =>
      week.some(day => isSameDay(day, selectedDate))
    );
    if (weekOfSelected !== -1 && weekOfSelected !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(weekOfSelected);
    }
  }, [selectedDate, emblaApi, weeks]);

  return (
    <div className="bg-background pb-4 px-2 overflow-hidden select-none touch-none">
      {/* Carousel Container */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex-[0_0_100%] flex justify-between gap-1 px-1">
              {week.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => onDateSelect(day)}
                    className={cn(
                      "flex flex-col items-center py-2 px-1 rounded-2xl transition-all duration-300 min-w-[42px] relative touch-feedback",
                      isSelected && "scale-105"
                    )}
                  >
                    <span className={cn(
                      "text-[10px] uppercase font-bold mb-1",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}>
                      {format(day, 'EEE')}
                    </span>
                    <div className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-full text-base font-bold transition-all relative z-10",
                      isSelected ? "text-primary" : "text-foreground",
                      isTodayDate && !isSelected && "text-primary"
                    )}>
                      {format(day, 'd')}
                    </div>
                    {isSelected && (
                      <div className="absolute top-[28px] w-11 h-11 border-[2.5px] border-primary/40 rounded-full -rotate-[15deg] skew-x-[-12deg] animate-scale-in" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
