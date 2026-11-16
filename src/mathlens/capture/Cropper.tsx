/** Ausschnitt wählen: Rahmen verschieben und an den Ecken größer/kleiner ziehen. */
import { useRef, type PointerEvent as RPointerEvent } from 'react';
import { L } from '../../i18n';
import type { Rect } from './camera';

type Drag = { mode: 'move' | 'nw' | 'ne' | 'sw' | 'se'; startX: number; startY: number; start: Rect };
const MIN = 0.06;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function Cropper({ src, rect, onChange }: { src: string; rect: Rect; onChange: (r: Rect) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);

  const down = (mode: Drag['mode']) => (e: RPointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { mode, startX: e.clientX, startY: e.clientY, start: rect };
  };
  const move = (e: RPointerEvent) => {
    const d = drag.current, el = box.current;
    if (!d || !el) return;
    const b = el.getBoundingClientRect();
    const dx = (e.clientX - d.startX) / b.width, dy = (e.clientY - d.startY) / b.height;
    const s = d.start;
    let { x, y, w, h } = s;
    if (d.mode === 'move') { x = clamp(s.x + dx, 0, 1 - s.w); y = clamp(s.y + dy, 0, 1 - s.h); }
    if (d.mode === 'nw' || d.mode === 'sw') { x = clamp(s.x + dx, 0, s.x + s.w - MIN); w = s.x + s.w - x; }
    if (d.mode === 'ne' || d.mode === 'se') { w = clamp(s.w + dx, MIN, 1 - s.x); }
    if (d.mode === 'nw' || d.mode === 'ne') { y = clamp(s.y + dy, 0, s.y + s.h - MIN); h = s.y + s.h - y; }
    if (d.mode === 'sw' || d.mode === 'se') { h = clamp(s.h + dy, MIN, 1 - s.y); }
    onChange({ x, y, w, h });
  };
  const up = () => { drag.current = null; };
  const pct = (v: number) => `${v * 100}%`;
  const handle = 'absolute h-7 w-7 rounded-full border-4 border-white bg-himmel-500 shadow touch-none';

  return (
    <div ref={box} className="relative mx-auto w-full max-w-xl touch-none select-none overflow-hidden rounded-2xl bg-black" onPointerMove={move} onPointerUp={up} onPointerCancel={up} data-testid="zuschnitt">
      <img src={src} alt={L('Dein Foto', 'La tua foto')} className="block w-full" draggable={false} />
      {/* abgedunkelter Rand */}
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'none' }}>
        <div className="absolute rounded-lg ring-2 ring-white" style={{ left: pct(rect.x), top: pct(rect.y), width: pct(rect.w), height: pct(rect.h), boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)' }} />
      </div>
      <div className="absolute cursor-move" style={{ left: pct(rect.x), top: pct(rect.y), width: pct(rect.w), height: pct(rect.h) }} onPointerDown={down('move')} aria-label={L('Ausschnitt verschieben', 'Sposta il ritaglio')} role="presentation">
        <span className={`${handle} -left-3.5 -top-3.5 cursor-nwse-resize`} onPointerDown={down('nw')} />
        <span className={`${handle} -right-3.5 -top-3.5 cursor-nesw-resize`} onPointerDown={down('ne')} />
        <span className={`${handle} -bottom-3.5 -left-3.5 cursor-nesw-resize`} onPointerDown={down('sw')} />
        <span className={`${handle} -bottom-3.5 -right-3.5 cursor-nwse-resize`} onPointerDown={down('se')} data-testid="zuschnitt-ecke" />
      </div>
    </div>
  );
}
