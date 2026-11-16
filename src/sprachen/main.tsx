import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import '../index.css';
import { SprachenApp } from './SprachenApp';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { preventZoom } from '../lib/noZoom';
import { installTapEffects } from '../lib/effects';
import { installTheme } from '../lib/theme';

installTheme();
preventZoom();
installTapEffects(() => true);

// Eigene App „Lernito Sprachen“: Hash-Routen, damit jede Seite auch auf GitHub Pages direkt aufrufbar ist.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SprachenApp />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
