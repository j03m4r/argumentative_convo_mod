// lib/pageTimer.ts
let timeoutRef: NodeJS.Timeout | null = null;
let onCompleteRef: (() => void) | null = null;

export function schedulePageTransition(remainingMs: number, onComplete: () => void) {
    onCompleteRef = onComplete; // always update to latest callback
    if (timeoutRef) return; // but don't re-register the timeout
    
    timeoutRef = setTimeout(() => {
        timeoutRef = null;
        onCompleteRef?.();
        onCompleteRef = null;
    }, remainingMs);
}

export function clearPageTransition() {
    if (timeoutRef) {
        clearTimeout(timeoutRef);
        timeoutRef = null;
    }
    onCompleteRef = null;
}