import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  percent: number;
  className?: string;
}

export function ProgressBar({ percent, className }: ProgressBarProps) {
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercent(percent);
    }, 100);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="w-full bg-secondary/30 rounded-full h-4 border-2 border-primary/20 p-0.5 overflow-hidden">
        <div
          className="h-full bg-primary/60 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${displayPercent}%` }}
        />
      </div>
      <div className="flex justify-end pr-1">
        <span className="text-xs font-handwritten font-medium text-muted-foreground/80 tracking-wide">
          {displayPercent}% achieved
        </span>
      </div>
    </div>
  );
}
