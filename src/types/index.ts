export interface Habit {
  id: string;
  title: string;
  emoji: string;
  category: string;
  targetCount?: number;
  currentCount?: number;
  isCompleted: boolean;
  status: 'active' | 'stopped';
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate?: Date;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: 'green' | 'pink' | 'cyan' | 'coral' | 'yellow' | 'orange' | 'purple' | 'blue' | 'lime' | 'grey';
  description: string;
}

export interface DayStats {
  date: Date;
  completedHabits: number;
  totalHabits: number;
  completedTasks: number;
  totalTasks: number;
}

export type TabType = 'habits' | 'todos';
export type ViewType = 'home' | 'tasks' | 'stats' | 'settings';
export type TaskFilter = 'upcoming' | 'no-date' | 'completed';
