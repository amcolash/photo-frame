import { useEffect, useRef, useState } from 'react';

export function useOverlayOpacity(timeoutMs = 10000) {
  const [opacity, setOpacity] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      /* @ts-ignore */
      if (e.target.tagName !== 'BUTTON' && e.target.parentElement?.tagName !== 'BUTTON') {
        setOpacity((prev) => (prev === 0 ? 0.6 : 0));
      }

      // Clear existing timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        setOpacity(0);
      }, timeoutMs);
    };

    window.addEventListener('mousedown', listener);
    return () => {
      window.removeEventListener('mousedown', listener);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeoutMs]);

  return opacity;
}
