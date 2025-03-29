import { App } from 'components/App';
import 'index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
/* polyfill fetch for iPad */
import 'whatwg-fetch';

function fallbackRender({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallbackRender={fallbackRender}>
    <App />
  </ErrorBoundary>
);
