import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Erzeugt eine Textur mit Text oder Emoji (keine externen Schriftdateien nötig). */
export function useLabelTexture(label: string, bg: string | null = '#FFFFFF', fg = '#2B2D42'): THREE.CanvasTexture {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d')!;
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, 256, 256); }
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const isEmoji = /\p{Extended_Pictographic}/u.test(label);
    ctx.font = isEmoji ? '170px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' : `bold ${label.length > 2 ? 110 : 150}px Fredoka, Nunito, sans-serif`;
    ctx.fillText(label, 128, isEmoji ? 140 : 136);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [label, bg, fg]);
}

/** Gruppe, die per Ziehen gedreht werden kann (Maus und Touch). */
export function useDragRotation() {
  const rot = useRef({ x: 0.4, y: 0.6, vx: 0, vy: 0.004, dragging: false, lastX: 0, lastY: 0, moved: 0 });
  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      rot.current.dragging = true; rot.current.lastX = e.clientX; rot.current.lastY = e.clientY; rot.current.moved = 0;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent) => {
      const r = rot.current;
      if (!r.dragging) return;
      const dx = e.clientX - r.lastX, dy = e.clientY - r.lastY;
      r.moved += Math.abs(dx) + Math.abs(dy);
      r.y += dx * 0.01; r.x += dy * 0.01;
      r.x = Math.max(-1.2, Math.min(1.2, r.x));
      r.vy = dx * 0.0008; r.vx = 0;
      r.lastX = e.clientX; r.lastY = e.clientY;
    },
    onPointerUp: () => { rot.current.dragging = false; },
    onPointerCancel: () => { rot.current.dragging = false; }
  };
  return { rot, handlers };
}

export function RotatingGroup({ rot, children, auto = true, limitX = true }: { rot: ReturnType<typeof useDragRotation>['rot']; children: ReactNode; auto?: boolean; limitX?: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    const r = rot.current;
    if (!r.dragging && auto) { r.y += r.vy; r.vy = r.vy * 0.98 + 0.004 * 0.02; }
    if (g.current) {
      g.current.rotation.y = r.y;
      g.current.rotation.x = limitX ? Math.max(-0.5, Math.min(0.6, r.x * 0.5)) : r.x;
    }
  });
  return <group ref={g}>{children}</group>;
}

export const canvasProps = {
  dpr: [1, 1.5] as [number, number],
  gl: { antialias: true, powerPreference: 'low-power' as const },
  style: { touchAction: 'none' as const }
};
