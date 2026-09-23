import { useCallback, useEffect, useState } from 'react';
import { clearAttempts, readLimit, recordAttempt, secondsUntil } from '../utils/attemptLimit';

export function useAttemptLimit(scope) {
  const [state, setState] = useState(() => {
    const stored = readLimit(scope);

    if (stored.lockedUntil > Date.now()) {
      return { until: stored.lockedUntil, remaining: secondsUntil(stored.lockedUntil) };
    }

    return { until: 0, remaining: 0 };
  });

  useEffect(() => {
    if (!state.until) return undefined;

    const tick = () => {
      setState((current) => {
        const remaining = secondsUntil(current.until);
        return { until: remaining > 0 ? current.until : 0, remaining };
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [state.until]);

  const record = useCallback(() => {
    const next = recordAttempt(scope);

    if (next.lockedUntil > Date.now()) {
      setState({ until: next.lockedUntil, remaining: secondsUntil(next.lockedUntil) });
      return next.lockedUntil;
    }

    return 0;
  }, [scope]);

  const clear = useCallback(() => {
    clearAttempts(scope);
    setState({ until: 0, remaining: 0 });
  }, [scope]);

  return {
    locked: state.remaining > 0,
    remaining: state.remaining,
    until: state.until,
    record,
    clear,
  };
}
