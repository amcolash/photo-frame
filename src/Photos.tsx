import React, { useEffect, useRef, useState } from 'react';
import { useScreenSize } from '~useScreenSize';

import { PhotoData } from './types';
import { SERVER, mod } from './util';

export function Photos({ photos }: { photos: PhotoData[] }) {
  const { height: screenHeight, width: screenWidth } = useScreenSize();

  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const image = photos[index];
  const url = `${SERVER}${image.url}`;
  const dims = { width: image.width, height: image.height };

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

  useEffect(() => {
    // preload next image shortly after the current one is displayed
    setTimeout(() => {
      const nextIndex = mod(index + 1, photos.length);

      const nextImage = new Image();
      nextImage.src = `${SERVER}${photos[nextIndex].url}`;
    }, 5000);
  }, [index, photos]);

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

  // Get information about the dimensions / ratio of the image
  const tall = dims.height > dims.width;
  const aspect = dims.width / dims.height;
  const inverseAspect = dims.height / dims.width;

  const scaledDims = {
    width: tall ? screenHeight * aspect : screenWidth,
    height: tall ? screenHeight : screenWidth * inverseAspect,
  };

  const verticalSides = (screenWidth - scaledDims.width) / screenWidth / 2;
  const horizontalSides = (screenHeight - scaledDims.height) / screenHeight / 2;

  const start = (tall ? verticalSides : horizontalSides) * 100 + 1;
  const end = start + 4;

  const fadeImage = start > 1;

  return (
    <div
      className="w-full h-full relative bg-black overflow-hidden"
      onMouseDown={(e) => {
        /* @ts-ignore */
        if (e.target.tagName === 'BUTTON') return;

        setOpacity(opacity === 0 ? 1 : 0);
        setTimeout(() => {
          setOpacity(0);
        }, 10000);
      }}
    >
      <div
        className="w-full h-full bg-no-repeat absolute origin-center scale-105 blur-md"
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: '100% 100%',
        }}
      />

      <div
        className="bg-contain w-full h-full bg-no-repeat bg-center inset-0 absolute"
        style={{
          backgroundImage: `url(${url})`,
          maskImage: fadeImage
            ? `linear-gradient(${tall ? '0' : '90'}deg, rgba(0,0,0,0) ${start}%, rgba(255,255,255,1) ${end}%, rgba(255,255,255,1) ${
                100 - end
              }%, rgba(0,0,0,0) ${100 - start}%)`
            : undefined,
          WebkitMaskImage: fadeImage
            ? `-webkit-linear-gradient(${
                tall ? '0' : '90'
              }deg, rgba(0,0,0,0) ${start}%, rgba(255,255,255,1) ${end}%, rgba(255,255,255,1) ${100 - end}%, rgba(0,0,0,0) ${
                100 - start
              }%)`
            : undefined,
        }}
      />

      <div
        className="absolute bottom-2 right-4 flex gap-4 text-white text-shadow transition-opacity duration-500"
        style={{ opacity }}
      >
        <span>
          {index + 1} / {photos.length}
        </span>

        <button
          onClick={() => {
            setIndex(mod(index - 1, photos.length));
            resetTimer();
          }}
        >
          &lt;
        </button>
        <button
          onClick={() => {
            setIndex(mod(index + 1, photos.length));
            resetTimer();
          }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
