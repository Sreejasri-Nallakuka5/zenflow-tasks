import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  image?: string;
  onClick: (category: Category) => void;
}

const colorClasses: Record<string, { border: string, bg: string, text: string }> = {
  green: { border: 'border-category-green', bg: 'bg-category-green/10', text: 'text-category-green' },
  pink: { border: 'border-category-pink', bg: 'bg-category-pink/10', text: 'text-category-pink' },
  cyan: { border: 'border-category-cyan', bg: 'bg-category-cyan/10', text: 'text-category-cyan' },
  coral: { border: 'border-category-coral', bg: 'bg-category-coral/10', text: 'text-category-coral' },
  yellow: { border: 'border-category-yellow', bg: 'bg-category-yellow/10', text: 'text-category-yellow' },
  orange: { border: 'border-category-orange', bg: 'bg-category-orange/10', text: 'text-category-orange' },
  purple: { border: 'border-category-purple', bg: 'bg-category-purple/10', text: 'text-category-purple' },
  blue: { border: 'border-blue-200', bg: 'bg-blue-200/5', text: 'text-blue-200' },
  lime: { border: 'border-lime-200', bg: 'bg-lime-200/5', text: 'text-lime-200' },
  grey: { border: 'border-slate-200', bg: 'bg-slate-200/5', text: 'text-slate-200' },
};

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const colorKey = category.color.replace('text-category-', '').replace('border-category-', '');
  const theme = colorClasses[colorKey] || colorClasses.green;

  return (
    <button
      onClick={() => onClick(category)}
      className={cn(
        "group relative w-full h-[72px] rounded-[16px] border-[1.5px] flex items-center justify-between px-6 transition-all duration-300 touch-feedback hover:bg-muted/10 bg-white shadow-sm",
        theme.border
      )}
    >
      <div className="flex flex-col items-start">
        <span className="text-lg font-bold text-foreground tracking-tight">{category.name}</span>
        <span className="text-xs text-muted-foreground line-clamp-1">{category.description}</span>
      </div>

      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", theme.bg)}>
        <div className={cn("w-2 h-2 rounded-full", theme.text.replace('text-', 'bg-'))} />
      </div>
    </button>
  );
}
