import { createRoot } from 'react-dom/client';

// Import polyfills first
import './lib/polyfills.ts';

// Inter Variable font
import '@fontsource-variable/inter';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

// Fonts: add custom font imports here, e.g.:
// import '@fontsource-variable/<font-name>';

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
