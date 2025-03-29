import { Photos } from 'components/Photos';
import { useRestart } from 'hooks/useRestart';
import React from 'react';

export function App() {
  useRestart();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Photos />
    </div>
  );
}
