import { Bell, Moon, Globe, Shield, HelpCircle, LogOut, ChevronRight, User, Play, Square, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types';
import { requestNotificationPermission, sendNotification } from '@/lib/notification-utils';

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

interface HabitListPopupProps {
  title: string;
  habits: Habit[];
  onClose: () => void;
  onStatusChange: (id: string, status: 'active' | 'stopped') => void;
  type: 'active' | 'stopped';
}

function HabitListPopup({ title, habits, onClose, onStatusChange, type }: HabitListPopupProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-card w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-border/50 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-handwritten font-bold text-primary">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {habits.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 italic">{t('no_tasks_found')}</p>
          ) : (
            habits.map(habit => (
              <div key={habit.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl border border-border/10 group">
                <span className="text-2xl">{habit.emoji}</span>
                <span className="font-medium flex-1">{habit.title}</span>
                <button
                  onClick={() => onStatusChange(habit.id, type === 'active' ? 'stopped' : 'active')}
                  className={cn(
                    "p-2 rounded-xl transition-all touch-feedback",
                    type === 'active'
                      ? "bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                      : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                  )}
                  title={type === 'active' ? 'Stop Habit' : 'Resume Habit'}
                >
                  {type === 'active' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {t('ok')}
        </button>
      </div>
    </div>
  );
}

interface LanguageSelectorPopupProps {
  currentLanguage: string;
  onSelect: (lang: any) => void;
  onClose: () => void;
}

const languages = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'es', label: 'Spanish', native: 'Español' },
  { id: 'fr', label: 'French', native: 'Français' },
  { id: 'de', label: 'German', native: 'Deutsch' },
  { id: 'it', label: 'Italian', native: 'Italiano' },
  { id: 'tr', label: 'Turkish', native: 'Türkçe' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা' },
  { id: 'mr', label: 'Marathi', native: 'मराठी' },
  { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { id: 'ur', label: 'Urdu', native: 'اردو' },
  { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { id: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { id: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

function LanguageSelectorPopup({ currentLanguage, onSelect, onClose }: LanguageSelectorPopupProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-card w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-border/50 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-handwritten font-bold text-primary">Select Language</h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ChevronRight className="w-6 h-6 rotate-90" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 gap-3">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => {
                onSelect(lang.id);
                onClose();
              }}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border-2 transition-all touch-feedback",
                currentLanguage === lang.id
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-secondary/30 border-transparent hover:border-border/50"
              )}
            >
              <div className="flex flex-col items-start">
                <span className="font-bold">{lang.label}</span>
                <span className="text-xs opacity-60">{lang.native}</span>
              </div>
              {currentLanguage === lang.id && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsView() {
  const { language, setLanguage, t } = useLanguage();
  const { activeHabits, stoppedHabits, updateHabitStatus } = useHabits();
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications-enabled') === 'true';
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userName] = useState('Sreeja');
  const [activePopup, setActivePopup] = useState<'active' | 'stopped' | 'language' | null>(null);

  const toggleNotifications = async () => {
    if (!notifications) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotifications(true);
        localStorage.setItem('notifications-enabled', 'true');
        sendNotification('Notifications Enabled!', { body: 'You will now receive daily reminders.' });
      }
    } else {
      setNotifications(false);
      localStorage.setItem('notifications-enabled', 'false');
    }
  };
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const currentLangLabel = languages.find(l => l.id === language)?.label || 'English';

  return (
    <div className="h-full overflow-y-auto pb-32 custom-scrollbar">
      <div className="p-4 min-h-full">
        <h1 className="text-3xl font-handwritten font-bold mb-8">{t('settings')}</h1>

        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-4 p-4 bg-card rounded-2xl border border-border/50 shadow-sm transition-all active:scale-[0.98] cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
            {userName.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{userName}</h2>
            <p className="text-sm text-muted-foreground">{t('manage_journey')}</p>
          </div>
          <button className="p-2 bg-secondary rounded-full">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Global Stats Summary (Small & Cute) */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="p-4 bg-card/50 rounded-2xl border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">{t('active_habits')}</p>
            <p className="text-xl font-bold text-primary">{activeHabits.length}</p>
          </div>
          <div className="p-4 bg-card/50 rounded-2xl border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">{t('stopped_habits')}</p>
            <p className="text-xl font-bold text-muted-foreground">{stoppedHabits.length}</p>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-card rounded-3xl p-4 border border-border/50 space-y-1 stagger-children shadow-sm">
          <SettingItem
            icon={<Bell className="w-5 h-5" />}
            label={t('notifications')}
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
            label={t('dark_mode')}
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
            label={t('language')}
            value={currentLangLabel}
            onClick={() => setActivePopup('language')}
          />

          <SettingItem
            icon={<Play className="w-5 h-5" />}
            label={t('active_habits')}
            onClick={() => setActivePopup('active')}
          />

          <SettingItem
            icon={<Square className="w-5 h-5" />}
            label={t('stopped_habits')}
            onClick={() => setActivePopup('stopped')}
          />

          <SettingItem
            icon={<Shield className="w-5 h-5" />}
            label={t('privacy')}
          />

          <SettingItem
            icon={<HelpCircle className="w-5 h-5" />}
            label={t('help_support')}
          />
        </div>

        {/* App Info */}
        <div className="mt-12 text-center animate-fade-in">
          <h3 className="text-3xl font-handwritten text-primary font-bold mb-2">ZenFlow</h3>
          <p className="text-sm text-muted-foreground font-medium">{t('version')} 1.2.5</p>
          <div className="max-w-[200px] mx-auto mt-4 py-3 px-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-xs text-primary/60 italic leading-relaxed">
              {t('quote')}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full mt-10 py-5 flex items-center justify-center gap-2 text-destructive bg-destructive/5 rounded-2xl border border-destructive/10 touch-feedback font-bold ring-offset-background focus:ring-2 focus:ring-destructive/20">
          <LogOut className="w-5 h-5" />
          <span>{t('sign_out')}</span>
        </button>
      </div>

      {/* Popups */}
      {activePopup === 'language' && (
        <LanguageSelectorPopup
          currentLanguage={language}
          onSelect={setLanguage}
          onClose={() => setActivePopup(null)}
        />
      )}

      {activePopup === 'active' && (
        <HabitListPopup
          title={t('active_habits')}
          habits={activeHabits}
          onStatusChange={updateHabitStatus}
          type="active"
          onClose={() => setActivePopup(null)}
        />
      )}
      {activePopup === 'stopped' && (
        <HabitListPopup
          title={t('stopped_habits')}
          habits={stoppedHabits}
          onStatusChange={updateHabitStatus}
          type="stopped"
          onClose={() => setActivePopup(null)}
        />
      )}
    </div>
  );
}
