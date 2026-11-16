/**
 * Die Übungstypen von LinguaFlow. Sie kennen keine einzelne Sprache: alles kommt aus dem Kurspaket
 * (Texte, Segmente, richtige Varianten, Erklärungen).
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { isAccepted, joinSegments, normalizeAnswer } from './answer';
import { dirOf, nameOf } from './catalog';
import { bigButton, cn, PlayButton, SourceText, TargetText } from './components';
import { useT } from './i18n';
import { playItem, type VoiceState } from './voice';
import type { Exercise, Item, LoadedCourse } from './types';

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j]!, r[i]!]; }
  return r;
}

export interface CheckResult { ok: boolean; solution: ReactNode }

interface Props {
  ex: Exercise;
  course: LoadedCourse;
  voice: VoiceState;
  showTranslit: boolean;
  /** nach „Prüfen“: Ergebnis an die Lektion */
  onChecked: (r: CheckResult) => void;
  locked: boolean;
}

/** Übersetzung eines Elements in der Ausgangssprache */
const trOf = (course: LoadedCourse, id: string) => course.tr.items[id] ?? '';

export function ExerciseView(p: Props) {
  const { t, ui } = useT();
  const { ex, course } = p;
  const target = course.entry.target;
  const source = course.entry.source;
  const lang = nameOf(target, ui);
  const item = 'item' in ex ? course.items.get(ex.item) : undefined;
  const canHear = !!item && (!!item.audio || p.voice === 'yes');

  let title: string;
  switch (ex.type) {
    case 'listen': title = canHear ? t('ex.listen') : t('ex.read'); break;
    case 'choice': title = ex.direction === 'toSource' ? t('ex.choiceToSource') : t('ex.choiceToTarget', { lang }); break;
    case 'cloze': title = t('ex.cloze'); break;
    case 'order': title = t('ex.order'); break;
    case 'write': title = t('ex.write', { lang }); break;
    default: title = t('ex.situation');
  }

  return (
    <div className="flex flex-col gap-5" data-testid="esercizio" data-type={ex.type} data-id={ex.id} data-mode={ex.type === 'listen' ? (canHear ? 'ascolto' : 'lettura') : undefined}>
      <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
      <Body {...p} canHear={canHear} item={item} source={source} target={target} />
    </div>
  );
}

function Body(p: Props & { canHear: boolean; item?: Item; source: string; target: string }) {
  const { ex } = p;
  switch (ex.type) {
    case 'listen': return <ListenOrChoice {...p} ex={ex} />;
    case 'choice': return <ListenOrChoice {...p} ex={ex} />;
    case 'cloze': return <Cloze {...p} ex={ex} />;
    case 'order': return <Order {...p} ex={ex} />;
    case 'write': return <Write {...p} ex={ex} />;
    case 'situation': return <Situation {...p} ex={ex} />;
  }
}

type Sub<E> = Omit<Props, 'ex'> & { ex: E; canHear: boolean; item?: Item; source: string; target: string };

function CheckButton({ disabled, onClick, hidden }: { disabled: boolean; onClick: () => void; hidden: boolean }) {
  const { t } = useT();
  if (hidden) return null;
  return <button type="button" className={bigButton('primary', 'w-full sm:w-auto sm:self-end')} disabled={disabled} onClick={onClick} data-testid="controlla">{t('ex.check')}</button>;
}

function Options({ options, picked, onPick, locked, correct, render }: {
  options: string[]; picked: string | null; onPick: (o: string) => void; locked: boolean; correct: string; render: (o: string) => ReactNode;
}) {
  return (
    <div className="grid gap-2.5" role="radiogroup">
      {options.map((o, i) => (
        <button key={`${o}-${i}`} type="button" role="radio" aria-checked={picked === o} disabled={locked} onClick={() => onPick(o)}
          data-testid="opzione" data-correct={o === correct ? 'true' : undefined}
          className={cn('flex min-h-[3.25rem] items-center gap-3 rounded-xl border-2 border-b-4 px-4 py-2.5 text-start text-lg transition',
            picked === o ? 'border-himmel-500 bg-himmel-50' : 'border-tinte/15 bg-flaeche hover:bg-tinte/[0.03]',
            locked && o === correct && 'border-minze-500 bg-minze-50')}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-tinte/15 text-sm font-bold text-tinte/50">{i + 1}</span>
          <span className="min-w-0 flex-1">{render(o)}</span>
        </button>
      ))}
    </div>
  );
}

function ListenOrChoice(p: Sub<Extract<Exercise, { type: 'listen' | 'choice' }>>) {
  const { ex, course, item, target, source } = p;
  const options = useMemo(() => shuffle(ex.options), [ex]);
  const [picked, setPicked] = useState<string | null>(null);
  const showTarget = ex.type === 'listen' ? !p.canHear : ex.direction === 'toSource';
  const optionsInTarget = ex.type === 'choice' && ex.direction === 'toTarget';
  const played = useRef(false);
  useEffect(() => {
    if (ex.type === 'listen' && p.canHear && item && !played.current) { played.current = true; playItem(item, target, p.voice); }
  }, [ex.type, p.canHear, item, target, p.voice]);
  const { t } = useT();
  if (!item) return null;
  const optItem = (id: string) => course.items.get(id);
  return (
    <>
      <div className="flex items-center gap-4 rounded-2xl bg-flaeche p-4 ring-1 ring-tinte/[0.07]">
        {ex.type === 'listen' && p.canHear
          ? <><PlayButton item={item} lang={target} voice={p.voice} label={t('ex.listenAgain')} size="lg" /><span className="text-tinte/60">{t('ex.listenAgain')}</span></>
          : showTarget
            ? <><PlayButton item={item} lang={target} voice={p.voice} label={t('lesson.play')} /><TargetText item={item} lang={target} showTranslit={p.showTranslit} className="text-2xl font-bold" /></>
            : <SourceText lang={source} className="text-2xl font-bold" testId="testo-origine">{trOf(course, item.id)}</SourceText>}
      </div>
      <Options options={options} picked={picked} onPick={setPicked} locked={p.locked} correct={ex.item}
        render={(id) => optionsInTarget
          ? <TargetText item={optItem(id) ?? { text: id }} lang={target} showTranslit={p.showTranslit} />
          : <SourceText lang={source}>{trOf(course, id)}</SourceText>} />
      <CheckButton hidden={p.locked} disabled={!picked} onClick={() => p.onChecked({
        ok: picked === ex.item,
        solution: optionsInTarget ? <TargetText item={item} lang={target} showTranslit /> : <SourceText lang={source}>{trOf(course, item.id)}</SourceText>
      })} />
    </>
  );
}

function Cloze(p: Sub<Extract<Exercise, { type: 'cloze' }>>) {
  const { ex, course, item, target, source } = p;
  const options = useMemo(() => shuffle(ex.options), [ex]);
  const [picked, setPicked] = useState<string | null>(null);
  if (!item) return null;
  const at = item.text.indexOf(ex.gap);
  const before = item.text.slice(0, at);
  const after = item.text.slice(at + ex.gap.length);
  return (
    <>
      <div className="rounded-2xl bg-flaeche p-4 ring-1 ring-tinte/[0.07]">
        <p lang={target} dir={dirOf(target)} className="text-2xl font-bold leading-relaxed" data-testid="testo-lingua">
          {before}<span className={cn('mx-1 inline-block min-w-[4ch] border-b-4 px-1 text-center', picked ? 'border-himmel-500 text-himmel-700' : 'border-tinte/25 text-transparent')}>{picked ?? '___'}</span>{after}
        </p>
        <SourceText lang={source} className="mt-2 block text-tinte/60">{trOf(course, item.id)}</SourceText>
      </div>
      <Options options={options} picked={picked} onPick={setPicked} locked={p.locked} correct={ex.gap}
        render={(o) => <span lang={target} dir={dirOf(target)}>{o}</span>} />
      <CheckButton hidden={p.locked} disabled={!picked} onClick={() => p.onChecked({ ok: picked === ex.gap, solution: <TargetText item={item} lang={target} showTranslit /> })} />
    </>
  );
}

function Order(p: Sub<Extract<Exercise, { type: 'order' }>>) {
  const { ex, course, item, target, source } = p;
  const { t } = useT();
  // Segmente kommen aus der Lektion (nicht nach Leerzeichen getrennt) – nötig für Sprachen ohne Leerzeichen
  const pool = useMemo(() => shuffle([...ex.segments.map((s, i) => ({ s, key: `s${i}`, pos: i })), ...(ex.extra ?? []).map((s, i) => ({ s, key: `x${i}`, pos: -1 }))]), [ex]);
  const [chosen, setChosen] = useState<string[]>([]);
  if (!item) return null;
  const byKey = new Map(pool.map((x) => [x.key, x]));
  const answer = chosen.map((k) => byKey.get(k)!.s);
  const chip = 'rounded-xl border-2 border-b-4 border-tinte/15 bg-flaeche px-3.5 py-2 text-lg font-semibold transition active:border-b-2 disabled:opacity-40';
  return (
    <>
      <div className="rounded-2xl bg-flaeche p-4 ring-1 ring-tinte/[0.07]">
        <SourceText lang={source} className="text-xl font-bold" testId="testo-origine">{trOf(course, item.id)}</SourceText>
      </div>
      <div lang={target} dir={dirOf(target)} className="flex min-h-[3.75rem] flex-wrap content-start gap-2 border-b-2 border-tinte/15 pb-3" data-testid="risposta-ordine" aria-live="polite">
        {chosen.map((k) => (
          <button key={k} type="button" className={chip} disabled={p.locked} onClick={() => setChosen((c) => c.filter((x) => x !== k))}>{byKey.get(k)!.s}</button>
        ))}
      </div>
      <p className="text-sm text-tinte/55">{t('ex.tapWords')}</p>
      <div lang={target} dir={dirOf(target)} className="flex flex-wrap gap-2">
        {pool.map((x) => (
          <button key={x.key} type="button" className={chip} disabled={p.locked || chosen.includes(x.key)} data-testid="segmento" data-pos={x.pos}
            onClick={() => setChosen((c) => [...c, x.key])}>{x.s}</button>
        ))}
      </div>
      <CheckButton hidden={p.locked} disabled={!chosen.length} onClick={() => {
        const norm = (s: string) => normalizeAnswer(s, target).replace(/\s/g, '');
        p.onChecked({ ok: norm(joinSegments(answer, target)) === norm(joinSegments(ex.segments, target)), solution: <TargetText item={item} lang={target} showTranslit /> });
      }} />
    </>
  );
}

function TextAnswer({ target, locked, value, onChange, onEnter, answer }: { target: string; locked: boolean; value: string; onChange: (v: string) => void; onEnter: () => void; answer: string }) {
  const { t } = useT();
  return (
    <textarea lang={target} dir={dirOf(target)} value={value} onChange={(e) => onChange(e.target.value)} disabled={locked} rows={2}
      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onEnter(); } }}
      autoCapitalize="sentences" autoCorrect="off" spellCheck={false} placeholder={t('ex.placeholder')} aria-label={t('ex.placeholder')}
      className="w-full resize-none rounded-xl border-2 border-tinte/15 bg-flaeche p-3 text-xl outline-none focus:border-himmel-500" data-testid="risposta" data-answer={answer} />
  );
}

function Write(p: Sub<Extract<Exercise, { type: 'write' }>>) {
  const { ex, course, item, target, source } = p;
  const [v, setV] = useState('');
  const { t } = useT();
  const [hint, setHint] = useState(false);
  if (!item) return null;
  const accepted = [item.text, ...(item.accept ?? []), ...(ex.accept ?? [])];
  const check = () => { if (v.trim() && !p.locked) p.onChecked({ ok: isAccepted(v, accepted, target), solution: <TargetText item={item} lang={target} showTranslit /> }); };
  return (
    <>
      <div className="rounded-2xl bg-flaeche p-4 ring-1 ring-tinte/[0.07]">
        <SourceText lang={source} className="text-2xl font-bold" testId="testo-origine">{trOf(course, item.id)}</SourceText>
        {item.translit && p.showTranslit && (
          hint ? <p className="mt-2 text-sm italic text-tinte/55" lang={`${target}-Latn`}>{item.translit}</p>
            : <button type="button" className="mt-2 text-sm font-semibold text-himmel-600 underline" onClick={() => setHint(true)}>{t('ex.hint')}</button>
        )}
      </div>
      <TextAnswer target={target} locked={p.locked} value={v} onChange={setV} onEnter={check} answer={item.text} />
      <CheckButton hidden={p.locked} disabled={!v.trim()} onClick={check} />
    </>
  );
}

function Situation(p: Sub<Extract<Exercise, { type: 'situation' }>>) {
  const { ex, course, target, source } = p;
  const [v, setV] = useState('');
  const options = useMemo(() => shuffle(ex.options ?? []), [ex]);
  const [picked, setPicked] = useState<string | null>(null);
  const prompt = course.tr.exercises[ex.id]?.prompt ?? '';
  const first = ex.answers[0] ?? '';
  const solution = <TargetText item={{ text: first, translit: ex.translit }} lang={target} showTranslit />;
  const checkWrite = () => { if (v.trim() && !p.locked) p.onChecked({ ok: isAccepted(v, ex.answers, target), solution }); };
  return (
    <>
      <div className="rounded-2xl bg-sonne-50 p-4 ring-1 ring-sonne-300/60">
        <SourceText lang={source} className="text-lg font-semibold" testId="situazione">{prompt}</SourceText>
      </div>
      {ex.mode === 'write'
        ? <>
            <TextAnswer target={target} locked={p.locked} value={v} onChange={setV} onEnter={checkWrite} answer={first} />
            <CheckButton hidden={p.locked} disabled={!v.trim()} onClick={checkWrite} />
          </>
        : <>
            <Options options={options} picked={picked} onPick={setPicked} locked={p.locked} correct={ex.answers.find((a) => options.includes(a)) ?? first}
              render={(o) => <span lang={target} dir={dirOf(target)} className="text-xl">{o}</span>} />
            <CheckButton hidden={p.locked} disabled={!picked} onClick={() => p.onChecked({ ok: !!picked && ex.answers.includes(picked), solution })} />
          </>}
    </>
  );
}

/** Rückmeldung nach dem Prüfen: richtig, oder richtige Antwort + Erklärung in der Ausgangssprache */
export function Feedback({ result, explain, source, onNext, saved }: { result: CheckResult; explain: string; source: string; onNext: () => void; saved: boolean }) {
  const { t } = useT();
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => { btn.current?.focus(); }, []);
  return (
    <div className={cn('rounded-2xl p-4 ring-2', result.ok ? 'bg-minze-50 ring-minze-300' : 'bg-koralle-50 ring-koralle-300')} role="status" aria-live="assertive" data-testid="esito" data-ok={result.ok ? 'true' : 'false'}>
      <p className={cn('flex items-center gap-2 font-display text-xl font-bold', result.ok ? 'text-minze-700' : 'text-koralle-700')}>
        {result.ok ? <CheckCircle2 /> : <XCircle />} {result.ok ? t('ex.right') : t('ex.wrong')}
      </p>
      {!result.ok && (
        <div className="mt-2 space-y-2">
          <div><span className="text-sm font-semibold text-tinte/60">{t('ex.solution')}</span><div className="text-lg font-bold" data-testid="soluzione">{result.solution}</div></div>
          {explain && <SourceText lang={source} className="block text-tinte/80" testId="spiegazione">{explain}</SourceText>}
          {saved && <p className="text-sm text-tinte/55">{t('ex.saved')}</p>}
        </div>
      )}
      {result.ok && explain && <SourceText lang={source} className="mt-1 block text-sm text-tinte/70">{explain}</SourceText>}
      <button ref={btn} type="button" className={bigButton(result.ok ? 'primary' : 'outline', 'mt-4 w-full')} onClick={onNext} data-testid="continua">{t('ex.continue')}</button>
    </div>
  );
}
