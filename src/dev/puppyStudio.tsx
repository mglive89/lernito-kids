/* Nur für die Entwicklung: rendert Puppy in 3D, damit scripts/render-puppy.mjs Bilder erzeugen kann. Wird nicht ausgeliefert. */
import { createRoot } from 'react-dom/client';
import { PuppyScene } from '../components/Puppy3D';
import type { LinoMood } from '../components/Lino';

const mood = (new URLSearchParams(location.search).get('mood') ?? 'freude') as LinoMood;
createRoot(document.getElementById('root')!).render(
  <div style={{ width: '100vw', height: '100vh' }}>
    <PuppyScene mood={mood} onReady={() => { (window as unknown as { __puppyReady: boolean }).__puppyReady = true; }} />
  </div>
);
