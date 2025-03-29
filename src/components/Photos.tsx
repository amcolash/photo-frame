import { useSlideshow } from 'hooks/useSlideshow';
import React, { useState } from 'react';

import { PhotoData } from '../types';
import { SERVER, mod } from '../util';
import { Overlay } from './Overlay';
import { Photo } from './Photo';

export function Photos({ photos }: { photos: PhotoData[] }) {
  const { index, setIndex, resetTimer } = useSlideshow(photos);
  const [opacity, setOpacity] = useState(0);

  const index1 = Math.floor(index / 2) * 2;
  const index2 = Math.floor(index / 2) * 2 + 1;

  const active1 = index % 2 === 0;
  const active2 = index % 2 !== 0;

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
      <Photo photo={photos[index1]} active={active1} />
      <Photo photo={photos[index2]} active={active2} />

      <Overlay index={index} setIndex={setIndex} opacity={opacity} photos={photos} resetTimer={resetTimer} />
    </div>
  );
}
