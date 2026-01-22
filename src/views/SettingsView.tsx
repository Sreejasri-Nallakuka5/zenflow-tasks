import { Bell, Moon, Globe, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

function SettingItem({ icon, label, value, onClick }: SettingItemProps) {
  return (
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
        <ChevronRight className="w-5 h-5" />
      </div>
    </button>
  );
}

export function SettingsView() {
  return (
    <div className="min-h-screen pb-32 safe-area-top">
      <div className="p-4">
        <h1 className="text-3xl font-handwritten font-bold mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-card rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-lavender-dark flex items-center justify-center text-2xl font-bold text-primary-foreground">
            N
          </div>
          <div>
            <h2 className="text-xl font-semibold">NextMove User</h2>
            <p className="text-sm text-muted-foreground">Manage your profile</p>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-2 stagger-children">
          <SettingItem 
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            value="On"
          />
          <SettingItem 
            icon={<Moon className="w-5 h-5" />}
            label="Appearance"
            value="Dark"
          />
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
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-handwritten text-primary mb-2">NextMove</h3>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground mt-4">
            Your daily companion for building better habits
          </p>
        </div>

        {/* Logout Button */}
        <button className="w-full mt-8 py-4 flex items-center justify-center gap-2 text-destructive touch-feedback">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
