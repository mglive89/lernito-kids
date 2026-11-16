import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '../index.css';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { UpdatePrompt } from '../components/UpdatePrompt';
import { installTheme } from '../lib/theme';
import { setLang, type Lang } from '../i18n';
import { MathLensApp } from './App';
import { chooseLang, initialLang } from './lang';

installTheme();
document.documentElement.classList.add('teen');

function Root() {
  const [lang, setL] = useState<Lang>(() => { const l = initialLang(); setLang(l); return l; });
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MathLensApp lang={lang} onLang={(l) => { chooseLang(l); setL(l); }} />
      <UpdatePrompt />
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary><Root /></ErrorBoundary>
  </React.StrictMode>
);
