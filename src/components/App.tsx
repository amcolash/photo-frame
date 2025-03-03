import React, { useEffect, useMemo } from 'react';

import { useFetch } from '../hooks/useFetch';
import { PhotoData } from '../types';
import { SERVER } from '../util';
import { Photos } from './Photos';

export function App() {
  const [count, setCount] = React.useState(0);
  const { data, loading, error } = useFetch<{ photos: PhotoData[] }>(`${SERVER}/photos?cache=${count}`);
  const shuffled = useMemo(() => data?.photos.sort(() => Math.random() - 0.5), [data]);

  // Fetch new data every hour
  useEffect(() => {
    const interval = setInterval(() => setCount((prev) => prev + 1), 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {loading ? <p>Loading...</p> : error ? <p>Error: {error.message}</p> : <Photos photos={shuffled || []} />}
    </div>
  );
}
