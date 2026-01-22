import { Home, ListTodo, TrendingUp, Settings } from 'lucide-react';
import { ViewType } from '@/types';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems: { id: ViewType; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'tasks', icon: ListTodo, label: 'Tasks' },
  { id: 'stats', icon: TrendingUp, label: 'Stats' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border safe-area-bottom z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 touch-feedback",
                isActive 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive && "bg-primary text-primary-foreground animate-scale-in"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
