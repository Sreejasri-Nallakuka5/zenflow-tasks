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
  { id: '3', name: 'Morning Routine', color: 'cyan', description: 'Start your day with a routine that energizes and focuses you.' },
  { id: '4', name: 'Health & Wellness', color: 'coral', description: 'Your body deserves the best care you can give it.' },
  { id: '5', name: 'Mental Health', color: 'yellow', description: 'Daily mindfulness is key to a healthier, happier you.' },
  { id: '6', name: 'Better Sleep', color: 'purple', description: 'Get better sleep to wake up feeling your best.' },
  { id: '7', name: 'Social Health', color: 'pink', description: 'Make friends who inspire and support you.' },
  { id: '8', name: 'Household Chores', color: 'orange', description: 'Keep your living space clean and organized.' },
  { id: '9', name: 'Personal Growth', color: 'cyan', description: 'Invest in yourself to reach your full potential.' },
  { id: '10', name: 'Productivity', color: 'purple', description: 'Boost your efficiency and get more done.' },
  { id: '11', name: 'Sports', color: 'orange', description: 'Stay active and energized with sports.' },
  { id: '12', name: 'Personal Finance', color: 'green', description: 'Manage your money and build wealth.' },
];

const habitsByCategory: Record<string, { emoji: string; title: string }[]> = {
  'Morning Routine': [
    { emoji: '⏰', title: 'Wake up early' },
    { emoji: '💧', title: 'Drink 8 glasses of water' },
    { emoji: '🥗', title: 'Eat a healthy meal' },
    { emoji: '🛏️', title: 'Make my bed' },
    { emoji: '💊', title: 'Take vitamins' },
    { emoji: '🪥', title: 'Brush & floss' },
    { emoji: '🚿', title: 'Take a shower' },
    { emoji: '🌸', title: 'Deep breathing' },
    { emoji: '🧴', title: 'Skin care' },
    { emoji: '🏃', title: 'Exercise for 30 minutes' },
    { emoji: '🧘', title: 'Meditate for 10 minutes' },
    { emoji: '💜', title: 'Gratitude practice' },
  ],
  'Health & Wellness': [
    { emoji: '🍏', title: 'Eat fruits and veggies' },
    { emoji: '💧', title: 'Drink 8 glasses of water' },
    { emoji: '🥗', title: 'Eat a healthy meal' },
    { emoji: '🍳', title: 'Cook at home' },
    { emoji: '💊', title: 'Take vitamins' },
    { emoji: '📵', title: 'Screen-free meals' },
    { emoji: '🚿', title: 'Take a shower' },
    { emoji: '🌸', title: 'Deep breathing' },
    { emoji: '🧴', title: 'Skin care' },
    { emoji: '🏃', title: 'Exercise for 30 minutes' },
    { emoji: '🚶', title: 'Go for a walk' },
    { emoji: '🧘', title: 'Stretch for 10 minutes' },
  ],
  'Mental Health': [
    { emoji: '😴', title: 'Sleep for 8 hours' },
    { emoji: '📱', title: 'Digital detox' },
    { emoji: '📵', title: 'Screen-free meals' },
    { emoji: '🌸', title: 'Deep breathing' },
    { emoji: '🚶', title: 'Go for a walk' },
    { emoji: '🧘', title: 'Meditate for 10 minutes' },
    { emoji: '📴', title: 'Social media-free weekend' },
    { emoji: '💜', title: 'Gratitude practice' },
    { emoji: '🖌️', title: 'Write in a journal' },
    { emoji: '🗣️', title: 'Practice affirmations' },
    { emoji: '💆', title: 'Get a massage' },
    { emoji: '🌍', title: 'Explore a new place' },
  ],
  'Better Sleep': [
    { emoji: '😴', title: 'Sleep for 8 hours' },
    { emoji: '💧', title: 'Drink 8 glasses of water' },
    { emoji: '🥗', title: 'Eat a healthy meal' },
    { emoji: '📚', title: 'Read a book for 30 minutes' },
    { emoji: '📱', title: 'Digital detox' },
    { emoji: '📵', title: 'Screen-free meals' },
    { emoji: '🪥', title: 'Brush & floss' },
    { emoji: '🚿', title: 'Take a shower' },
    { emoji: '🌸', title: 'Deep breathing' },
    { emoji: '🧴', title: 'Skin care' },
    { emoji: '🚶', title: 'Go for a walk' },
    { emoji: '🧘', title: 'Meditate for 10 minutes' },
  ],
  'Social Health': [
    { emoji: '👨‍👩‍👧‍👦', title: 'Spend time with my family' },
    { emoji: '📱', title: 'Digital detox' },
    { emoji: '📴', title: 'Social media-free weekend' },
    { emoji: '🎁', title: 'Make a gift' },
    { emoji: '🎉', title: 'Attend a local festival' },
    { emoji: '🧑‍🎨', title: 'Attend a workshop' },
    { emoji: '💜', title: 'Gratitude practice' },
    { emoji: '💬', title: 'Compliment to someone' },
    { emoji: '📞', title: 'Call my parents' },
    { emoji: '🤝', title: 'Talk to a friend' },
    { emoji: '🫂', title: 'Cuddle' },
    { emoji: '🙏', title: 'Send a thank-you note' },
  ],
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
  'Personal Growth': [
    { emoji: '📚', title: 'Read for 30 minutes' },
    { emoji: '🧠', title: 'Learn a new skill' },
    { emoji: '🎧', title: 'Listen to a podcast' },
    { emoji: '✍️', title: 'Journaling' },
    { emoji: '🎨', title: 'Practice a hobby' },
    { emoji: '🚀', title: 'Work on side project' },
  ],
  'Productivity': [
    { emoji: '📥', title: 'Clear inbox' },
    { emoji: '📝', title: 'Plan tomorrow' },
    { emoji: '⚡', title: 'Deep work session' },
    { emoji: '🎯', title: 'Review goals' },
    { emoji: '🧹', title: 'Clean workspace' },
    { emoji: '📵', title: 'Focus time' },
  ],
  'Sports': [
    { emoji: '💪', title: 'Gym workout' },
    { emoji: '🏃', title: 'Running' },
    { emoji: '🧘', title: 'Yoga session' },
    { emoji: '🏊', title: 'Swimming' },
    { emoji: '🏀', title: 'Team sport' },
    { emoji: '🚲', title: 'Cycling' },
  ],
  'Personal Finance': [
    { emoji: '📊', title: 'Track expenses' },
    { emoji: '💰', title: 'Review budget' },
    { emoji: '🛑', title: 'No spend day' },
    { emoji: '🏦', title: 'Save money' },
    { emoji: '📈', title: 'Check investments' },
    { emoji: '🎓', title: 'Read finance news' },
  ],
};

const categoryImages: Record<string, string> = {
  'Morning Routine': '/assets/habits/morning_routine.jpg',
  'Health & Wellness': '/assets/habits/health_wellness.jpg',
  'Mental Health': '/assets/habits/mental_health.jpg',
  'Better Sleep': '/assets/habits/better_sleep.png',
  'Social Health': '/assets/habits/social_health.jpg',
  'Personal Growth': '/assets/habits/personal_growth.jpg',
  'Productivity': '/assets/habits/productivity.jpg',
  'Sports': '/assets/habits/sports.jpg',
  'Personal Finance': '/assets/habits/personal_finance.jpg',
};

const categoryThemeColors: Record<string, string> = {
  'Morning Routine': 'border-blue-400',
  'Health & Wellness': 'border-red-400',
  'Mental Health': 'border-yellow-400',
  'Better Sleep': 'border-blue-300',
  'Social Health': 'border-purple-400',
  'Personal Growth': 'border-cyan-400',
  'Productivity': 'border-purple-500',
  'Sports': 'border-orange-400',
  'Personal Finance': 'border-green-400',
  'Smart Habits': 'border-emerald-400',
  'Popular Habits': 'border-pink-500',
  'Household Chores': 'border-orange-300',
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
  const categoryImage = selectedCategory ? categoryImages[selectedCategory.name] : null;
  const themeColor = selectedCategory ? (categoryThemeColors[selectedCategory.name] || '') : '';

  return (
    <div className="fixed inset-0 bg-background z-[100] animate-slide-up overflow-y-auto">
      <div className="safe-area-top p-4 min-h-screen flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="touch-feedback p-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h2 className="text-xl font-semibold">
            {selectedCategory ? 'Pick a new one' : 'Pick a category'}
          </h2>
          <div className="w-10" />
        </div>

        {selectedCategory ? (
          <div className="flex-1 pb-24">
            <div className="relative mb-8 pt-4">
              <div className="max-w-[70%]">
                <h3 className="text-3xl font-handwritten font-bold mb-2">{selectedCategory.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{selectedCategory.description}</p>
              </div>
              {categoryImage && (
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
                  <img src={categoryImage} alt={selectedCategory.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className={cn("mt-6 h-1 w-full rounded-full bg-secondary overflow-hidden")}>
                <div className={cn("h-full w-1/3 rounded-full bg-current", themeColor.replace('border-', 'bg-'))} />
              </div>
            </div>

            <div className="space-y-1">
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
          </div>
        ) : (
          <div className="flex-1 space-y-4 pb-24">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={setSelectedCategory}
              />
            ))}
          </div>
        )}

        {/* Highlighted "Create my own habit" at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/10">
          <button
            onClick={() => {
              if (customTitle) {
                handleAddHabit(customEmoji, customTitle);
              } else {
                // Potential for a custom input popup here if needed
                // For now just navigate to a custom creation if we had one
              }
            }}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 touch-feedback active:scale-[0.98] transition-all"
          >
            Create my own habit
          </button>
        </div>
      </div>
    </div>
  );
}
