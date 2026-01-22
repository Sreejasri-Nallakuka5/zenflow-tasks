import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Star, ShoppingCart, Home, Briefcase, Heart, Activity, DollarSign, Gamepad2 } from 'lucide-react';
import { TaskItem } from '@/components/TaskItem';
import { AddButton } from '@/components/AddButton';
import { AddTaskModal } from '@/components/AddTaskModal';
import { useTasks } from '@/hooks/useTasks';
import { TaskFilter } from '@/types';
import { cn } from '@/lib/utils';

const filters: { id: TaskFilter; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'no-date', label: 'No date' },
  { id: 'completed', label: 'Completed' },
];

const categories = [
  { id: 'none', label: 'None', icon: Star, color: 'text-category-green' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingCart, color: 'text-category-pink' },
  { id: 'home', label: 'Home', icon: Home, color: 'text-category-orange' },
  { id: 'work', label: 'Work', icon: Briefcase, color: 'text-category-yellow' },
  { id: 'family', label: 'Family', icon: Heart, color: 'text-category-purple' },
  { id: 'health', label: 'Health', icon: Activity, color: 'text-category-coral' },
  { id: 'finances', label: 'Finances', icon: DollarSign, color: 'text-category-green' },
  { id: 'fun', label: 'Fun & Leisure', icon: Gamepad2, color: 'text-category-cyan' },
];

export function TasksView() {
  const { filteredTasks, filter, setFilter, addTask, toggleTask } = useTasks();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories.map(c => c.id)
  );
  const [isTodaySectionExpanded, setIsTodaySectionExpanded] = useState(true);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const deselectAll = () => {
    setSelectedCategories([]);
  };

  const handleApplyFilters = () => {
    setShowCategoryFilter(false);
  };

  // Filter tasks by selected categories
  const categoryFilteredTasks = filteredTasks.filter(task => {
    // If all categories are selected, show all tasks
    if (selectedCategories.length === categories.length) return true;
    // Otherwise filter by task category (you'll need to add category field to tasks)
    // For now, show all tasks
    return true;
  });

  return (
    <div className="min-h-screen pb-32 safe-area-top">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="flex items-center gap-2 touch-feedback"
          >
            <h1 className="text-3xl font-handwritten font-bold">All Tasks</h1>
            <ChevronDown className={cn(
              "w-5 h-5 text-muted-foreground transition-transform",
              showCategoryFilter && "rotate-180"
            )} />
          </button>
          <button className="text-foreground font-medium">Edit</button>
        </div>

        {/* Category Filter Dropdown */}
        {showCategoryFilter && (
          <div className="fixed inset-0 bg-background/95 z-50 animate-fade-in">
            <div className="p-4 safe-area-top">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Filter by Category</h2>
                <button
                  onClick={() => setShowCategoryFilter(false)}
                  className="text-muted-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategories.includes(category.id);

                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-card hover:bg-secondary/50 transition-all touch-feedback"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          category.color,
                          "bg-current/10"
                        )}>
                          <Icon className={cn("w-5 h-5", category.color)} />
                        </div>
                        <span className="font-medium text-foreground">{category.label}</span>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded flex items-center justify-center border-2 transition-all",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30"
                      )}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={deselectAll}
                  className="flex-1 py-3 rounded-xl bg-secondary text-foreground font-medium touch-feedback"
                >
                  Deselect All
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium touch-feedback"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={cn(
                "px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all touch-feedback",
                filter === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsTodaySectionExpanded(!isTodaySectionExpanded)}
          className="flex items-center gap-2 text-muted-foreground mb-4 touch-feedback"
        >
          <div className="w-8 border-t border-muted-foreground/30" />
          <span className="flex items-center gap-1">
            Today
            {isTodaySectionExpanded ? (
              <ChevronDown className="w-4 h-4 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform" />
            )}
          </span>
        </button>

        {isTodaySectionExpanded && (
          <div className="stagger-children animate-slide-down">
            {categoryFilteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
              />
            ))}
          </div>
        )}

        {categoryFilteredTasks.length === 0 && isTodaySectionExpanded && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No tasks found</p>
            <p className="text-sm mt-2">Add a new task to get started</p>
          </div>
        )}
      </div>

      <AddButton onClick={() => setShowAddTask(true)} variant="primary" />

      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        onAddTask={addTask}
      />
    </div>
  );
}
