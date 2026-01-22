import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.79aa328801b44a6f9efe9e40f61cbf34',
  appName: 'NextMove',
  webDir: 'dist',
  server: {
    url: 'https://79aa3288-01b4-4a6f-9efe-9e40f61cbf34.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#a78bfa'
    }
  }
};

export default config;
