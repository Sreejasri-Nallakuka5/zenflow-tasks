import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { HomeView } from '@/views/HomeView';
import { TasksView } from '@/views/TasksView';
import { StatsView } from '@/views/StatsView';
import { SettingsView } from '@/views/SettingsView';
import { ViewType } from '@/types';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get view from path, default to 'home'
  const activeView = (location.pathname.substring(1) || 'home') as ViewType;

  const setActiveView = (view: ViewType) => {
    if (view === 'home') {
      navigate('/');
    } else {
      navigate(`/${view}`);
    }
  };

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
      <main className="flex-1 relative overflow-y-auto">
        {renderView()}
      </main>
      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
};

export default Index;
