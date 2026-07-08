import { useEffect } from 'react';

/** Shifts hero tint based on visitor local hour — dawn gold → midday neutral → dusk amber */
export function useGoldenHour(): void {
  useEffect(() => {
    const hour = new Date().getHours();
    let phase: 'dawn' | 'day' | 'dusk' | 'night';

    if (hour >= 5 && hour < 9) phase = 'dawn';
    else if (hour >= 9 && hour < 17) phase = 'day';
    else if (hour >= 17 && hour < 21) phase = 'dusk';
    else phase = 'night';

    document.documentElement.dataset.golden = phase;
  }, []);
}