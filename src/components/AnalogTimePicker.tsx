import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnalogTimePickerProps {
    onConfirm: (time: string) => void;
    onCancel: () => void;
    initialTime?: string;
}

export function AnalogTimePicker({ onConfirm, onCancel, initialTime = '09:00' }: AnalogTimePickerProps) {
    const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
    const [hours, setHours] = useState(parseInt(initialTime.split(':')[0]) || 9);
    const [minutes, setMinutes] = useState(parseInt(initialTime.split(':')[1]) || 0);

    const clockRef = useRef<HTMLDivElement>(null);

    const handleClockClick = (e: React.MouseEvent | React.TouchEvent) => {
        if (!clockRef.current) return;
        const rect = clockRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        const dx = clientX - centerX;
        const dy = clientY - centerY;

        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        angle = (angle + 90 + 360) % 360; // Offset to make 0deg at the top

        if (mode === 'hours') {
            let h = Math.round(angle / 30) % 12;
            if (h === 0) h = 12;
            setHours(h);
            // Auto-switch to minutes after choosing hour
            setTimeout(() => setMode('minutes'), 300);
        } else {
            let m = Math.round(angle / 6) % 60;
            setMinutes(m);
        }
    };

    const confirmSelection = () => {
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        onConfirm(`${formattedHours}:${formattedMinutes}`);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fade-in" onClick={onCancel}>
            <div className="bg-background rounded-[2.5rem] p-8 w-full max-w-sm animate-scale-in shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-8 text-center text-foreground/80">Add reminder</h3>

                {/* Time Display */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    <button
                        onClick={() => setMode('hours')}
                        className={cn(
                            "w-24 h-24 rounded-3xl text-4xl font-black flex items-center justify-center transition-all shadow-sm",
                            mode === 'hours' ? "bg-primary text-primary-foreground scale-110" : "bg-secondary text-foreground/40"
                        )}
                    >
                        {hours.toString().padStart(2, '0')}
                    </button>
                    <span className="text-4xl font-black text-foreground/20">:</span>
                    <button
                        onClick={() => setMode('minutes')}
                        className={cn(
                            "w-24 h-24 rounded-3xl text-4xl font-black flex items-center justify-center transition-all shadow-sm",
                            mode === 'minutes' ? "bg-primary text-primary-foreground scale-110" : "bg-secondary text-foreground/40"
                        )}
                    >
                        {minutes.toString().padStart(2, '0')}
                    </button>
                </div>

                {/* Clock Face */}
                <div
                    ref={clockRef}
                    className="relative w-64 h-64 mx-auto bg-secondary/30 rounded-full mb-10 cursor-pointer touch-none select-none"
                    onClick={handleClockClick}
                    onTouchStart={handleClockClick}
                    onTouchMove={handleClockClick}
                >
                    {/* Central Dot */}
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-20" />

                    {/* Hand */}
                    <div
                        className="absolute top-1/2 left-1/2 w-1 bg-primary origin-bottom transition-all duration-300 pointer-events-none"
                        style={{
                            height: '80px',
                            transform: `translate(-50%, -100%) rotate(${(mode === 'hours' ? hours * 30 : minutes * 6)}deg)`
                        }}
                    >
                        <div className="absolute -top-4 -left-3.5 w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                    </div>

                    {/* Digits */}
                    {mode === 'hours' ? (
                        [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => {
                            const angle = (i * 30) - 90;
                            const x = 50 + 40 * Math.cos(angle * (Math.PI / 180));
                            const y = 50 + 40 * Math.sin(angle * (Math.PI / 180));
                            return (
                                <div
                                    key={h}
                                    className={cn(
                                        "absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-sm font-bold transition-colors pointer-events-none",
                                        hours === h ? "text-primary" : "text-muted-foreground/30"
                                    )}
                                    style={{ left: `${x}%`, top: `${y}%` }}
                                >
                                    {h}
                                </div>
                            );
                        })
                    ) : (
                        [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m, i) => {
                            const angle = (i * 30) - 90;
                            const x = 50 + 40 * Math.cos(angle * (Math.PI / 180));
                            const y = 50 + 40 * Math.sin(angle * (Math.PI / 180));
                            return (
                                <div
                                    key={m}
                                    className={cn(
                                        "absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-sm font-bold transition-colors pointer-events-none",
                                        minutes === m ? "text-primary" : "text-muted-foreground/30"
                                    )}
                                    style={{ left: `${x}%`, top: `${y}%` }}
                                >
                                    {m === 0 ? '00' : m}
                                </div>
                            );
                        })
                    )}
                </div>

                <p className="text-xs text-center text-muted-foreground/40 mb-8 italic">
                    Reminder time is approximate. To make it exact, <span className="underline">go to settings</span>.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-6">
                    <button
                        onClick={onCancel}
                        className="text-muted-foreground font-bold touch-feedback px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmSelection}
                        className="text-primary font-bold touch-feedback px-4 py-2"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
