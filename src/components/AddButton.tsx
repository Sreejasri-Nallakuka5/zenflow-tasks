import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'primary' | 'outlined';
  className?: string;
}

export function AddButton({ onClick, label, variant = 'outlined', className }: AddButtonProps) {
  if (variant === 'primary') {
    return (
      <button
        onClick={onClick}
        className={cn(
          "fixed bottom-24 right-6 w-14 h-14 bg-success rounded-xl flex items-center justify-center shadow-lg touch-feedback z-40",
          "animate-scale-in hover:scale-105 transition-transform",
          className
        )}
      >
        <Plus className="w-7 h-7 text-white" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-success/20 text-success font-medium touch-feedback",
        "transition-all hover:bg-success/30",
        className
      )}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}
