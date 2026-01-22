import { TabType } from '@/types';
import { cn } from '@/lib/utils';

interface TabSwitchProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  habitsCount?: number;
  todosCount?: number;
}

export function TabSwitch({ activeTab, onTabChange, habitsCount, todosCount }: TabSwitchProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onTabChange('habits')}
        className={cn(
          "flex-1 py-3 px-4 rounded-xl font-handwritten text-xl transition-all duration-300 touch-feedback",
          activeTab === 'habits'
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground"
        )}
      >
        Habits
      </button>
      <button
        onClick={() => onTabChange('todos')}
        className={cn(
          "flex-1 py-3 px-4 rounded-xl font-handwritten text-xl transition-all duration-300 touch-feedback relative",
          activeTab === 'todos'
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground"
        )}
      >
        To do
        {todosCount !== undefined && todosCount > 0 && (
          <sup className="ml-1 text-sm">{todosCount}</sup>
        )}
      </button>
    </div>
  );
}
