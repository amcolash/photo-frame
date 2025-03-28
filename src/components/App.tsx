import { useRestart } from 'hooks/useRestart';
import React, { useEffect, useMemo } from 'react';

import { useFetch } from '../hooks/useFetch';
import { PhotoData } from '../types';
import { SERVER } from '../util';
import { Photos } from './Photos';

export function App() {
  const [count, setCount] = React.useState(0);
  const { data, loading, error } = useFetch<{ photos: PhotoData[] }>(`${SERVER}/photos?cache=${count}`);
  const shuffled = useMemo(() => data?.photos.sort(() => Math.random() - 0.5), [data]);

  useRestart();

  // Fetch new data every hour
  useEffect(() => {
    const photoInterval = setInterval(() => setCount((prev) => prev + 1), 60 * 60 * 1000);
    return () => clearInterval(photoInterval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {loading ? <p>Loading...</p> : error ? <p>Error: {error.message}</p> : <Photos photos={shuffled || []} />}
    </div>
  );
}
