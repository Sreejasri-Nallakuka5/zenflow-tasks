import { useState, useRef, useCallback } from 'react';

export function useLongPress(callback: () => void, ms = 500) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isLongPressActive = useRef(false);

    const start = useCallback((e: any) => {
        isLongPressActive.current = false;
        timerRef.current = setTimeout(() => {
            callback();
            isLongPressActive.current = true;
        }, ms);
    }, [callback, ms]);

    const stop = useCallback((e: any) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    const move = useCallback((e: any) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    return {
        onMouseDown: (e: any) => start(e),
        onMouseUp: (e: any) => stop(e),
        onMouseLeave: (e: any) => stop(e),
        onTouchStart: (e: any) => start(e),
        onTouchEnd: (e: any) => stop(e),
        onTouchMove: (e: any) => move(e),
        isLongPress: () => isLongPressActive.current
    };
}
