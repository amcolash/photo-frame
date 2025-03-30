import React from 'react';

export function Progress({ progress }: { progress?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        height: progress ? '0.25rem' : 0,
        top: 0,
        left: 0,
        right: (1 - (progress || 0)) * 100 + '%',
        background: '#4499cc',
        zIndex: 1,
        transition: 'all 0.5s ease-in-out',
      }}
    />
  );
}
