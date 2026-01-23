import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { format, startOfWeek, addDays, isSameDay, isToday, addWeeks, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function WeekCalendar({ selectedDate, onDateSelect }: WeekCalendarProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: false,
    containScroll: 'trimSnaps'
  });

  const baseDate = startOfDay(new Date());
  const weeks = Array.from({ length: 52 }, (_, i) => {
    const weekStart = addWeeks(startOfWeek(baseDate, { weekStartsOn: 1 }), i - 26);
    return Array.from({ length: 7 }, (_, d) => addDays(weekStart, d));
  });

  const [currentIndex, setCurrentIndex] = useState(26);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    });
    emblaApi.scrollTo(26, true);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const weekOfSelected = weeks.findIndex(week =>
      week.some(day => isSameDay(day, selectedDate))
    );
    if (weekOfSelected !== -1 && weekOfSelected !== currentIndex) {
      emblaApi.scrollTo(weekOfSelected);
    }
  }, [selectedDate, emblaApi, weeks, currentIndex]);

  const displayTitle = isToday(selectedDate)
    ? "Today"
    : format(selectedDate, 'EEEE, d MMMM');

  return (
    <div className="bg-background sticky top-0 z-40 pb-2 pt-4 px-4 border-b border-border/10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-handwritten font-bold text-foreground">
          {displayTitle}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={scrollNext}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
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
                      "flex flex-col items-center py-2 px-1 rounded-2xl transition-all duration-300 min-w-[40px] relative"
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
                      <div className="absolute top-[28px] w-10 h-10 border-2 border-primary/60 rounded-full -rotate-[12deg] skew-x-[-10deg] animate-scale-in" />
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
