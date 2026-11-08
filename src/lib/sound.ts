/** Kleine, synthetisch erzeugte Soundeffekte (funktionieren offline, keine Audiodateien nötig). */
let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundsEnabled(v: boolean): void { enabled = v; }

function ac(): AudioContext | null {
  if (!enabled) return null;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch { return null; }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.15): void {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.05);
}

export const sfx = {
  tap: () => tone(660, 0, 0.08, 'triangle', 0.08),
  correct: () => { tone(523, 0, 0.15); tone(659, 0.1, 0.15); tone(784, 0.2, 0.25); },
  tryAgain: () => { tone(392, 0, 0.15, 'triangle', 0.1); tone(349, 0.12, 0.2, 'triangle', 0.1); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.14)),
  pop: () => tone(880 + Math.random() * 300, 0, 0.06, 'square', 0.05),
  flip: () => tone(500, 0, 0.05, 'sine', 0.06)
};
