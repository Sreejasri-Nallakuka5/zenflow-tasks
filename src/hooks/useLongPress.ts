import { useState, useRef, useCallback } from 'react';

export function useLongPress(callback: () => void, ms = 500) {
    const [isPressing, setIsPressing] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(() => {
        setIsPressing(true);
        timerRef.current = setTimeout(() => {
            callback();
            setIsPressing(false);
        }, ms);
    }, [callback, ms]);

    const stop = useCallback(() => {
        setIsPressing(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
    };
}
