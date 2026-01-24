import { Bell, Moon, Globe, Shield, HelpCircle, LogOut, ChevronRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

function SettingItem({ icon, label, value, onClick, children }: SettingItemProps) {
  return (
    <div className="w-full">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-4 border-b border-border/50 touch-feedback"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
            {icon}
          </div>
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {value && <span className="text-sm">{value}</span>}
          {children ? children : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>
    </div>
  );
}

export function SettingsView() {
  const [notifications, setNotifications] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userName, setUserName] = useState('Sreeja');

  const toggleNotifications = () => setNotifications(!notifications);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen pb-32 safe-area-top overflow-y-auto">
      <div className="p-4">
        <h1 className="text-3xl font-handwritten font-bold mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-card rounded-2xl border border-border/50 shadow-sm transition-all active:scale-[0.98] cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
            {userName.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{userName}</h2>
            <p className="text-sm text-muted-foreground">Manage your journey</p>
          </div>
          <button className="p-2 bg-secondary rounded-full">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Settings List */}
        <div className="bg-card rounded-3xl p-4 border border-border/50 space-y-1 stagger-children shadow-sm">
          <SettingItem
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            onClick={toggleNotifications}
          >
            <div className={cn(
              "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
              notifications ? "bg-primary" : "bg-muted"
            )}>
              <div className={cn(
                "w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                notifications ? "translate-x-6" : "translate-x-0"
              )} />
            </div>
          </SettingItem>

          <SettingItem
            icon={<Moon className="w-5 h-5" />}
            label="Dark Mode"
            onClick={toggleTheme}
          >
            <div className={cn(
              "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
              isDarkMode ? "bg-primary" : "bg-muted"
            )}>
              <div className={cn(
                "w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                isDarkMode ? "translate-x-6" : "translate-x-0"
              )} />
            </div>
          </SettingItem>

          <SettingItem
            icon={<Globe className="w-5 h-5" />}
            label="Language"
            value="English"
          />

          <SettingItem
            icon={<Shield className="w-5 h-5" />}
            label="Privacy"
          />

          <SettingItem
            icon={<HelpCircle className="w-5 h-5" />}
            label="Help & Support"
          />
        </div>

        {/* App Info */}
        <div className="mt-12 text-center animate-fade-in">
          <h3 className="text-3xl font-handwritten text-primary font-bold mb-2">NextMove</h3>
          <p className="text-sm text-muted-foreground font-medium">Version 1.2.4</p>
          <div className="max-w-[200px] mx-auto mt-4 py-3 px-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-xs text-primary/60 italic">
              "Every small step is a giant leap towards your better self."
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full mt-10 py-5 flex items-center justify-center gap-2 text-destructive bg-destructive/5 rounded-2xl border border-destructive/10 touch-feedback font-bold ring-offset-background focus:ring-2 focus:ring-destructive/20">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
