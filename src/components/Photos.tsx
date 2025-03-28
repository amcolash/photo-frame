import { useSlideshow } from 'hooks/useSlideshow';
import React, { useState } from 'react';

import { useScreenSize } from '../hooks/useScreenSize';
import { PhotoData } from '../types';
import { SERVER } from '../util';
import { Overlay } from './Overlay';

export function Photos({ photos }: { photos: PhotoData[] }) {
  const { height: screenHeight, width: screenWidth } = useScreenSize();
  const { index, setIndex, resetTimer } = useSlideshow(photos);
  const [opacity, setOpacity] = useState(0);

  const image = photos[index];
  const url = `${SERVER}${image.url}`;
  const dims = { width: image.width, height: image.height };

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
      onMouseDown={(e) => {
        /* @ts-ignore */
        if (e.target.tagName === 'BUTTON' || e.target.parentElement?.tagName === 'BUTTON') return;

        setOpacity(opacity === 0 ? 0.6 : 0);
        setTimeout(() => {
          setOpacity(0);
        }, 10000);
      }}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'black',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',

          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${url})`,
          backgroundSize: '100% 100%',

          WebkitTransform: 'scale(1.1)',
          WebkitTransformOrigin: 'center',

          transform: 'scale(1.1)',
          transformOrigin: 'center',

          filter: 'blur(10px)',
          WebkitFilter: 'blur(10px)',
        }}
      />

      <div
        style={{
          backgroundSize: 'contain',
          width: '100%',
          height: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          inset: 0,
          position: 'absolute',

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

      <Overlay index={index} setIndex={setIndex} opacity={opacity} photos={photos} resetTimer={resetTimer} />
    </div>
  );
}
