import React, { useEffect, useMemo } from 'react';
import { PhotoData } from '~types';

import { Photos } from './Photos';
import { useFetch } from './useFetch';
import { SERVER } from './util';

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
    <div className="w-screen h-screen">
      {loading ? <p>Loading...</p> : error ? <p>Error: {error.message}</p> : <Photos photos={shuffled || []} />}
    </div>
  );
}
