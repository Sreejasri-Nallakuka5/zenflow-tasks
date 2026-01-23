import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface GaugeProps {
    percent: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function Gauge({
    percent,
    size = 220,
    strokeWidth = 18,
    className
}: GaugeProps) {
    const [displayPercent, setDisplayPercent] = useState(0);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI; // Half circle
    const offset = circumference - (displayPercent / 100) * circumference;

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
        <div className={cn("relative inline-flex flex-col items-center justify-center", className)}>
            <svg width={size} height={size / 1.5} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`} className="transform rotate-0">
                {/* Background arc */}
                <path
                    d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    opacity="0.2"
                />
                {/* Progress arc */}
                <path
                    d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-300 ease-out"
                />
            </svg>
            <div className="absolute top-[40%] flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary">{displayPercent.toFixed(1)}%</span>
                <span className="text-sm font-medium text-muted-foreground mt-2">Overall rate</span>
            </div>
        </div>
    );
}
