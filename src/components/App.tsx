import { Photos } from 'components/Photos';
import { useRestart } from 'hooks/useRestart';
import React from 'react';

import { Progress } from './Progress';

export function App() {
  const data = useRestart();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: 'black' }}>
      <Progress progress={data?.resizeProgress} />
      <Photos />
    </div>
  );
}
