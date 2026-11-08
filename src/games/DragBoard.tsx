import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../lib/sound';
import { L } from '../i18n';

export interface BoardPiece { id: string; render: () => ReactNode; label: string }
export interface BoardTarget { id: string; accepts: string; render: (filled: boolean) => ReactNode; label: string }

interface Props {
  pieces: BoardPiece[];
  targets: BoardTarget[];
  onCorrectDrop?: () => void;
  onWrongDrop: () => void;
  onComplete: () => void;
  reveal: boolean;
  done: boolean;
  resetKey: string;
  targetLayout: string;
  pieceSize?: string;
  targetSize?: string;
}

/**
 * Drag-and-Drop-Spielfeld für Touch und Maus.
 * Alternativ: Teil antippen, dann Ziel antippen (barrierearm).
 */
export function DragBoard({ pieces, targets, onCorrectDrop, onWrongDrop, onComplete, reveal, done, resetKey, targetLayout, pieceSize = 'h-24 w-24', targetSize = 'h-28 w-28' }: Props) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongTarget, setWrongTarget] = useState<string | null>(null);
  useEffect(() => { setPlaced({}); setSelected(null); }, [resetKey]);

  const tryPlace = (pieceId: string, targetId: string) => {
    const t = targets.find((x) => x.id === targetId);
    if (!t || placed[targetId]) return false;
    if (t.accepts === pieceId) {
      sfx.pop();
      const next = { ...placed, [targetId]: pieceId };
      setPlaced(next);
      setSelected(null);
      onCorrectDrop?.();
      if (Object.keys(next).length === targets.length) setTimeout(onComplete, 300);
      return true;
    }
    setWrongTarget(targetId);
    setTimeout(() => setWrongTarget(null), 500);
    onWrongDrop();
    return false;
  };

  const onDragEnd = (pieceId: string, point: { x: number; y: number }) => {
    const els = document.elementsFromPoint(point.x - window.scrollX, point.y - window.scrollY);
    const el = els.find((e) => (e as HTMLElement).dataset?.target) as HTMLElement | undefined;
    if (el?.dataset.target) tryPlace(pieceId, el.dataset.target);
  };

  const placedPieces = Object.values(placed);
  const hintPiece = reveal ? (selected ?? pieces.find((p) => !placedPieces.includes(p.id))?.id) : null;
  const hintTarget = hintPiece ? targets.find((t) => t.accepts === hintPiece)?.id : null;

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      <div className={targetLayout} role="group" aria-label={L('Zielfelder', 'Caselle di destinazione')}>
        {targets.map((t) => {
          const p = placed[t.id];
          const piece = p ? pieces.find((x) => x.id === p) : undefined;
          return (
            <motion.button
              type="button"
              key={t.id}
              data-target={t.id}
              data-testid={`target-${t.accepts}`}
              onClick={() => selected && tryPlace(selected, t.id)}
              animate={wrongTarget === t.id ? { x: [0, -8, 8, -5, 5, 0] } : {}}
              className={`relative flex items-center justify-center rounded-3xl border-4 ${targetSize} ${p ? 'border-minze-500 bg-minze-100' : 'border-dashed border-tinte/20 bg-white/70'} ${hintTarget === t.id ? 'ring-8 ring-sonne-500' : ''} ${selected && !p ? 'cursor-pointer' : ''}`}
              aria-label={p ? `${t.label}: richtig belegt` : `Ziel: ${t.label}`}
            >
              <span data-target={t.id} className="pointer-events-none">{piece ? piece.render() : t.render(false)}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="flex min-h-[7rem] flex-wrap justify-center gap-3 rounded-3xl bg-white/50 p-3" role="group" aria-label={L('Teile zum Verschieben', 'Pezzi da spostare')}>
        {pieces.filter((p) => !placedPieces.includes(p.id)).map((p) => (
          <motion.button
            type="button"
            key={p.id}
            data-testid={`piece-${p.id}`}
            drag={!done}
            dragSnapToOrigin
            dragMomentum={false}
            dragElastic={0.9}
            whileDrag={{ scale: 1.12, zIndex: 50 }}
            onDragEnd={(_, info) => onDragEnd(p.id, info.point)}
            onTap={() => { sfx.tap(); setSelected((s) => (s === p.id ? null : p.id)); }}
            className={`relative z-10 flex touch-none items-center justify-center rounded-3xl bg-white shadow-knopf ${pieceSize} ${selected === p.id ? 'ring-8 ring-himmel-500' : ''} ${hintPiece === p.id ? 'animate-bounce' : ''}`}
            aria-label={`${p.label}${selected === p.id ? ' (ausgewählt – tippe auf ein Ziel)' : ''}`}
            aria-pressed={selected === p.id}
          >
            {p.render()}
          </motion.button>
        ))}
      </div>
      <p className="text-center text-base text-tinte/60">{L('Tipp: Du kannst ein Teil auch antippen und dann auf das Ziel tippen.', 'Suggerimento: puoi anche toccare un pezzo e poi la sua casella.')}</p>
    </div>
  );
}
