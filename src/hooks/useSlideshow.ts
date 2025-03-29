import { useEffect, useRef, useState } from 'react';
import { PhotoData } from 'types';
import { mod } from 'util';

export function useSlideshow(photos: PhotoData[]) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setIndex((prev) => (prev + 1) % photos.length), 2 * 60 * 1000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [photos]);

  // useEffect(() => {
  //   // preload next image shortly after the current one is displayed
  //   setTimeout(() => {
  //     const nextIndex = mod(index + 1, photos.length);

  //     const nextImage = new Image();
  //     nextImage.src = `${SERVER}${photos[nextIndex].url}`;
  //   }, 5000);
  // }, [index, photos]);

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        setIndex((prev) => mod(prev - 1, photos.length));
        resetTimer();
      } else if (e.key === 'ArrowRight') {
        setIndex((prev) => mod(prev + 1, photos.length));
        resetTimer();
      }
    });
  }, []);

  return { index, setIndex, resetTimer };
}
