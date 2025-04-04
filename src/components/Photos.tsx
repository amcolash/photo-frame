import { Overlay } from 'components/Overlay';
import { Photo } from 'components/Photo';
import { useFetch } from 'hooks/useFetch';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSlideshow } from 'hooks/useSlideshow';
import React, { useEffect, useState } from 'react';
import { PhotoData, PhotoIndex } from 'types';
import { SERVER } from 'util';

import { ErrorMessage } from './ErrorMessage';
import Swiper from './Swiper';

export function Photos() {
  const screen = useScreenSize();

  const [length, setLength] = useState(1);
  const { index, prev, next } = useSlideshow(length);

  // Delay subsequent fetches, so that there is not a black flicker on iPad
  const delay = index === 0 ? 0 : 500;

  const { loading, error, data } = useFetch<PhotoIndex>(`${SERVER}/photo/${index}`, undefined, delay);
  useEffect(() => setLength(data?.total || 1), [data]);

  if (loading && !data) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;

  if (!data) return null;

  const { active1, active2, photo1, photo2 } = getActivePhotos(data, index);

  return (
    <>
      {/* <div style={{ position: 'absolute', top: 0, left: 0, color: 'white', fontSize: '2em', zIndex: 10 }}>
        <div>
          1 {photo1 === data.previous ? 'prev' : photo1 === data.current ? 'curr' : 'next'} {active1 && 'X'}
        </div>
        <div>
          2 {photo2 === data.previous ? 'prev' : photo2 === data.current ? 'curr' : 'next'} {active2 && 'X'}
        </div>
      </div> */}

      <Swiper
        onSwipe={({ deltaX, deltaY }) => {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
              prev();
            } else {
              next();
            }
          }
        }}
      >
        {/* Flip flop between the two photos, so a preloaded one is always ready to be rendered w/o flash */}
        {photo1 && <Photo active={active1} photo={photo1} screen={screen} />}
        {photo2 && <Photo active={active2} photo={photo2} screen={screen} />}
      </Swiper>

      <Overlay index={index} length={length} prev={prev} next={next} />
    </>
  );
}

/**
 * Do a bit of complex logic to make sure that photos are shown properly.
 * Preloading is important on iPad. When a next/previous is shown, immediately
 * show the new image. Once data is returned, go back to normal rendering.
 * Messy, hacky, but it works.
 * */
function getActivePhotos(
  data: PhotoIndex,
  index: number
): {
  active1: boolean;
  active2: boolean;
  photo1: PhotoData;
  photo2: PhotoData;
} {
  const active1 = index % 2 === 0;
  const active2 = index % 2 !== 0;

  let photo1 = active1 ? data.current : data.next;
  let photo2 = active2 ? data.current : data.next;

  const diff = Math.sign(index - data.index);
  if (diff === -1) {
    if (active1) photo1 = data.previous;
    if (active2) photo2 = data.previous;
  } else if (diff === 1) {
    if (active1) photo1 = data.next;
    if (active2) photo2 = data.next;
  }

  return { active1, active2, photo1, photo2 };
}
