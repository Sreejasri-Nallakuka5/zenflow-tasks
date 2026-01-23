import { useState } from 'react';
import { X, Calendar, Bell, Repeat, Flag, Tag, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (title: string, dueDate?: Date) => void;
}

export function AddTaskModal({ isOpen, onClose, onAddTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('23 Jan');
  const [reminder, setReminder] = useState('Not set');
  const [autoPostpone, setAutoPostpone] = useState(false);
  const [repeat, setRepeat] = useState('None');
  const [priority, setPriority] = useState('None');
  const [category, setCategory] = useState('None');
  const [subtasks, setSubtasks] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask(title.trim(), new Date());
      setTitle('');
      setDueDate('23 Jan');
      setReminder('Not set');
      setAutoPostpone(false);
      setRepeat('None');
      setPriority('None');
      setCategory('None');
      setSubtasks([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 animate-slide-up overflow-y-auto">
      <div className="safe-area-top p-4 min-h-screen flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="text-primary font-medium text-lg touch-feedback"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={cn(
              "text-lg font-medium transition-colors touch-feedback",
              title.trim() ? "text-primary" : "text-muted-foreground"
            )}
          >
            Save
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Buy groceries"
            className="w-full text-2xl font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-4"
            autoFocus
          />

          {/* Due Date */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-foreground">Due date</span>
            <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-success/20 text-success font-medium touch-feedback">
              {dueDate}
            </button>
          </div>

          {/* Remind me at */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-foreground">Remind me at</span>
            <button className="text-muted-foreground touch-feedback">
              {reminder}
            </button>
          </div>

          {/* Auto postpone */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-foreground">Auto postpone</span>
            <button
              onClick={() => setAutoPostpone(!autoPostpone)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative touch-feedback",
                autoPostpone ? "bg-primary" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform",
                  autoPostpone ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>

          {/* Repeat */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Repeat className="w-5 h-5 text-muted-foreground opacity-50" />
              <span className="text-muted-foreground">Repeat</span>
            </div>
            <button className="text-muted-foreground touch-feedback">
              {repeat}
            </button>
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-foreground">Priority</span>
            <button className="px-3 py-1 rounded-lg bg-success/20 text-success font-medium touch-feedback">
              {priority}
            </button>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-foreground">Category</span>
            <button className="px-3 py-1 rounded-lg bg-success/20 text-success font-medium touch-feedback">
              {category}
            </button>
          </div>

          {/* Sub-tasks */}
          <div className="py-3 border-b border-border">
            <span className="text-foreground block mb-3">Sub-tasks:</span>
            <button className="flex items-center gap-2 text-muted-foreground touch-feedback">
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <span>+ Add new sub-task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
