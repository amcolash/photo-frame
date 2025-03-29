import { useEffect, useRef, useState } from 'react';
import { mod } from 'util';

export function useSlideshow(length: number) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setIndex((prev) => (prev + 1) % length), 2 * 60 * 1000);
  };

  const prev = () => {
    setIndex((prev) => mod(prev - 1, length));
    resetTimer();
  };

  const next = () => {
    setIndex((prev) => mod(prev + 1, length));
    resetTimer();
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [length]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [length]);

  return { index, prev, next };
}
