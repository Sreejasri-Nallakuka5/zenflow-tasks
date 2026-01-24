import { Home, ListTodo, TrendingUp, Settings } from 'lucide-react';
import { ViewType } from '@/types';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems: { id: ViewType; icon: any; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'tasks', icon: ListTodo, label: 'Tasks' },
  { id: 'stats', icon: TrendingUp, label: 'Stats' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/60 backdrop-blur-xl border-t border-border/10 safe-area-bottom z-50">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full transition-all duration-300 touch-feedback",
                isActive ? "text-primary" : "text-muted-foreground/40"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-all duration-300",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              </div>
              <span className={cn(
                "text-[10px] font-bold mt-0.5 tracking-tight transition-all",
                isActive ? "opacity-100" : "opacity-0"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
