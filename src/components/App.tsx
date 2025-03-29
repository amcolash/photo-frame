import { Photos } from 'components/Photos';
import { useFetch } from 'hooks/useFetch';
import { useRestart } from 'hooks/useRestart';
import React, { useEffect } from 'react';
import { PhotoData } from 'types';
import { SERVER } from 'util';

export function App() {
  const [cache, setCache] = React.useState(Date.now());
  const { data, loading, error } = useFetch<{ photos: PhotoData[] }>(`${SERVER}/photos?cache=${cache}`);

  useRestart();

  // Fetch new data every 5 minutes
  useEffect(() => {
    const photoInterval = setInterval(() => setCache(Date.now()), 5 * 60 * 1000);
    return () => clearInterval(photoInterval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
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
