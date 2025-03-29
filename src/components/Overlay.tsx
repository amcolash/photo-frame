import chevronLeft from 'icons/chevron-left.svg';
import chevronRight from 'icons/chevron-right.svg';
import rotate from 'icons/rotate-cw.svg';
import React from 'react';
import { SERVER, mod } from 'util';

type OverlayProps = {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  opacity: number;
  photos: { url: string; width: number; height: number }[];
  resetTimer: () => void;
};

export function Overlay({ index, setIndex, opacity, photos, resetTimer }: OverlayProps) {
  return (
    <>
      <div
        style={{
          opacity,
          position: 'absolute',
          bottom: '1.5rem',
          right: '1.5rem',
          color: 'white',
          textAlign: 'center',
          textShadow: '0px 1px 3px rgba(0, 0, 0, 0.5)',
          transition: 'opacity 500ms',
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          paddingTop: '1rem',
        }}
      >
        <span style={{ padding: '0.75rem' }}>
          {index + 1} / {photos.length}
        </span>

        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
          <button
            disabled={opacity === 0}
            onClick={() => {
              setIndex(mod(index - 1, photos.length));
              resetTimer();
            }}
            style={{ padding: '0.75rem' }}
          >
            <img src={chevronLeft} />
          </button>
          <button
            disabled={opacity === 0}
            onClick={() => {
              setIndex(mod(index + 1, photos.length));
              resetTimer();
            }}
            style={{ padding: '0.75rem' }}
          >
            <img src={chevronRight} />
          </button>
        </div>
      </div>

      <div
        style={{
          opacity,
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          color: 'white',
          textShadow: '0px 1px 3px rgba(0, 0, 0, 0.5)',
          transition: 'opacity 500ms',
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          padding: '0.5rem',
        }}
      >
        <button
          disabled={opacity === 0}
          style={{ padding: '0.5rem' }}
          onClick={() => fetch(`${SERVER}/refresh`, { method: 'POST' }).then(() => window.location.reload())}
        >
          <img src={rotate} />
        </button>
      </div>
    </>
  );
}
