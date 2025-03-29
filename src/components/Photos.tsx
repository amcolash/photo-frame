import { Overlay } from 'components/Overlay';
import { Photo } from 'components/Photo';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSlideshow } from 'hooks/useSlideshow';
import React, { useState } from 'react';
import { PhotoData } from 'types';

export function Photos({ photos }: { photos: PhotoData[] }) {
  const screen = useScreenSize();
  const { index, setIndex, resetTimer } = useSlideshow(photos);
  const [opacity, setOpacity] = useState(0);

  const index1 = (Math.ceil(index / 2) * 2) % photos.length;
  const index2 = (Math.floor(index / 2) * 2 + 1) % photos.length;

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
      {/* <div style={{ position: 'absolute', top: 0, left: 0, color: 'black', fontSize: '2em', zIndex: 10 }}>
        {index1} {active1 && 'X'} {photos[index1].url} | {index2} {active2 && 'X'} {photos[index2].url}
      </div> */}

      <Photo photo={photos[index1]} screen={screen} active={active1} />
      <Photo photo={photos[index2]} screen={screen} active={active2} />

      <Overlay index={index} setIndex={setIndex} opacity={opacity} photos={photos} resetTimer={resetTimer} />
    </div>
  );
}
