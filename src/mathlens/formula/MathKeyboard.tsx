/** Mathe-Tastatur: Ziffern, Rechenzeichen, Klammern, Bruch, Potenz, x und =. */
import { Delete, ChevronLeft, ChevronRight } from 'lucide-react';
import { L } from '../../i18n';

export type KeyAction = { insert: string; caretBack?: number } | { action: 'back' | 'left' | 'right' | 'clear' };

const k = (label: string, insert: string, extra: { caretBack?: number; wide?: boolean; tone?: 'op' | 'x' } = {}) => ({ label, act: { insert, caretBack: extra.caretBack } as KeyAction, ...extra });

export function MathKeyboard({ onKey }: { onKey: (a: KeyAction) => void }) {
  const rows = [
    [k('x', 'x', { tone: 'x' }), k('(', '('), k(')', ')'), k('a/b', '()/()', { caretBack: 4, tone: 'op' }), k('xⁿ', '^', { tone: 'op' }), k('%', '%', { tone: 'op' })],
    [k('7', '7'), k('8', '8'), k('9', '9'), k('÷', ':', { tone: 'op' }), k('[', '['), k(']', ']')],
    [k('4', '4'), k('5', '5'), k('6', '6'), k('×', '×', { tone: 'op' }), k('{', '{'), k('}', '}')],
    [k('1', '1'), k('2', '2'), k('3', '3'), k('−', '−', { tone: 'op' }), k('/', '/', { tone: 'op' }), k('=', '=', { tone: 'op' })],
    [k('0', '0'), k(',', ','), k('+', '+', { tone: 'op' })]
  ];
  const base = 'flex h-12 items-center justify-center rounded-xl font-display text-xl font-bold transition active:scale-95 select-none';
  const tone = { op: 'bg-himmel-100 text-himmel-700', x: 'bg-lila-500 text-white' } as const;
  return (
    <div className="grid grid-cols-6 gap-1.5 rounded-2xl bg-tinte/[0.04] p-2" role="group" aria-label={L('Mathe-Tastatur', 'Tastiera matematica')} data-testid="mathe-tastatur">
      {rows.flat().map((key) => (
        <button key={key.label} type="button" className={`${base} ${key.tone ? tone[key.tone] : 'bg-flaeche text-tinte shadow-[0_1px_0_rgba(16,24,40,0.08)]'}`}
          onPointerDown={(e) => e.preventDefault()} onClick={() => onKey(key.act)} aria-label={key.label === 'a/b' ? L('Bruch', 'Frazione') : key.label === 'xⁿ' ? L('Potenz', 'Potenza') : key.label} data-key={key.label}>
          {key.label}
        </button>
      ))}
      <button type="button" className={`${base} bg-flaeche`} onPointerDown={(e) => e.preventDefault()} onClick={() => onKey({ action: 'left' })} aria-label={L('Cursor links', 'Cursore a sinistra')}><ChevronLeft /></button>
      <button type="button" className={`${base} bg-flaeche`} onPointerDown={(e) => e.preventDefault()} onClick={() => onKey({ action: 'right' })} aria-label={L('Cursor rechts', 'Cursore a destra')}><ChevronRight /></button>
      <button type="button" className={`${base} bg-koralle-100 text-koralle-700`} onPointerDown={(e) => e.preventDefault()} onClick={() => onKey({ action: 'back' })} aria-label={L('Löschen', 'Cancella')} data-key="back"><Delete /></button>
    </div>
  );
}

/** Taste auf Text + Cursor anwenden. */
export function applyKey(text: string, caret: number, a: KeyAction): { text: string; caret: number } {
  if ('insert' in a) {
    const t = text.slice(0, caret) + a.insert + text.slice(caret);
    return { text: t, caret: caret + a.insert.length - (a.caretBack ?? 0) };
  }
  switch (a.action) {
    case 'back': return caret > 0 ? { text: text.slice(0, caret - 1) + text.slice(caret), caret: caret - 1 } : { text, caret };
    case 'left': return { text, caret: Math.max(0, caret - 1) };
    case 'right': return { text, caret: Math.min(text.length, caret + 1) };
    case 'clear': return { text: '', caret: 0 };
  }
}
