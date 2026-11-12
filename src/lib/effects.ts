/**
 * Kleine, fröhliche Effekte (Stern-Funken, Herzen, Tipp-Funken) mit der Web Animations API.
 * Ohne Bibliothek, ohne Bilder; jedes Teilchen entfernt sich selbst.
 * Bei „Weniger Bewegung“ (Gerät oder Elternbereich) passiert nichts.
 */

export type BurstKind = 'sterne' | 'herzen' | 'funken';

const COLORS = ['#F5A524', '#2F6FEB', '#12B886', '#F0614E', '#7A5AF8'];
const STAR = 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z';
const HEART = 'M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z';

let lastX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
let lastY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

export function effectsOff(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return true;
  if (document.documentElement.classList.contains('wenig-bewegung')) return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function layer(): HTMLElement {
  let el = document.getElementById('effekte');
  if (!el) {
    el = document.createElement('div');
    el.id = 'effekte';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden';
    document.body.appendChild(el);
  }
  return el;
}

function shape(kind: BurstKind, color: string, size: number): HTMLElement {
  const el = document.createElement('span');
  el.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size}px;will-change:transform,opacity`;
  if (kind === 'funken') {
    el.style.borderRadius = '9999px';
    el.style.background = color;
  } else {
    el.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="${kind === 'herzen' ? HEART : STAR}" fill="${color}"/></svg>`;
  }
  return el;
}

/** Teilchen fliegen von (x, y) in alle Richtungen. */
export function burst(x = lastX, y = lastY, kind: BurstKind = 'sterne', count = kind === 'funken' ? 7 : 12) {
  if (effectsOff() || typeof document.body.animate !== 'function') return;
  const root = layer();
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = (kind === 'funken' ? 22 : 60) + Math.random() * (kind === 'funken' ? 16 : 50);
    const size = kind === 'funken' ? 5 + Math.random() * 3 : kind === 'herzen' ? 16 + Math.random() * 12 : 12 + Math.random() * 12;
    const color = kind === 'herzen' ? ['#F0614E', '#FDA394', '#F5A524'][i % 3]! : COLORS[i % COLORS.length]!;
    const el = shape(kind, color, size);
    root.appendChild(el);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - (kind === 'herzen' ? 30 : 0);
    const rot = (Math.random() - 0.5) * 240;
    const anim = el.animate(
      [
        { transform: `translate(${x - size / 2}px, ${y - size / 2}px) scale(0.3) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${x - size / 2 + dx * 0.8}px, ${y - size / 2 + dy * 0.8}px) scale(1) rotate(${rot * 0.7}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${x - size / 2 + dx}px, ${y - size / 2 + dy + (kind === 'funken' ? 0 : 18)}px) scale(0.6) rotate(${rot}deg)`, opacity: 0 }
      ],
      { duration: kind === 'funken' ? 420 : 800 + Math.random() * 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );
    anim.onfinish = () => el.remove();
    anim.oncancel = () => el.remove();
  }
}

/** Effekt an einem Element (Mitte). */
export function burstAt(el: Element | null, kind: BurstKind = 'sterne', count?: number) {
  if (!el) return burst(lastX, lastY, kind, count);
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, kind, count);
}

/** Merkt sich die letzte Tipp-Position und zeigt kleine Funken beim Tippen auf Knöpfe und Karten im Kinderbereich. */
export function installTapEffects(isChildArea: () => boolean) {
  if (typeof window === 'undefined') return;
  window.addEventListener('pointerdown', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    if (!isChildArea()) return;
    const t = e.target as HTMLElement | null;
    if (!t || t.closest('input, textarea, select, canvas, [data-keine-funken]')) return;
    if (!t.closest('button, a, [role="button"], [role="tab"]')) return;
    burst(e.clientX, e.clientY, 'funken');
  }, { passive: true, capture: true });
}
