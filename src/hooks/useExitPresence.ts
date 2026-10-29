'use client';

import { useEffect, useState } from 'react';

// Keep overlays mounted and scroll-locked until their exit animation completes.
export default function useExitPresence(open: boolean, duration: number) {
  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);

  useEffect(() => {
    if (open || !present) return;
    const timer = window.setTimeout(() => setPresent(false), duration);
    return () => window.clearTimeout(timer);
  }, [open, present, duration]);

  return open || present;
}
