import { cn } from '@/lib/utils';

interface StatsCardProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({ value, label, icon, className }: StatsCardProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="flex items-center justify-center gap-1">
        <span className="text-2xl font-bold text-primary">{value}</span>
        {icon}
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
