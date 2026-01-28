import { useEffect } from 'react';
import { checkAndSendDailyReminder } from '@/lib/notification-utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function DailyReminder() {
    const { t } = useLanguage();

    useEffect(() => {
        // Check every hour (3600000 ms)
        const interval = setInterval(() => {
            checkAndSendDailyReminder(
                t('today'),
                t('quote')
            );
        }, 3600000);

        // Initial check
        checkAndSendDailyReminder(
            t('today'),
            t('quote')
        );

        return () => clearInterval(interval);
    }, [t]);

    return null;
}
