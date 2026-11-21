import { useEffect, useState } from 'react';

export interface FlashCountdownState {
  hours: string;
  minutes: string;
  seconds: string;
  formatted: string;
}

function computeRemaining(): FlashCountdownState {
  // Deterministic 6-hour rolling flash window in UTC so countdown never drops to 00:00:00
  const windowSeconds = 6 * 3600;
  const nowSec = Math.floor(Date.now() / 1000);
  const remaining = windowSeconds - (nowSec % windowSeconds);
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    hours: pad(h),
    minutes: pad(m),
    seconds: pad(s),
    formatted: `${pad(h)}:${pad(m)}:${pad(s)}`,
  };
}

export function useFlashCountdown(): FlashCountdownState {
  const [countdown, setCountdown] = useState<FlashCountdownState>(() => computeRemaining());

  useEffect(() => {
    const id = window.setInterval(() => {
      setCountdown(computeRemaining());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return countdown;
}
