/**
 * Soundeffekte, synthetisch mit WebAudio erzeugt: funktionieren offline, keine Audiodateien nötig.
 * Alle Töne laufen über einen gemeinsamen Kompressor, damit nichts zu laut oder schrill wird.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

export function setSoundsEnabled(v: boolean): void { enabled = v; }

function ac(): AudioContext | null {
  if (!enabled) return null;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.ratio.value = 4;
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(comp).connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch { return null; }
}

interface ToneOpts { type?: OscillatorType; vol?: number; to?: number; detune?: number; attack?: number }

/** Ein Ton mit weicher Hüllkurve, optional mit Tonhöhen-Gleiten (to) und leicht verstimmtem zweitem Oszillator. */
function tone(freq: number, start: number, dur: number, o: ToneOpts = {}): void {
  const c = ac();
  if (!c || !master) return;
  const t0 = c.currentTime + start;
  const g = c.createGain();
  const vol = o.vol ?? 0.14;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + (o.attack ?? 0.012));
  g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
  g.connect(master);
  const voices = o.detune ? [-o.detune, o.detune] : [0];
  for (const d of voices) {
    const osc = c.createOscillator();
    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + dur * 0.8);
    osc.detune.value = d;
    osc.connect(g);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }
}

/** Glocke: Grundton plus leise Obertöne */
function bell(freq: number, start: number, dur = 0.5, vol = 0.12): void {
  tone(freq, start, dur, { vol });
  tone(freq * 2, start, dur * 0.6, { vol: vol * 0.35 });
  tone(freq * 3.01, start, dur * 0.35, { vol: vol * 0.15 });
}

/** Rauschen durch einen Filter, z. B. für ein weiches „Wusch“ */
function noise(start: number, dur: number, from: number, to: number, vol = 0.05): void {
  const c = ac();
  if (!c || !master) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass'; f.Q.value = 1.2;
  const t0 = c.currentTime + start;
  f.frequency.setValueAtTime(from, t0);
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + dur * 0.3);
  g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t0);
}

export const sfx = {
  /** Antippen von Knöpfen */
  tap: () => tone(900, 0, 0.07, { to: 700, vol: 0.06 }),
  /** Antwort ausgewählt (noch nicht geprüft) */
  select: () => tone(520, 0, 0.09, { type: 'triangle', to: 600, vol: 0.09 }),
  /** Richtig: helles Glockenspiel */
  correct: () => { bell(784, 0, 0.45); bell(1175, 0.11, 0.6); },
  /** Falsch: weicher, tiefer Ton – nicht schrill */
  tryAgain: () => { tone(330, 0, 0.18, { type: 'triangle', to: 300, vol: 0.1 }); tone(262, 0.14, 0.26, { type: 'triangle', to: 233, vol: 0.1 }); },
  /** Serie von richtigen Antworten */
  streak: () => [988, 1175, 1568].forEach((f, i) => bell(f, 0.32 + i * 0.07, 0.3, 0.07)),
  /** Lektion geschafft: kleine Fanfare mit Funkeln */
  win: () => {
    [523, 659, 784].forEach((f, i) => tone(f, i * 0.11, 0.28, { type: 'triangle', vol: 0.12, detune: 6 }));
    tone(1047, 0.36, 0.7, { type: 'triangle', vol: 0.14, detune: 6 });
    [1568, 2093, 1760, 2349].forEach((f, i) => bell(f, 0.5 + i * 0.08, 0.25, 0.04));
  },
  /** Neues Level */
  levelUp: () => { tone(392, 0, 0.5, { type: 'triangle', to: 1568, vol: 0.1 }); [1047, 1319, 1568].forEach((f, i) => bell(f, 0.45 + i * 0.09, 0.4, 0.08)); },
  /** Abzeichen oder Lektion freigeschaltet */
  unlock: () => [1319, 1760, 2093, 2637].forEach((f, i) => bell(f, i * 0.06, 0.35, 0.05)),
  /** Puppy kommt zum Helfen */
  help: () => { tone(440, 0, 0.12, { type: 'sine', to: 660, vol: 0.1 }); tone(660, 0.12, 0.16, { type: 'sine', to: 880, vol: 0.09 }); },
  /** Weiter zur nächsten Aufgabe */
  whoosh: () => noise(0, 0.22, 600, 2400, 0.04),
  pop: () => tone(880 + Math.random() * 300, 0, 0.07, { to: 1400, vol: 0.06 }),
  flip: () => tone(500, 0, 0.06, { to: 760, vol: 0.06 })
};
