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
  { id: '2', name: 'Popular Habits', color: 'purple', description: 'Most used habits' },
  { id: '3', name: 'Morning Routine', color: 'blue', description: 'Start your day right' },
  { id: '4', name: 'Health & Wellness', color: 'coral', description: 'Take care of your body' },
  { id: '5', name: 'Mental Health', color: 'yellow', description: 'Mindfulness and peace' },
  { id: '6', name: 'Better Sleep', color: 'grey', description: 'Rest and recover' },
  { id: '9', name: 'Personal Growth', color: 'lime', description: 'Invest in yourself' },
  { id: '10', name: 'Productivity', color: 'orange', description: 'Get things done' },
  { id: '11', name: 'Sport', color: 'cyan', description: 'Stay active' },
  { id: '7', name: 'Social Health', color: 'pink', description: 'Connect with others' },
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
  'Morning Routine': '☕',
  'Health & Wellness': '🥗',
  'Mental Health': '🧘',
  'Better Sleep': '😴',
  'Social Health': '🫂',
  'Personal Growth': '📚',
  'Productivity': '⚡',
  'Sport': '💪',
  'Smart Habits': '💡',
  'Popular Habits': '❤️',
};

// Map internal color names to the specific hex-like colors used in CategoryCard
const categoryColors: Record<string, string> = {
  'Smart Habits': 'green',
  'Popular Habits': 'purple',
  'Morning Routine': 'blue',
  'Health & Wellness': 'coral', // or red
  'Mental Health': 'yellow',
  'Better Sleep': 'grey', // or blue
  'Social Health': 'pink',
  'Personal Growth': 'lime',
  'Productivity': 'orange',
  'Sports': 'cyan', // or light blue
  'Personal Finance': 'green',
  'Household Chores': 'orange'
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
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customEmoji, setCustomEmoji] = useState('✨');

  if (!isOpen) return null;

  const handleBack = () => {
    if (showCustomForm) {
      setShowCustomForm(false);
    } else if (selectedCategory) {
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
    handleClose();
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setShowCustomForm(false);
    setCustomTitle('');
    setCustomEmoji('✨');
    onClose();
  };

  const habits = selectedCategory ? habitsByCategory[selectedCategory.name] || [] : [];
  const themeColor = selectedCategory ? (categoryThemeColors[selectedCategory.name] || '') : '';

  return (
    <div className="fixed inset-0 bg-background z-[100] animate-slide-up flex flex-col overflow-hidden">
      <div className="safe-area-top p-4 flex flex-col h-full relative">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <button onClick={handleBack} className="touch-feedback p-2">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h2 className="text-xl font-semibold">
            {showCustomForm ? 'Create custom habit' : selectedCategory ? 'Pick a new one' : 'Pick a category'}
          </h2>
          <button onClick={handleClose} className="touch-feedback p-2">
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
          {showCustomForm ? (
            <div className="animate-fade-in space-y-6 pt-4">
              <div className="bg-card p-6 rounded-3xl border-2 border-primary/20 shadow-sm transition-all focus-within:border-primary/50">
                <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Habit Details</p>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Icon</label>
                      <input
                        type="text"
                        value={customEmoji}
                        onChange={(e) => setCustomEmoji(e.target.value)}
                        className="w-16 h-16 text-3xl text-center bg-secondary rounded-2xl border-none focus:ring-4 focus:ring-primary/20 transition-all"
                        placeholder="✨"
                        maxLength={2}
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Name</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full h-16 px-6 bg-secondary rounded-2xl border-none focus:ring-4 focus:ring-primary/20 transition-all text-xl font-medium placeholder:text-muted-foreground/30"
                        placeholder="e.g. Morning Jog"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-sm text-primary font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Tip: A clear name helps you stay focused!
                </p>
              </div>
            </div>
          ) : selectedCategory ? (
            <div className="animate-fade-in">
              <div className="relative mb-8 pt-4">
                <div className="max-w-[70%]">
                  <h3 className="text-3xl font-bold mb-2">{selectedCategory.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{selectedCategory.description}</p>
                </div>
                <div className={cn("mt-6 h-1 w-full rounded-full bg-secondary overflow-hidden")}>
                  <div className={cn("h-full w-1/3 rounded-full bg-current shadow-[0_0_8px_rgba(0,0,0,0.1)]", themeColor.replace('border-', 'bg-'))} />
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
            <div className="space-y-4 animate-fade-in px-1">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={setSelectedCategory}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Button at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
          <button
            onClick={() => {
              if (showCustomForm) {
                if (customTitle.trim()) {
                  handleAddHabit(customEmoji || '✨', customTitle);
                }
              } else {
                setShowCustomForm(true);
              }
            }}
            disabled={showCustomForm && !customTitle.trim()}
            className={cn(
              "w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2",
              (showCustomForm && !customTitle.trim())
                ? "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-primary text-primary-foreground touch-feedback active:scale-[0.98] hover:shadow-primary/20"
            )}
          >
            {showCustomForm ? (
              <>
                <Target className="w-5 h-5" />
                <span>Create habit</span>
              </>
            ) : (
              <span>Create my own habit</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
