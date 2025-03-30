import React, { useEffect } from 'react';

export function ErrorMessage({ error }: { error: Error }) {
  useEffect(() => {
    console.error('ErrorBoundary:', error);
    // TODO: Send log to server
    setTimeout(() => window.location.reload(), 5000);
  }, []);

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      {error.stack && <pre style={{ color: 'red' }}>{error.stack}</pre>}
    </div>
  );
}
