import { useOverlayOpacity } from 'hooks/useOverlayOpacity';
import chevronLeft from 'icons/chevron-left.svg';
import chevronRight from 'icons/chevron-right.svg';
import rotate from 'icons/rotate-cw.svg';
import React, { useState } from 'react';
import { SERVER } from 'util';

type OverlayProps = {
  index: number;
  length: number;
  prev: () => void;
  next: () => void;
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  color: 'white',
  textAlign: 'center',
  textShadow: '0px 1px 3px rgba(0, 0, 0, 0.5)',
  backgroundColor: '#1f2937',
  borderRadius: '0.5rem',
  padding: '0.5rem',
  transition: 'opacity 500ms',
};

export function Overlay({ index, length, prev, next }: OverlayProps) {
  const opacity = useOverlayOpacity();

  return (
    <>
      <Top opacity={opacity} />
      <Bottom opacity={opacity} index={index} length={length} prev={prev} next={next} />
    </>
  );
}

function Top({ opacity }: { opacity: number }) {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <div
      style={{
        ...overlayStyle,
        opacity: refreshing ? 1 : opacity,
        top: '1.5rem',
        right: '1.5rem',
      }}
    >
      <button
        disabled={opacity === 0 || refreshing}
        style={{ padding: '0.5rem' }}
        onClick={() => {
          if (refreshing) return;
          setRefreshing(true);

          fetch(`${SERVER}/refresh`, { method: 'POST' }).then(() => window.location.reload());
        }}
      >
        <img src={rotate} style={{ animation: refreshing ? '1s infinite spin' : undefined }} />
      </button>
    </div>
  );
}

function Bottom({
  opacity,
  index,
  length,
  prev,
  next,
}: {
  opacity: number;
  index: number;
  length: number;
  prev: () => void;
  next: () => void;
}) {
  return (
    <div
      style={{
        ...overlayStyle,
        opacity,
        bottom: '1.5rem',
        right: '1.5rem',
      }}
    >
      <span style={{ padding: '0.75rem' }}>
        {index + 1} / {length}
      </span>

      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
        <button disabled={opacity === 0} onClick={prev} style={{ padding: '0.75rem' }}>
          <img src={chevronLeft} />
        </button>
        <button disabled={opacity === 0} onClick={next} style={{ padding: '0.75rem' }}>
          <img src={chevronRight} />
        </button>
      </div>
    </div>
  );
}
