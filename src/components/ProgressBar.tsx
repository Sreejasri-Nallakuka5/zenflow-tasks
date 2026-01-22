import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percent: number;
  className?: string;
}

export function ProgressBar({ percent, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="h-4 bg-secondary rounded-full overflow-hidden border-2 border-success/30">
        <div 
          className="h-full bg-success rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-right text-sm text-muted-foreground mt-2">
        {percent}% achieved
      </p>
    </div>
  );
}
