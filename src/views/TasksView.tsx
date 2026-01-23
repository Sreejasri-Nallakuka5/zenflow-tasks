import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Star, ShoppingCart, Home, Briefcase, Heart, Activity, DollarSign, Gamepad2, X } from 'lucide-react';
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

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

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setSelectedTasks([]);
    }
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
          <button
            onClick={handleEditToggle}
            className="text-foreground font-medium touch-feedback"
          >
            {isEditMode ? 'Done' : 'Edit'}
          </button>
        </div>

        {/* Category Filter Popup */}
        {showCategoryFilter && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-fade-in" onClick={() => setShowCategoryFilter(false)}>
            <div
              className="bg-background rounded-t-3xl w-full max-h-[80vh] flex flex-col animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-semibold">Filter by Category</h2>
                  <button
                    onClick={() => setShowCategoryFilter(false)}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center touch-feedback"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-4 space-y-2">
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

              <div className="p-4 border-t border-border flex gap-3">
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
              isEditMode ? (
                <div key={task.id} className="flex items-center gap-4 py-3">
                  <div
                    onClick={() => toggleTaskSelection(task.id)}
                    className={cn(
                      "w-6 h-6 rounded flex items-center justify-center border-2 transition-all touch-feedback",
                      selectedTasks.includes(task.id)
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {selectedTasks.includes(task.id) && (
                      <svg className="w-4 h-4 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="flex-1 font-medium">{task.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : ''}
                  </span>
                </div>
              ) : (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                />
              )
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
