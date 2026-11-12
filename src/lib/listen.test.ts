import { afterEach, describe, expect, it } from 'vitest';
import { listenOnce } from './listen';

type Ev = { results: { length: number; [i: number]: { length: number; isFinal: boolean; [j: number]: { transcript: string; confidence: number } } } };

/** Skript je Sitzung: Liste von [Verzögerung, Ergebnisse] und ob danach onend kommt */
function install(sessions: { results?: [string, boolean][][]; endAfter?: number }[]) {
  let n = 0;
  class Fake {
    lang = ''; continuous = false; interimResults = false; maxAlternatives = 1;
    onresult: ((e: Ev) => void) | null = null;
    onerror: ((e: { error: string }) => void) | null = null;
    onend: (() => void) | null = null;
    private ended = false;
    start() {
      const s = sessions[Math.min(n++, sessions.length - 1)]!;
      const acc: [string, boolean][] = [];
      (s.results ?? []).forEach((batch, k) => setTimeout(() => {
        if (this.ended) return;
        acc.splice(0, acc.length, ...acc.filter(([, f]) => f), ...batch);
        const results: Ev['results'] = { length: acc.length };
        acc.forEach(([t, f], i) => { results[i] = { length: 1, isFinal: f, 0: { transcript: t, confidence: 0.9 } }; });
        this.onresult?.({ results });
      }, 20 + k * 40));
      if (s.endAfter !== undefined) setTimeout(() => this.end(), s.endAfter);
    }
    private end() { if (this.ended) return; this.ended = true; this.onend?.(); }
    stop() { setTimeout(() => this.end(), 10); }
    abort() { this.ended = true; }
  }
  (globalThis as unknown as { window: unknown }).window = { SpeechRecognition: Fake };
  return () => n;
}

afterEach(() => { delete (globalThis as unknown as { window?: unknown }).window; });

describe('Zuhören (großzügig für Kinder)', () => {
  it('hört weiter, wenn der Browser zu früh ohne Ergebnis aufhört', async () => {
    const starts = install([{ endAfter: 30 }, { endAfter: 30 }, { results: [[['good morning', true]]] }]);
    const r = await listenOnce('en-GB', { silenceMs: 100, timeoutMs: 5000 });
    expect(r.alternatives).toContain('good morning');
    expect(starts()).toBe(3);
  });

  it('setzt einen Satz mit Pause wieder zusammen', async () => {
    install([{ results: [[['I am', true]], [['fine thank you', true]]] }]);
    const r = await listenOnce('en-GB', { silenceMs: 150, timeoutMs: 5000 });
    expect(r.alternatives[0]).toBe('I am fine thank you');
  });

  it('nimmt das Zwischenergebnis, wenn kein Endergebnis kommt', async () => {
    const live: string[] = [];
    install([{ results: [[['ciao', false]], [['ciao come', false]]] }]);
    const r = await listenOnce('it-IT', { silenceMs: 120, timeoutMs: 5000, onInterim: (t) => live.push(t) });
    expect(r.alternatives).toContain('ciao come');
    expect(live.at(-1)).toBe('ciao come');
  });

  it('meldet „nichts gehört“ erst nach mehreren neuen Versuchen', async () => {
    const starts = install([{ endAfter: 20 }]);
    await expect(listenOnce('de-DE', { silenceMs: 100, timeoutMs: 1700 })).rejects.toBe('no-speech');
    expect(starts()).toBeGreaterThan(1);
  });
});
