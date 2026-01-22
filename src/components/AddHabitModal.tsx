import { useState } from 'react';
import { X, ArrowLeft, Target } from 'lucide-react';
import { Category } from '@/types';
import { CategoryCard } from './CategoryCard';
import { HabitOption } from './HabitOption';
import { cn } from '@/lib/utils';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: { title: string; emoji: string; category: string; targetCount?: number }) => void;
}

const categories: Category[] = [
  { id: '1', name: 'Smart Habits', color: 'green', description: 'AI-powered suggestions' },
  { id: '2', name: 'Popular Habits', color: 'pink', description: 'Most used habits' },
  { id: '3', name: 'Morning Routine', color: 'cyan', description: 'Start your day right' },
  { id: '4', name: 'Health & Wellness', color: 'coral', description: 'Take care of yourself' },
  { id: '5', name: 'Mental Health', color: 'yellow', description: 'Peace of mind' },
  { id: '6', name: 'Productivity', color: 'orange', description: 'Get things done' },
  { id: '7', name: 'Sport', color: 'cyan', description: 'Stay active' },
  { id: '8', name: 'Personal Finance', color: 'green', description: 'Manage your money' },
];

const habitsByCategory: Record<string, { emoji: string; title: string }[]> = {
  'Popular Habits': [
    { emoji: '😴', title: 'Sleep for 8 hours' },
    { emoji: '🍏', title: 'Eat fruits and veggies' },
    { emoji: '💧', title: 'Drink 8 glasses of water' },
    { emoji: '📚', title: 'Read a book for 30 minutes' },
    { emoji: '💊', title: 'Take vitamins' },
    { emoji: '👨‍👩‍👧‍👦', title: 'Spend time with my family' },
    { emoji: '📵', title: 'Digital detox' },
    { emoji: '🏃', title: 'Exercise for 30 minutes' },
    { emoji: '🚶', title: 'Go for a walk' },
    { emoji: '🧘', title: 'Meditate for 10 minutes' },
  ],
  'Health & Wellness': [
    { emoji: '🍏', title: 'Eat fruits and veggies' },
    { emoji: '💧', title: 'Drink 8 glasses of water' },
    { emoji: '🥗', title: 'Eat a healthy meal' },
    { emoji: '🍳', title: 'Cook at home' },
    { emoji: '💊', title: 'Take vitamins' },
    { emoji: '🚿', title: 'Take a shower' },
    { emoji: '🌸', title: 'Deep breathing' },
    { emoji: '🧴', title: 'Skin care' },
    { emoji: '🏃', title: 'Exercise for 30 minutes' },
    { emoji: '🧘', title: 'Stretch for 10 minutes' },
  ],
};

export function AddHabitModal({ isOpen, onClose, onAddHabit }: AddHabitModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customEmoji, setCustomEmoji] = useState('✨');

  if (!isOpen) return null;

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      onClose();
    }
  };

  const handleAddHabit = (emoji: string, title: string) => {
    onAddHabit({ 
      emoji, 
      title, 
      category: selectedCategory?.name || 'Custom',
    });
    onClose();
  };

  const habits = selectedCategory ? habitsByCategory[selectedCategory.name] || [] : [];

  return (
    <div className="fixed inset-0 bg-background z-50 animate-slide-up overflow-y-auto">
      <div className="safe-area-top p-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="touch-feedback p-2">
            {selectedCategory ? (
              <ArrowLeft className="w-6 h-6 text-primary" />
            ) : (
              <X className="w-6 h-6 text-primary" />
            )}
          </button>
          <h2 className="text-xl font-semibold">
            {selectedCategory ? 'Pick a new one' : 'Pick a category'}
          </h2>
          <div className="w-10" />
        </div>

        {selectedCategory ? (
          <div className="stagger-children">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-1">{selectedCategory.name}</h3>
              <p className="text-muted-foreground text-sm">{selectedCategory.description}</p>
            </div>
            
            {habits.map((habit, index) => (
              <HabitOption
                key={index}
                emoji={habit.emoji}
                title={habit.title}
                onAdd={() => handleAddHabit(habit.emoji, habit.title)}
                color={cn(
                  selectedCategory.color === 'coral' && 'text-category-coral',
                  selectedCategory.color === 'pink' && 'text-category-pink',
                  selectedCategory.color === 'green' && 'text-category-green',
                  selectedCategory.color === 'cyan' && 'text-category-cyan',
                  selectedCategory.color === 'yellow' && 'text-category-yellow',
                  selectedCategory.color === 'orange' && 'text-category-orange',
                  selectedCategory.color === 'purple' && 'text-category-purple',
                )}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={setSelectedCategory}
              />
            ))}
          </div>
        )}

        <div className="mt-6 pb-8">
          <button
            onClick={() => {
              if (customTitle) {
                handleAddHabit(customEmoji, customTitle);
              }
            }}
            className="w-full py-4 bg-primary/80 text-primary-foreground rounded-xl font-semibold touch-feedback"
          >
            Create my own habit
          </button>
        </div>
      </div>
    </div>
  );
}
