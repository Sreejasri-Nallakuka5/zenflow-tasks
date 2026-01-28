export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications.');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
        new Notification(title, {
            icon: '/vite.svg', // Default icon
            ...options,
        });
    }
};

export const scheduleReminder = (title: string, body: string, delayInMs: number) => {
    setTimeout(() => {
        sendNotification(title, { body });
    }, delayInMs);
};

export const checkAndSendDailyReminder = (title: string, body: string) => {
    const isEnabled = localStorage.getItem('notifications-enabled') === 'true';
    if (!isEnabled) return;

    const lastSent = localStorage.getItem('last-notification-sent');
    const today = new Date().toDateString();

    if (lastSent !== today) {
        sendNotification(title, { body });
        localStorage.setItem('last-notification-sent', today);
    }
};
