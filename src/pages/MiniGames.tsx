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
import { L, tr } from '../i18n';

export function MiniGamesPage() {
  const { progress } = useActiveProfile();
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Mini-Spiele', 'Minigiochi')} back="/home" stars={progress.stars} />
      <main className="seite">
        <LinoSays text={L('Mit deinen Sternen schaltest du Mini-Spiele frei. Sie bleiben für immer offen!', 'Con le tue stelle sblocchi i minigiochi. Restano aperti per sempre!')} size={80} />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MINIGAMES.map((g) => {
            const open = progress.stars >= g.starsNeeded;
            const inner = (
              <div className={`karte flex h-full flex-col items-center gap-2 p-6 text-center ${open ? '' : 'opacity-60'}`}>
                <span className="emoji text-7xl">{open ? g.emoji : '🔒'}</span>
                <span className="font-display text-2xl font-bold">{tr(g.title)}</span>
                <span className="text-tinte/70">{tr(g.description)}</span>
                {!open && <span className="mt-2 flex items-center gap-1 rounded-full bg-sonne-100 px-3 py-1 font-bold"><Lock size={16} /> {L(`ab ${g.starsNeeded} Sternen`, `da ${g.starsNeeded} stelle`)}</span>}
              </div>
            );
            return open
              ? <Link key={g.id} to={`/minispiele/${g.id}`} data-testid={`minispiel-${g.id}`}>{inner}</Link>
              : <div key={g.id} aria-disabled="true" data-testid={`minispiel-${g.id}`}>{inner}</div>;
          })}
        </div>
        <p className="mt-6 text-center text-sm text-tinte/60">{L('Mini-Spiele sind kurze Pausen. Es gibt keine Käufe, keine Glücksräder und keine Werbung.', 'I minigiochi sono brevi pause. Niente acquisti, niente ruote della fortuna e niente pubblicità.')}</p>
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
        <TopBar title={L('Mini-Spiel', 'Minigioco')} back="/minispiele" />
        <main className="seite"><LinoSays text={L('Dieses Spiel ist noch nicht freigeschaltet. Sammle weiter Sterne!', 'Questo gioco non è ancora sbloccato. Continua a raccogliere stelle!')} mood="denken" /></main>
      </div>
    );
  }
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={tr(game.title)} back="/minispiele" />
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
      <p className="font-display text-3xl font-bold" aria-live="polite">{L('Geplatzt', 'Scoppiate')}: {count}</p>
      <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-himmel-100 to-himmel-300" aria-label={L('Seifenblasen zum Antippen', 'Bolle da toccare')}>
        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.button
              key={b.id}
              type="button"
              aria-label={L('Seifenblase', 'Bolla di sapone')}
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
      <p className="text-center font-display text-2xl font-bold">{L('Lass die Ballons der Reihe nach platzen: 1, 2, 3 …', 'Fai scoppiare i palloncini in ordine: 1, 2, 3 …')}</p>
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
            aria-label={L(`Ballon ${v}`, `Palloncino ${v}`)}
          >
            {v}
            <span className="absolute -bottom-6 left-1/2 h-6 w-0.5 bg-tinte/40" aria-hidden />
          </motion.button>
        ))}
      </div>
      {done && (
        <div className="flex flex-col items-center gap-3">
          <Confetti show />
          <LinoSays text={L('Super! Alle Ballons in der richtigen Reihenfolge!', 'Super! Tutti i palloncini nell’ordine giusto!')} mood="jubel" />
          <button className="knopf bg-sonne-500" onClick={() => { setPopped([]); setRound((r) => r + 1); }}>{L('Nochmal mit mehr Ballons', 'Ancora, con più palloncini')}</button>
        </div>
      )}
    </div>
  );
}

const MAL_FARBEN = ['#FFB627', '#FF8A3D', '#FF6F59', '#FF8FC7', '#8E6CEF', '#3A9BDC', '#2EC4B6', '#38B000', '#8B5A2B', '#FFFFFF'];
type Region = 'ohren' | 'kopf' | 'schnauze' | 'hoodie' | 'hose' | 'schuhe' | 'himmel' | 'wiese' | 'sonne';

function Coloring() {
  const [color, setColor] = useState(MAL_FARBEN[0]!);
  const [fills, setFills] = useState<Record<Region, string>>({ ohren: '#fff', kopf: '#fff', schnauze: '#fff', hoodie: '#fff', hose: '#fff', schuhe: '#fff', himmel: '#fff', wiese: '#fff', sonne: '#fff' });
  const paint = (r: Region) => { sfx.pop(); setFills((f) => ({ ...f, [r]: color })); };
  const stroke = { stroke: '#2B2D42', strokeWidth: 4, strokeLinejoin: 'round' as const, cursor: 'pointer' };
  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
      <svg viewBox="0 0 300 300" className="w-full max-w-lg rounded-3xl bg-white shadow-karte" role="img" aria-label={L('Ausmalbild von Puppy', 'Disegno di Puppy da colorare')}>
        <rect x="2" y="2" width="296" height="210" fill={fills.himmel} {...stroke} onClick={() => paint('himmel')} />
        <rect x="2" y="212" width="296" height="86" fill={fills.wiese} {...stroke} onClick={() => paint('wiese')} />
        <circle cx="250" cy="50" r="28" fill={fills.sonne} {...stroke} onClick={() => paint('sonne')} />
        <g transform="translate(40 22) scale(1.1)">
          <g onClick={() => paint('hose')}>
            <path d="M68 168 L99 168 L97 202 L71 202 Z" fill={fills.hose} {...stroke} />
            <path d="M101 168 L132 168 L129 202 L103 202 Z" fill={fills.hose} {...stroke} />
          </g>
          <g onClick={() => paint('schuhe')}>
            <path d="M54 216 Q54 202 70 201 L94 201 Q100 205 100 216 Z" fill={fills.schuhe} {...stroke} />
            <path d="M146 216 Q146 202 130 201 L106 201 Q100 205 100 216 Z" fill={fills.schuhe} {...stroke} />
          </g>
          <g onClick={() => paint('hoodie')}>
            <path d="M64 124 Q58 148 63 172 L137 172 Q142 148 136 124 Q100 114 64 124 Z" fill={fills.hoodie} {...stroke} />
            <path d="M68 126 Q54 142 66 160 L80 156 Q72 142 78 132 Z" fill={fills.hoodie} {...stroke} />
            <path d="M130 124 Q150 120 160 128 L156 141 Q144 136 132 142 Z" fill={fills.hoodie} {...stroke} />
            <path d="M80 148 L120 148 L127 164 L73 164 Z" fill={fills.hoodie} {...stroke} />
          </g>
          <circle cx="163" cy="133" r="8.5" fill={fills.kopf} {...stroke} onClick={() => paint('kopf')} />
          <g onClick={() => paint('ohren')}>
            <path d="M60 32 C34 10 6 34 14 66 C18 84 4 98 14 116 C26 136 54 124 58 100 Z" fill={fills.ohren} {...stroke} />
            <path d="M140 32 C166 10 194 34 186 66 C182 84 196 98 186 116 C174 136 146 124 142 100 Z" fill={fills.ohren} {...stroke} />
          </g>
          <ellipse cx="100" cy="60" rx="46" ry="44" fill={fills.kopf} {...stroke} onClick={() => paint('kopf')} />
          <path d="M57 68 Q60 102 100 121 Q140 102 143 68 Q122 58 100 64 Q78 58 57 68 Z" fill={fills.schnauze} {...stroke} onClick={() => paint('schnauze')} />
          <g pointerEvents="none">
            <ellipse cx="82" cy="50" rx="13" ry="16" fill="#fff" stroke="#2B2D42" strokeWidth="3" />
            <ellipse cx="118" cy="50" rx="13" ry="16" fill="#fff" stroke="#2B2D42" strokeWidth="3" />
            <circle cx="85" cy="54" r="6" fill="#2B2D42" />
            <circle cx="115" cy="54" r="6" fill="#2B2D42" />
            <ellipse cx="100" cy="75" rx="7.5" ry="5.5" fill="#2B2D42" />
            <path d="M82 88 Q100 110 118 88" stroke="#2B2D42" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      <div className="flex flex-col gap-3">
        <p className="font-display text-xl font-bold">{L('Wähle eine Farbe und tippe auf das Bild:', 'Scegli un colore e tocca il disegno:')}</p>
        <div className="grid grid-cols-5 gap-3" role="radiogroup" aria-label={L('Farben', 'Colori')}>
          {MAL_FARBEN.map((c) => (
            <button key={c} type="button" role="radio" aria-checked={color === c} aria-label={L(`Farbe ${c}`, `Colore ${c}`)} onClick={() => setColor(c)} className={`h-14 w-14 rounded-full border-2 border-tinte/20 shadow-knopf ${color === c ? 'ring-4 ring-tinte ring-offset-2' : ''}`} style={{ background: c }} />
          ))}
        </div>
        <button className="knopf bg-white" onClick={() => setFills((f) => Object.fromEntries(Object.keys(f).map((k) => [k, '#fff'])) as Record<Region, string>)}>{L('Neu anfangen', 'Ricomincia')}</button>
      </div>
    </div>
  );
}
