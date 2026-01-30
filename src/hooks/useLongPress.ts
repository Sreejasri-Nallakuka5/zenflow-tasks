import { useState, useRef, useCallback } from 'react';

export function useLongPress(callback: () => void, ms = 500) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isLongPressActive = useRef(false);
    const isMoved = useRef(false);

    const start = useCallback((e: any) => {
        isLongPressActive.current = false;
        isMoved.current = false;
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            if (!isMoved.current) {
                callback();
                isLongPressActive.current = true;
            }
        }, ms);
    }, [callback, ms]);

    const stop = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const move = useCallback(() => {
        isMoved.current = true;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    return {
        onMouseDown: (e: any) => start(e),
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: (e: any) => start(e),
        onTouchEnd: stop,
        onTouchMove: move,
        isLongPress: () => isLongPressActive.current
    };
}
