import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { Confetti, TopBar } from '../components/ui';
import { LinoSays } from '../components/Lino';
import { MINIGAMES } from '../learning/rewards';
import { sfx } from '../lib/sound';
import { speak } from '../lib/speech';
import { zahlwort } from '../content/words';
import { createRng, shuffle } from '../lib/random';

export function MiniGamesPage() {
  const { progress } = useActiveProfile();
  return (
    <div className="min-h-[100dvh]">
      <TopBar title="Mini-Spiele" back="/home" stars={progress.stars} />
      <main className="seite">
        <LinoSays text="Mit deinen Sternen schaltest du Mini-Spiele frei. Sie bleiben für immer offen!" size={80} />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MINIGAMES.map((g) => {
            const open = progress.stars >= g.starsNeeded;
            const inner = (
              <div className={`karte flex h-full flex-col items-center gap-2 p-6 text-center ${open ? '' : 'opacity-60'}`}>
                <span className="emoji text-7xl">{open ? g.emoji : '🔒'}</span>
                <span className="font-display text-2xl font-bold">{g.title}</span>
                <span className="text-tinte/70">{g.description}</span>
                {!open && <span className="mt-2 flex items-center gap-1 rounded-full bg-sonne-100 px-3 py-1 font-bold"><Lock size={16} /> ab {g.starsNeeded} Sternen</span>}
              </div>
            );
            return open
              ? <Link key={g.id} to={`/minispiele/${g.id}`} data-testid={`minispiel-${g.id}`}>{inner}</Link>
              : <div key={g.id} aria-disabled="true" data-testid={`minispiel-${g.id}`}>{inner}</div>;
          })}
        </div>
        <p className="mt-6 text-center text-sm text-tinte/60">Mini-Spiele sind kurze Pausen. Es gibt keine Käufe, keine Glücksräder und keine Werbung.</p>
      </main>
    </div>
  );
}

export function MiniGamePlayPage() {
  const { gameId } = useParams();
  const { progress } = useActiveProfile();
  const markMinigame = useApp((s) => s.markMinigame);
  const game = MINIGAMES.find((g) => g.id === gameId);
  const marked = useRef(false);
  useEffect(() => {
    if (game && progress.stars >= game.starsNeeded && !marked.current) { marked.current = true; markMinigame(); }
  }, [game, progress.stars, markMinigame]);
  if (!game || progress.stars < game.starsNeeded) {
    return (
      <div className="min-h-[100dvh]">
        <TopBar title="Mini-Spiel" back="/minispiele" />
        <main className="seite"><LinoSays text="Dieses Spiel ist noch nicht freigeschaltet. Sammle weiter Sterne!" mood="denken" /></main>
      </div>
    );
  }
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={game.title} back="/minispiele" />
      <main className="seite">
        {game.id === 'seifenblasen' && <Bubbles />}
        {game.id === 'ballons' && <Balloons />}
        {game.id === 'malen' && <Coloring />}
      </main>
    </div>
  );
}

interface Bubble { id: number; x: number; size: number; dur: number; hue: number }

function Bubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [count, setCount] = useState(0);
  const idRef = useRef(0);
  useEffect(() => {
    const t = setInterval(() => {
      setBubbles((b) => (b.length > 12 ? b : [...b, { id: idRef.current++, x: 5 + Math.random() * 80, size: 60 + Math.random() * 60, dur: 6 + Math.random() * 4, hue: Math.floor(Math.random() * 360) }]));
    }, 700);
    return () => clearInterval(t);
  }, []);
  const pop = (id: number) => {
    sfx.pop();
    setBubbles((b) => b.filter((x) => x.id !== id));
    setCount((c) => { const n = c + 1; if (n <= 20) speak(zahlwort(n)); return n; });
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-display text-3xl font-bold" aria-live="polite">Geplatzt: {count}</p>
      <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-himmel-100 to-himmel-300" aria-label="Seifenblasen zum Antippen">
        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.button
              key={b.id}
              type="button"
              aria-label="Seifenblase"
              onPointerDown={() => pop(b.id)}
              className="absolute rounded-full border-4 border-white/80"
              style={{ left: `${b.x}%`, width: b.size, height: b.size, background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), hsla(${b.hue},80%,70%,.35) 60%, hsla(${b.hue},80%,60%,.15))` }}
              initial={{ bottom: -120 }}
              animate={{ bottom: '110%' }}
              exit={{ scale: 1.6, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: b.dur, ease: 'linear' }}
              onAnimationComplete={() => setBubbles((all) => all.filter((x) => x.id !== b.id))}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Balloons() {
  const [round, setRound] = useState(0);
  const n = 5 + Math.min(round, 5);
  const order = useMemo(() => shuffle(createRng(), Array.from({ length: n }, (_, i) => i + 1)), [n, round]); // eslint-disable-line react-hooks/exhaustive-deps
  const [popped, setPopped] = useState<number[]>([]);
  const [wiggle, setWiggle] = useState<number | null>(null);
  const done = popped.length === n;
  const colors = ['#FF6F59', '#3A9BDC', '#2EC4B6', '#8E6CEF', '#FFB627', '#FF8FC7'];
  const tap = (v: number) => {
    if (v === popped.length + 1) { sfx.pop(); speak(zahlwort(v)); setPopped((p) => [...p, v]); if (v === n) sfx.win(); }
    else { setWiggle(v); setTimeout(() => setWiggle(null), 400); }
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center font-display text-2xl font-bold">Lass die Ballons der Reihe nach platzen: 1, 2, 3 …</p>
      <div className="grid w-full max-w-2xl grid-cols-3 gap-4 sm:grid-cols-5">
        {order.map((v, i) => (
          <motion.button
            key={`${round}-${v}`}
            type="button"
            onClick={() => tap(v)}
            disabled={popped.includes(v)}
            animate={popped.includes(v) ? { scale: 0, opacity: 0 } : wiggle === v ? { rotate: [0, -12, 12, 0] } : { y: [0, -8, 0] }}
            transition={popped.includes(v) ? { duration: 0.2 } : { duration: 2, repeat: wiggle === v ? 0 : Infinity, delay: i * 0.1 }}
            className="relative mx-auto flex h-28 w-24 items-center justify-center rounded-[50%] font-display text-4xl font-bold text-white shadow-knopf"
            style={{ background: colors[v % colors.length] }}
            aria-label={`Ballon ${v}`}
          >
            {v}
            <span className="absolute -bottom-6 left-1/2 h-6 w-0.5 bg-tinte/40" aria-hidden />
          </motion.button>
        ))}
      </div>
      {done && (
        <div className="flex flex-col items-center gap-3">
          <Confetti show />
          <LinoSays text="Super! Alle Ballons in der richtigen Reihenfolge!" mood="jubel" />
          <button className="knopf bg-sonne-500" onClick={() => { setPopped([]); setRound((r) => r + 1); }}>Nochmal mit mehr Ballons</button>
        </div>
      )}
    </div>
  );
}

const MAL_FARBEN = ['#FFB627', '#FF8A3D', '#FF6F59', '#FF8FC7', '#8E6CEF', '#3A9BDC', '#2EC4B6', '#38B000', '#8B5A2B', '#FFFFFF'];
type Region = 'maehne' | 'gesicht' | 'ohren' | 'nase' | 'koerper' | 'himmel' | 'wiese' | 'sonne';

function Coloring() {
  const [color, setColor] = useState(MAL_FARBEN[0]!);
  const [fills, setFills] = useState<Record<Region, string>>({ maehne: '#fff', gesicht: '#fff', ohren: '#fff', nase: '#fff', koerper: '#fff', himmel: '#fff', wiese: '#fff', sonne: '#fff' });
  const paint = (r: Region) => { sfx.pop(); setFills((f) => ({ ...f, [r]: color })); };
  const stroke = { stroke: '#2B2D42', strokeWidth: 4, strokeLinejoin: 'round' as const, cursor: 'pointer' };
  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
      <svg viewBox="0 0 300 300" className="w-full max-w-lg rounded-3xl bg-white shadow-karte" role="img" aria-label="Ausmalbild von Lino">
        <rect x="2" y="2" width="296" height="210" fill={fills.himmel} {...stroke} onClick={() => paint('himmel')} />
        <rect x="2" y="212" width="296" height="86" fill={fills.wiese} {...stroke} onClick={() => paint('wiese')} />
        <circle cx="250" cy="50" r="28" fill={fills.sonne} {...stroke} onClick={() => paint('sonne')} />
        <ellipse cx="150" cy="250" rx="60" ry="34" fill={fills.koerper} {...stroke} onClick={() => paint('koerper')} />
        <g onClick={() => paint('maehne')}>
          <path d="M150 40 C200 40 240 80 240 130 C240 180 200 220 150 220 C100 220 60 180 60 130 C60 80 100 40 150 40z" fill={fills.maehne} {...stroke} />
        </g>
        <g onClick={() => paint('ohren')}>
          <circle cx="108" cy="85" r="17" fill={fills.ohren} {...stroke} />
          <circle cx="192" cy="85" r="17" fill={fills.ohren} {...stroke} />
        </g>
        <ellipse cx="150" cy="135" rx="62" ry="56" fill={fills.gesicht} {...stroke} onClick={() => paint('gesicht')} />
        <ellipse cx="150" cy="155" rx="20" ry="15" fill={fills.nase} {...stroke} onClick={() => paint('nase')} />
        <circle cx="128" cy="122" r="8" fill="#2B2D42" pointerEvents="none" />
        <circle cx="172" cy="122" r="8" fill="#2B2D42" pointerEvents="none" />
        <path d="M138 172 q12 12 24 0" stroke="#2B2D42" strokeWidth="4" fill="none" strokeLinecap="round" pointerEvents="none" />
      </svg>
      <div className="flex flex-col gap-3">
        <p className="font-display text-xl font-bold">Wähle eine Farbe und tippe auf das Bild:</p>
        <div className="grid grid-cols-5 gap-3" role="radiogroup" aria-label="Farben">
          {MAL_FARBEN.map((c) => (
            <button key={c} type="button" role="radio" aria-checked={color === c} aria-label={`Farbe ${c}`} onClick={() => setColor(c)} className={`h-14 w-14 rounded-full border-2 border-tinte/20 shadow-knopf ${color === c ? 'ring-4 ring-tinte ring-offset-2' : ''}`} style={{ background: c }} />
          ))}
        </div>
        <button className="knopf bg-white" onClick={() => setFills((f) => Object.fromEntries(Object.keys(f).map((k) => [k, '#fff'])) as Record<Region, string>)}>Neu anfangen</button>
      </div>
    </div>
  );
}
