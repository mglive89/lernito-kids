import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

// Relativer Build (BASE_PATH=./, z. B. für eine Vorschau-Seite ohne festen Pfad) nutzt Hash-Routen.
const relative = import.meta.env.BASE_URL === './';
const Router = relative ? HashRouter : BrowserRouter;
const routerProps = relative ? {} : { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router {...routerProps} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);
