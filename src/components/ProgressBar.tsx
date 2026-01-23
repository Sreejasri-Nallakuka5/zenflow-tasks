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
    <div className={cn("w-full bg-secondary/50 rounded-full h-3 overflow-hidden", className)}>
      <div
        className="h-full bg-primary transition-all duration-1000 ease-out"
        style={{ width: `${displayPercent}%` }}
      />
    </div>
  );
}
