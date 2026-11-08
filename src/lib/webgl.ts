let cached: boolean | null = null;
/** Prüft, ob WebGL verfügbar ist – sonst wird der 2D-Fallback genutzt. */
export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    if (new URLSearchParams(window.location.search).has('no3d')) return (cached = false);
    const c = document.createElement('canvas');
    cached = !!(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    cached = false;
  }
  return cached;
}
