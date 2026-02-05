import { useEffect, useRef } from 'react';

export function useInactivityTimer(timeoutMs: number, onTimeout: () => void, deps: unknown[]) {
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      onTimeout();
    }, timeoutMs);

    return () => window.clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
