import { App } from 'components/App';
import { ErrorMessage } from 'components/ErrorMessage';
import 'index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
/* polyfill fetch for iPad */
import 'whatwg-fetch';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallbackRender={ErrorMessage}>
    <App />
  </ErrorBoundary>
);
