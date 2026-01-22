import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  onClick: (category: Category) => void;
}

const colorClasses = {
  green: 'border-category-green text-category-green',
  pink: 'border-category-pink text-category-pink',
  cyan: 'border-category-cyan text-category-cyan',
  coral: 'border-category-coral text-category-coral',
  yellow: 'border-category-yellow text-category-yellow',
  orange: 'border-category-orange text-category-orange',
  purple: 'border-category-purple text-category-purple',
};

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={() => onClick(category)}
      className={cn(
        "w-full p-5 rounded-2xl border-2 border-dashed text-left transition-all touch-feedback",
        "hover:bg-secondary/50 animate-slide-up",
        colorClasses[category.color]
      )}
      style={{
        borderStyle: 'dashed',
        borderWidth: '2px',
      }}
    >
      <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
    </button>
  );
}
