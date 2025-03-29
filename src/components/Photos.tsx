import { Overlay } from 'components/Overlay';
import { Photo } from 'components/Photo';
import { useFetch } from 'hooks/useFetch';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSlideshow } from 'hooks/useSlideshow';
import React, { useEffect, useState } from 'react';
import { PhotoIndex } from 'types';
import { SERVER } from 'util';

export function Photos() {
  const screen = useScreenSize();

  const [length, setLength] = useState(1);
  const { index, prev, next } = useSlideshow(length);

  const { loading, error, data } = useFetch<PhotoIndex>(`${SERVER}/photo/${index}`);

  // Set length when data is fetched
  useEffect(() => setLength(data?.total || 1), [data]);

  const active1 = index % 2 === 0;
  const active2 = index % 2 !== 0;

  if (loading && !data) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data) return null;

  return (
    <div
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

      {/* Flip flop between the two photos, so a preloaded one is always ready to be rendered w/o flash */}
      <Photo photo={active1 ? data.current : data.next} active={active1} screen={screen} />
      <Photo photo={active2 ? data.current : data.next} active={active2} screen={screen} />

      <Overlay index={index} length={length} prev={prev} next={next} />
    </div>
  );
}
