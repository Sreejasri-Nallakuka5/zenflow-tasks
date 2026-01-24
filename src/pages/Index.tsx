import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { HomeView } from '@/views/HomeView';
import { TasksView } from '@/views/TasksView';
import { StatsView } from '@/views/StatsView';
import { SettingsView } from '@/views/SettingsView';
import { ViewType } from '@/types';

const Index = () => {
  const [activeView, setActiveView] = useState<ViewType>('home');

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'tasks':
        return <TasksView />;
      case 'stats':
        return <StatsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <main className="flex-1 relative overflow-hidden">
        {renderView()}
      </main>
      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
};

export default Index;
