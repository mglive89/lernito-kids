/**
 * Verhindert das Zoomen der App (Pinch, Doppeltippen, Strg+Mausrad, Strg +/−),
 * damit die Oberfläche immer bildschirmfüllend bleibt.
 * iOS-Safari ignoriert `user-scalable=no` im Viewport, deshalb zusätzlich per Ereignis.
 * 3D-Szenen (canvas) dürfen Zwei-Finger-Gesten weiterhin selbst nutzen.
 * Größere Schrift gibt es stattdessen im Elternbereich („Große Schrift“).
 */
export function preventZoom() {
  if (typeof window === 'undefined') return;
  const onCanvas = (e: Event) => e.target instanceof HTMLCanvasElement;
  const stop = (e: Event) => { if (!onCanvas(e)) e.preventDefault(); };

  // iOS: Pinch-Gesten
  document.addEventListener('gesturestart', stop, { passive: false });
  document.addEventListener('gesturechange', stop, { passive: false });
  document.addEventListener('gestureend', stop, { passive: false });
  // Alle Touch-Geräte: Zwei-Finger-Bewegung
  document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) stop(e); }, { passive: false });
  // Doppeltippen-Zoom verhindert touch-action: manipulation (index.css), ohne schnelle Taps zu blockieren
  // Desktop: Strg/Cmd + Mausrad bzw. Trackpad-Pinch
  window.addEventListener('wheel', (e) => { if (e.ctrlKey || e.metaKey) stop(e); }, { passive: false });
  // Desktop: Strg/Cmd + Plus/Minus/0
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0', 'Add', 'Subtract'].includes(e.key)) e.preventDefault();
  });
}
