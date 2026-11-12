import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ChoiceOption, ChoiceTask } from '../learning/types';
import { Shape } from '../components/Shape';
import { speak } from '../lib/speech';
import type { TaskViewProps } from './types';
import { L, getLang, locale } from '../i18n';
import { VoiceAnswer } from '../components/voice/Voice';
import { matchOption } from '../lib/voiceMatch';
import { sfx } from '../lib/sound';

export function ChoiceView({ task, onCorrect, onWrong, reveal, done, onPending }: TaskViewProps<ChoiceTask>) {
  const [wrong, setWrong] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => { setWrong([]); setChosen(null); setSelected(null); }, [task.id]);

  const evaluate = (id: string) => {
    if (id === task.correctId) { setChosen(id); onCorrect(); }
    else { setWrong((w) => [...w, id]); onWrong(); }
  };

  // Prüfen-Modus: Auswahl melden, ausgewertet wird erst beim Prüfen
  useEffect(() => {
    if (!onPending) return;
    if (!selected || done || reveal) { onPending(null); return; }
    const id = selected;
    onPending(() => { setSelected(null); evaluate(id); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, done, reveal, onPending]);

  const choose = (o: ChoiceOption) => {
    if (done || reveal || wrong.includes(o.id)) return;
    if (o.speak) speak(o.speak, o.speakLang ? { lang: o.speakLang, rate: 0.9, pitch: 1 } : {});
    if (onPending) { sfx.select(); setSelected(o.id); return; }
    evaluate(o.id);
  };

  // Tastatur: 1–9 wählt eine Antwort (Prüfen-Modus)
  useEffect(() => {
    if (!onPending) return;
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const i = Number(e.key) - 1;
      const o = task.options[i];
      if (o && Number.isInteger(i)) choose(o);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  // Große Darstellung nur für kurze Inhalte (Zahlen, Zeichen) – längere Wörter passen sonst nicht in die Kacheln
  const rawStyle = task.optionStyle ?? 'text';
  const style = rawStyle === 'big' && task.options.some((o) => (o.label ?? '').length > 4) ? 'text' : rawStyle;
  const n = task.options.length;
  const grid =
    style === 'text' ? (n > 3 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')
      : style === 'color' ? (n > 4 ? 'grid-cols-3' : n === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3')
        : n === 2 ? 'grid-cols-2' : n === 3 ? 'grid-cols-3' : n === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3';

  // Sprachantwort: nur wenn jede Möglichkeit einen sagbaren Namen hat
  const spoken = task.options.map((o) => o.label ?? o.speak ?? '');
  const voiceOk = spoken.every((x) => x.trim().length > 0);
  const voiceLang = task.options[0]?.speakLang ?? locale();
  const onHeard = (alts: string[]): string | null => {
    const i = matchOption(alts, spoken, voiceLang.slice(0, 2) || getLang());
    const o = i === null ? undefined : task.options[i];
    if (!o) return L(`Ich habe „${alts[0]}“ verstanden. Sag eine der Antworten oder tippe sie an.`, `Ho capito «${alts[0]}». Di’ una delle risposte oppure toccala.`);
    if (wrong.includes(o.id)) return L(`„${spoken[i!]}“ hast du schon probiert.`, `«${spoken[i!]}» l’hai già provata.`);
    choose(o);
    return null;
  };

  return (
    <>
    <div className={`grid w-full gap-3 sm:gap-4 ${style === 'text' ? 'max-w-3xl' : 'max-w-2xl'} ${grid}`} role="group" aria-label={L('Antwortmöglichkeiten', 'Risposte possibili')}>
      {task.options.map((o) => {
        const isWrong = wrong.includes(o.id);
        const isRight = (chosen === o.id || (reveal && o.id === task.correctId));
        const isSel = selected === o.id;
        return (
          <motion.button
            key={o.id}
            type="button"
            data-testid={`option-${o.id}`}
            data-correct={o.id === task.correctId ? 'true' : undefined}
            onClick={() => choose(o)}
            disabled={isWrong || done}
            aria-label={ariaFor(o)}
            aria-pressed={onPending ? isSel : undefined}
            animate={isWrong ? { x: [0, -10, 10, -6, 6, 0] } : isRight ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.45 }}
            whileTap={{ scale: 0.94 }}
            className={[
              'knopf relative flex-col text-tinte',
              isSel ? 'bg-himmel-50 ring-4 ring-himmel-500' : 'bg-white',
              style === 'text' ? 'min-h-[4.5rem] justify-center px-4 text-xl sm:text-2xl' : 'aspect-square min-h-[5.5rem] p-2',
              style === 'big' ? 'font-display text-5xl sm:text-6xl' : '',
              isWrong ? 'opacity-40' : '',
              isRight ? 'ring-4 ring-minze-500 disabled:opacity-100' : '',
              reveal && o.id === task.correctId ? 'animate-pulse' : ''
            ].join(' ')}
          >
            <OptionContent o={o} style={style} />
            {isRight && <span className="absolute -right-2 -top-2 rounded-full bg-minze-500 p-1 text-white"><Check size={22} /></span>}
          </motion.button>
        );
      })}
    </div>
    {voiceOk && !done && !reveal && <VoiceAnswer locale={voiceLang} onHeard={onHeard} />}
    </>
  );
}

function ariaFor(o: ChoiceOption): string {
  return o.label ?? o.speak ?? (o.scale ? (o.scale > 1.2 ? 'großes Bild' : o.scale < 0.7 ? 'kleines Bild' : 'mittleres Bild') : o.emoji ?? o.id);
}

function OptionContent({ o, style }: { o: ChoiceOption; style: string }) {
  if (style === 'color' && o.color) {
    return (
      <>
        <span className="block h-[70%] w-[70%] rounded-full border-4 border-tinte/10" style={{ background: o.color }} aria-hidden />
        <span className="mt-1 text-sm font-bold sm:text-base">{o.label}</span>
      </>
    );
  }
  if (style === 'shape' && o.shape) return <Shape shape={o.shape} color={o.color} size={96} />;
  if (o.emoji) {
    return (
      <span className={`emoji ${o.silhouette ? 'silhouette' : ''}`} style={{ fontSize: `${(o.scale ?? 1) * 3.6}rem` }} aria-hidden>
        {o.emoji}
      </span>
    );
  }
  return <span className="break-words leading-tight">{o.label}</span>;
}
