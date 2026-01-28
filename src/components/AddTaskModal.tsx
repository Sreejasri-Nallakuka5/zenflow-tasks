import { useState } from 'react';
import { X, Calendar, Bell, Repeat, Flag, Tag, Plus, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalogTimePicker } from './AnalogTimePicker';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (title: string, dueDate?: Date, options?: any) => void;
}

type Priority = 'None' | 'Low' | 'Medium' | 'High';
type Category = 'None' | 'Smart Habits' | 'Popular Habits' | 'Morning Routine' | 'Health & Wellness' | 'Mental Health' | 'Better Sleep' | 'Personal Growth' | 'Productivity' | 'Sport' | 'Social Health';

interface CategoryData {
  id: Category;
  label: string;
  color: string;
  image: string;
}

const categoriesData: CategoryData[] = [
  { id: 'Smart Habits', label: 'Smart Habits', color: '#4ade80', image: '/characters/bird1.png' }, // Green
  { id: 'Popular Habits', label: 'Popular Habits', color: '#a855f7', image: '/characters/bird2.png' }, // Purple
  { id: 'Morning Routine', label: 'Morning Routine', color: '#3b82f6', image: '/characters/bird3.png' }, // Blue
  { id: 'Health & Wellness', label: 'Health & Wellness', color: '#ef4444', image: '/characters/bird4.png' }, // Red
  { id: 'Mental Health', label: 'Mental Health', color: '#eab308', image: '/characters/bird5.png' }, // Yellow
  { id: 'Better Sleep', label: 'Better Sleep', color: '#94a3b8', image: '/characters/bird6.png' }, // Grey
  { id: 'Personal Growth', label: 'Personal Growth', color: '#84cc16', image: '/characters/bird7.png' }, // Lime
  { id: 'Productivity', label: 'Productivity', color: '#f97316', image: '/characters/bird8.png' }, // Orange
  { id: 'Sport', label: 'Sport', color: '#0ea5e9', image: '/characters/bird9.png' }, // Light Blue
  { id: 'Social Health', label: 'Social Health', color: '#ec4899', image: '/characters/bird10.png' }, // Pink
];

export function AddTaskModal({ isOpen, onClose, onAddTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('24 Jan');
  const [reminder, setReminder] = useState('Not set');
  const [autoPostpone, setAutoPostpone] = useState(false);
  const [repeat, setRepeat] = useState('None');
  const [priority, setPriority] = useState<Priority>('None');
  const [category, setCategory] = useState<Category>('None');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask(title.trim(), new Date(), {
        reminder,
        autoPostpone,
        priority,
        category,
        subtasks
      });
      // Reset
      setTitle('');
      setReminder('Not set');
      setAutoPostpone(false);
      setPriority('None');
      setCategory('None');
      setSubtasks([]);
      onClose();
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const priorities: Priority[] = ['None', 'Low', 'Medium', 'High'];

  return (
    <div className="fixed inset-0 bg-background z-[100] animate-slide-up overflow-y-auto">
      <div className="safe-area-top p-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onClose}
            className="text-foreground font-bold text-lg touch-feedback"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={cn(
              "text-lg font-bold transition-all touch-feedback",
              title.trim() ? "text-primary" : "text-muted-foreground/30"
            )}
          >
            Save
          </button>
        </div>

        <div className="flex-1 space-y-8">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Buy groceries"
            className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30 mb-2 font-handwritten"
            autoFocus
          />

          {/* Options Grid */}
          <div className="space-y-2">
            {/* Due Date */}
            <div className="flex items-center justify-between py-4 border-b border-border/10">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Due date</span>
              </div>
              <button className="px-3 py-1 rounded-xl bg-success/10 text-success text-sm font-bold border border-success/20">
                {dueDate}
              </button>
            </div>

            {/* Remind me */}
            <div className="flex items-center justify-between py-4 border-b border-border/10">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Remind me at</span>
              </div>
              <button
                onClick={() => setShowTimePicker(true)}
                className={cn(
                  "text-sm font-bold px-3 py-1 rounded-xl border transition-all",
                  reminder === 'Not set' ? "text-muted-foreground/30 border-border/10" : "text-primary bg-primary/10 border-primary/20"
                )}
              >
                {reminder}
              </button>
            </div>

            {/* Auto postpone */}
            <div className="flex items-center justify-between py-4 border-b border-border/10">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Auto postpone</span>
              </div>
              <button
                onClick={() => setAutoPostpone(!autoPostpone)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative touch-feedback border border-border/10",
                  autoPostpone ? "bg-primary" : "bg-muted/30"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm",
                    autoPostpone ? "translate-x-7" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {/* Repeat */}
            <div className="flex items-center justify-between py-4 border-b border-border/10">
              <div className="flex items-center gap-3">
                <Repeat className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Repeat</span>
              </div>
              <button className="text-muted-foreground/30 text-sm font-bold">
                {repeat}
              </button>
            </div>

            {/* Priority */}
            <div className="flex items-center justify-between py-4 border-b border-border/10">
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Priority</span>
              </div>
              <button
                onClick={() => setShowPriorityPopup(true)}
                className={cn(
                  "px-3 py-1 rounded-xl text-sm font-bold border transition-all",
                  priority === 'None' ? "text-muted-foreground/30 border-border/10" : "bg-primary/10 text-primary border-primary/20"
                )}
              >
                {priority}
              </button>
            </div>

            {/* Category */}
            <div className="flex items-center justify-between py-4 border-b border-border/10">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Category</span>
              </div>
              <button
                onClick={() => setShowCategoryPopup(true)}
                className={cn(
                  "px-3 py-1 rounded-xl text-sm font-bold border transition-all",
                  category === 'None' ? "text-muted-foreground/30 border-border/10" : "bg-primary/10 text-primary border-primary/20"
                )}
              >
                {category}
              </button>
            </div>
          </div>

          {/* Sub-tasks Section */}
          <div className="pt-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 mb-4">Sub-tasks</h3>
            <div className="space-y-3 mb-4">
              {subtasks.map((st, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl animate-scale-in">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-primary/40" />
                    <span className="font-medium text-foreground/80">{st}</span>
                  </div>
                  <button onClick={() => removeSubtask(i)} className="text-muted-foreground/40">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3 p-4 bg-secondary/10 rounded-2xl border border-dashed border-border/20">
                <Plus className="w-5 h-5 text-muted-foreground/30" />
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  placeholder="Add a sub-task"
                  className="w-full bg-transparent border-none outline-none text-sm font-medium placeholder:text-muted-foreground/20"
                />
              </div>
              <button
                onClick={handleAddSubtask}
                disabled={!newSubtask.trim()}
                className="p-4 bg-primary text-primary-foreground rounded-2xl disabled:opacity-30 touch-feedback shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* --- CUSTOM POPUPS --- */}

        {/* Analog Time Picker */}
        {showTimePicker && (
          <AnalogTimePicker
            initialTime={reminder === 'Not set' ? '09:00' : reminder}
            onConfirm={(time) => {
              setReminder(time);
              setShowTimePicker(false);
            }}
            onCancel={() => setShowTimePicker(false)}
          />
        )}

        {/* Small Centered Priority Popup */}
        {showPriorityPopup && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100] flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowPriorityPopup(false)}>
            <div className="bg-background rounded-[2rem] p-6 w-full max-w-[240px] animate-scale-in shadow-2xl border border-border/10" onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-black uppercase tracking-widest text-center text-muted-foreground/40 mb-4 italic">Priority</h3>
              <div className="flex flex-col gap-1">
                {priorities.map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setPriority(p);
                      setShowPriorityPopup(false);
                    }}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl font-bold text-center transition-all",
                      priority === p ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50 text-foreground/70"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Small Centered Category Popup */}
        {showCategoryPopup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowCategoryPopup(false)}>
            <div className="bg-[#1a1a1a] rounded-[2rem] p-6 w-full max-w-md max-h-[85vh] overflow-y-auto animate-scale-in shadow-2xl border border-border/10 custom-scrollbar" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h3 className="text-xl font-bold text-foreground">
                  Pick a category
                </h3>
                <button onClick={() => setShowCategoryPopup(false)} className="p-2 hover:bg-muted/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex flex-col gap-4 pr-1">
                {categoriesData.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategory(c.id);
                      setShowCategoryPopup(false);
                    }}
                    style={{
                      borderColor: c.color,
                      color: c.color
                    }}
                    className={cn(
                      "group relative w-full h-[80px] rounded-2xl border-2 flex items-center justify-between px-6 overflow-hidden transition-all duration-300",
                      category === c.id ? "bg-opacity-10" : "hover:bg-muted/5 bg-transparent"
                    )}
                  >
                    {/* Background tint when selected */}
                    {category === c.id && (
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundColor: c.color }}
                      />
                    )}

                    <span className="text-lg font-bold z-10 text-white">{c.label}</span>

                    <div className="relative w-16 h-16 z-10 transform translate-x-2 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={c.image}
                        alt={c.label}
                        className="w-full h-full object-contain drop-shadow-lg"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
