import { useSlideshow } from 'hooks/useSlideshow';
import React, { useState } from 'react';

import { PhotoData } from '../types';
import { SERVER } from '../util';
import { Overlay } from './Overlay';
import { Photo } from './Photo';

export function Photos({ photos }: { photos: PhotoData[] }) {
  const { index, setIndex, resetTimer } = useSlideshow(photos);
  const [opacity, setOpacity] = useState(0);

  const image = photos[index];
  const url = `${SERVER}${image.url}`;

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
      <Photo photo={photos[index]} />
      <Overlay index={index} setIndex={setIndex} opacity={opacity} photos={photos} resetTimer={resetTimer} />
    </div>
  );
}
