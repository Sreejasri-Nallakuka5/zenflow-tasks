import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TrackerProps {
    percent: number;
    className?: string;
}

export function Tracker({ percent, className }: TrackerProps) {
    const [displayPercent, setDisplayPercent] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (displayPercent < percent) {
                setDisplayPercent(prev => Math.min(prev + 1, percent));
            } else if (displayPercent > percent) {
                setDisplayPercent(prev => Math.max(prev - 1, percent));
            }
        }, 10);
        return () => clearTimeout(timer);
    }, [displayPercent, percent]);

    return (
        <div className={cn("w-full transition-all duration-500", className)}>
            <div className="relative h-6 bg-[#3b5c3b]/30 rounded-full overflow-hidden border border-[#3b5c3b]/50">
                <div
                    className="absolute inset-y-0 left-0 bg-[#8cb369] transition-all duration-500 ease-out"
                    style={{ width: `${displayPercent}%` }}
                />
            </div>
            <div className="mt-2 flex justify-end">
                <span className="text-sm font-medium text-muted-foreground/80">
                    {displayPercent}% achieved
                </span>
            </div>
        </div>
    );
}
