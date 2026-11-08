import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Visual as V, SolidName } from '../learning/types';
import { Shape } from './Shape';
import { hasWebGL } from '../lib/webgl';
import { getMediaBlob } from '../lib/db';
import { euro } from '../learning/modules/math';
import { ErrorBoundary } from './ErrorBoundary';

const Solid3D = lazy(() => import('../three/Solid3D'));
const Count3D = lazy(() => import('../three/Count3D'));

export function Visual({ v }: { v: V }) {
  switch (v.kind) {
    case 'emojis':
      return (
        <div className="flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-3" aria-label={`${v.items.length} Bilder`}>
          {v.items.map((e, i) => (
            <motion.span key={i} className="emoji text-5xl sm:text-6xl" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: i * 0.05, type: 'spring' }}>{e}</motion.span>
          ))}
        </div>
      );
    case 'bigEmoji':
      return (
        <div className="flex flex-col items-center gap-2">
          <motion.span className={`emoji text-[7rem] sm:text-[9rem] ${v.silhouette ? 'silhouette' : ''}`} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} aria-hidden>{v.emoji}</motion.span>
          {v.caption && <span className="font-display text-3xl font-bold">{v.caption}</span>}
        </div>
      );
    case 'text':
      return <div className={`text-center font-display font-bold ${v.size === 'xl' ? 'text-6xl sm:text-7xl' : v.size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}>{v.text}</div>;
    case 'story':
      return (
        <article className="max-w-2xl rounded-3xl bg-sonne-100 p-5 text-left text-xl leading-relaxed sm:text-2xl">
          {v.title && <h3 className="mb-2 font-display text-2xl font-bold">{v.title}</h3>}
          <p>{v.text}</p>
        </article>
      );
    case 'dots':
      return (
        <div className="grid grid-cols-5 gap-3 rounded-3xl bg-white p-4" aria-label={`${v.count} Punkte`}>
          {Array.from({ length: v.count }, (_, i) => (
            <motion.span key={i} className="h-10 w-10 rounded-full bg-koralle-500 sm:h-12 sm:w-12" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.06 }} />
          ))}
        </div>
      );
    case 'pattern':
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-white p-4">
          {v.items.map((e, i) => <span key={i} className={`emoji text-5xl ${e === '❓' ? 'animate-pulse' : ''}`}>{e}</span>)}
        </div>
      );
    case 'shape':
      return <Shape shape={v.shape} color={v.color} size={160} />;
    case 'clock':
      return <Clock hours={v.hours} minutes={v.minutes} />;
    case 'coins':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {v.cents.map((c, i) => <Coin key={i} cents={c} />)}
        </div>
      );
    case 'fraction':
      return <Pie parts={v.parts} filled={v.filled} />;
    case 'column':
      return <Column a={v.a} b={v.b} op={v.op} />;
    case 'solid3d':
      return hasWebGL() ? (
        <ErrorBoundary compact>
          <Suspense fallback={<Loading3D />}>
            <Solid3D solid={v.solid} color={v.color} />
          </Suspense>
        </ErrorBoundary>
      ) : <Solid2D solid={v.solid} color={v.color} />;
    case 'count3d':
      return hasWebGL() ? (
        <ErrorBoundary compact>
          <Suspense fallback={<Loading3D />}>
            <Count3D count={v.count} item={v.item} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <span className="rounded-full bg-sonne-100 px-3 py-1 text-sm">2D-Ansicht (3D wird auf diesem Gerät nicht unterstützt)</span>
          <Visual v={{ kind: 'emojis', items: Array(v.count).fill(v.item === 'apfel' ? '🍎' : v.item === 'ball' ? '⚽' : '⭐') }} />
        </div>
      );
    case 'image':
      return <MediaImage id={v.mediaId} alt={v.alt} />;
  }
}

function Loading3D() {
  return <div className="flex h-64 w-full max-w-md items-center justify-center rounded-3xl bg-white text-lg" role="status">3D-Welt wird geladen …</div>;
}

function MediaImage({ id, alt }: { id: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let u: string | null = null;
    void getMediaBlob(id).then((b) => { if (b) { u = URL.createObjectURL(b); setUrl(u); } else setMissing(true); });
    return () => { if (u) URL.revokeObjectURL(u); };
  }, [id]);
  if (missing) return <div className="rounded-2xl bg-white p-4 text-tinte/60">Bild nicht gefunden</div>;
  if (!url) return <div className="h-48 w-64 animate-pulse rounded-2xl bg-white" role="status" aria-label="Bild wird geladen" />;
  return <img src={url} alt={alt} className="max-h-64 max-w-full rounded-2xl object-contain shadow-karte" />;
}

export function Clock({ hours, minutes, size = 220 }: { hours: number; minutes: number; size?: number }) {
  const hAngle = ((hours % 12) + minutes / 60) * 30;
  const mAngle = minutes * 6;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Analoge Uhr">
      <circle cx="100" cy="100" r="94" fill="#fff" stroke="#3A9BDC" strokeWidth="8" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        const r1 = i % 5 === 0 ? 76 : 82;
        return <line key={i} x1={100 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={100 + Math.sin(a) * 86} y2={100 - Math.cos(a) * 86} stroke="#2B2D42" strokeWidth={i % 5 === 0 ? 3 : 1} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const a = (n * 30 * Math.PI) / 180;
        return <text key={n} x={100 + Math.sin(a) * 62} y={100 - Math.cos(a) * 62 + 7} textAnchor="middle" fontSize="20" fontWeight="700" fill="#2B2D42" fontFamily="Fredoka, sans-serif">{n}</text>;
      })}
      <line x1="100" y1="100" x2="100" y2="52" stroke="#FF6F59" strokeWidth="9" strokeLinecap="round" transform={`rotate(${hAngle} 100 100)`} />
      <line x1="100" y1="100" x2="100" y2="26" stroke="#2B2D42" strokeWidth="5" strokeLinecap="round" transform={`rotate(${mAngle} 100 100)`} />
      <circle cx="100" cy="100" r="7" fill="#2B2D42" />
    </svg>
  );
}

function Coin({ cents }: { cents: number }) {
  const isEuro = cents >= 100;
  const gold = cents >= 10 && cents < 100;
  const size = isEuro ? 78 : cents >= 10 ? 64 + (cents / 50) * 8 : 48 + cents * 3;
  const fill = isEuro ? (cents === 200 ? '#D7D7D7' : '#E9C46A') : gold ? '#E9C46A' : '#C9773B';
  const ring = isEuro ? (cents === 200 ? '#E9C46A' : '#D7D7D7') : 'rgba(0,0,0,0.15)';
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={euro(cents)}>
      <circle cx="50" cy="50" r="47" fill={ring} />
      <circle cx="50" cy="50" r={isEuro ? 36 : 42} fill={fill} />
      <text x="50" y={isEuro ? 58 : 56} textAnchor="middle" fontSize={isEuro ? 28 : 26} fontWeight="800" fill="#2B2D42" fontFamily="Fredoka, sans-serif">
        {isEuro ? `${cents / 100}€` : `${cents}`}
      </text>
      {!isEuro && <text x="50" y="76" textAnchor="middle" fontSize="13" fill="#2B2D42">Cent</text>}
    </svg>
  );
}

function Pie({ parts, filled }: { parts: number; filled: number }) {
  const r = 90;
  const slices = Array.from({ length: parts }, (_, i) => {
    const a0 = (i / parts) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / parts) * Math.PI * 2 - Math.PI / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d = `M100 100 L${100 + r * Math.cos(a0)} ${100 + r * Math.sin(a0)} A${r} ${r} 0 ${large} 1 ${100 + r * Math.cos(a1)} ${100 + r * Math.sin(a1)}z`;
    return <path key={i} d={d} fill={i < filled ? '#FF6F59' : '#FFF1CC'} stroke="#C77D00" strokeWidth="3" />;
  });
  return <svg viewBox="0 0 200 200" width={220} height={220} role="img" aria-label={`Kreis in ${parts} Teile geteilt, ${filled} gefärbt`}>{slices}</svg>;
}

function Column({ a, b, op }: { a: number; b: number; op: '+' | '-' }) {
  const width = Math.max(String(a).length, String(b).length) + 1;
  const pad = (n: number) => String(n).padStart(width, ' ').split('');
  return (
    <div className="rounded-3xl bg-white p-5 font-mono text-5xl font-bold leading-tight sm:text-6xl" aria-label={`${a} ${op === '+' ? 'plus' : 'minus'} ${b}`}>
      <div className="mb-1 flex justify-end gap-3 text-base font-sans text-tinte/60"><span>H</span><span>Z</span><span>E</span></div>
      <div className="flex justify-end gap-3">{pad(a).map((c, i) => <span key={i} className="w-8 text-center">{c}</span>)}</div>
      <div className="flex justify-end gap-3">{[op === '+' ? '+' : '−', ...pad(b).slice(1)].map((c, i) => <span key={i} className="w-8 text-center">{c}</span>)}</div>
      <div className="mt-2 border-t-4 border-tinte" />
    </div>
  );
}

/** 2D-Fallback für geometrische Körper */
export function Solid2D({ solid, color }: { solid: SolidName; color: string }) {
  const dark = 'rgba(0,0,0,0.18)';
  const shapes: Record<SolidName, JSX.Element> = {
    wuerfel: <g><path d="M50 70 L110 70 L110 130 L50 130z" fill={color} /><path d="M50 70 L80 45 L140 45 L110 70z" fill={color} opacity="0.75" /><path d="M110 70 L140 45 L140 105 L110 130z" fill={dark} /></g>,
    quader: <g><path d="M30 80 L130 80 L130 130 L30 130z" fill={color} /><path d="M30 80 L60 58 L160 58 L130 80z" fill={color} opacity="0.75" /><path d="M130 80 L160 58 L160 108 L130 130z" fill={dark} /></g>,
    kugel: <g><circle cx="95" cy="95" r="55" fill={color} /><ellipse cx="75" cy="72" rx="16" ry="10" fill="#fff" opacity="0.5" /></g>,
    zylinder: <g><rect x="55" y="50" width="80" height="90" fill={color} /><ellipse cx="95" cy="140" rx="40" ry="14" fill={color} /><ellipse cx="95" cy="50" rx="40" ry="14" fill={color} opacity="0.7" /></g>,
    kegel: <g><path d="M95 30 L135 140 L55 140z" fill={color} /><ellipse cx="95" cy="140" rx="40" ry="13" fill={color} opacity="0.8" /></g>,
    pyramide: <g><path d="M95 30 L55 135 L115 145z" fill={color} /><path d="M95 30 L115 145 L145 120z" fill={dark} /></g>
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 190 180" width={240} height={228} role="img" aria-label="Geometrischer Körper">{shapes[solid]}</svg>
      <span className="rounded-full bg-sonne-100 px-3 py-1 text-sm">2D-Ansicht (3D wird auf diesem Gerät nicht unterstützt)</span>
    </div>
  );
}
