import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
/* polyfill fetch for iPad */
import 'whatwg-fetch';

import { App } from './components/App';

function fallbackRender({ error, resetErrorBoundary }) {
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
