import { useRestart } from 'hooks/useRestart';
import React, { useEffect } from 'react';

import { useFetch } from '../hooks/useFetch';
import { PhotoData } from '../types';
import { SERVER } from '../util';
import { Photos } from './Photos';

export function App() {
  const [count, setCount] = React.useState(0);
  const { data, loading, error } = useFetch<{ photos: PhotoData[] }>(`${SERVER}/photos?cache=${count}`);

  useRestart();

  // Fetch new data every 5 minutes
  useEffect(() => {
    const photoInterval = setInterval(() => setCount((prev) => prev + 1), 5 * 60 * 1000);
    return () => clearInterval(photoInterval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {count}
      {loading && !data ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <Photos photos={data?.photos || []} />
      )}
    </div>
  );
}
