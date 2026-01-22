import { useState } from 'react';
import { X, Calendar, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (title: string, dueDate?: Date) => void;
}

export function AddTaskModal({ isOpen, onClose, onAddTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask(title.trim(), new Date());
      setTitle('');
      setNotes('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 animate-slide-up">
      <div className="safe-area-top p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onClose} className="touch-feedback p-2">
            <X className="w-6 h-6 text-primary" />
          </button>
          <button 
            onClick={handleSubmit}
            className={cn(
              "text-lg font-medium transition-colors",
              title.trim() ? "text-primary" : "text-muted-foreground"
            )}
          >
            Add
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-muted-foreground" />
          </div>

          <button className="flex items-center gap-2 text-muted-foreground mb-6">
            <Calendar className="w-5 h-5" />
            <span>Today</span>
          </button>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to do?"
            className="w-full text-center text-2xl font-handwritten bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-8"
            autoFocus
          />

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your thoughts or reasons"
            className="w-full h-40 bg-transparent border-none outline-none resize-none text-muted-foreground placeholder:text-muted-foreground/50"
            maxLength={500}
          />
          
          <div className="text-right w-full text-sm text-muted-foreground">
            {notes.length}/500
          </div>
        </div>
      </div>
    </div>
  );
}
