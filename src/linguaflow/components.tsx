/**
 * Gemeinsame Bausteine von LinguaFlow: Texte in Lern- und Ausgangssprache, Sprachauswahl mit Suche, Kursart.
 * Keine Flaggen: Sprachen werden mit ihrem Namen (übersetzt und im Original) gezeigt.
 */
import { useMemo, useState, type ReactNode } from 'react';
import { Check, Loader2, Search, Volume2 } from 'lucide-react';
import { Lino } from '../components/Lino';
import { catalog, dirOf, endonymOf, nameOf, searchCatalog, type CatalogLang } from './catalog';
import { useT, type Key } from './i18n';
import { playItem, type VoiceState } from './voice';
import type { CourseEntry, Item, LangTag, TranslationFile } from './types';

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/** Klasse für große Knöpfe (Zeilenumbruch erlaubt) */
export const bigButton = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary', extra = '') => cn(
  'inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-center font-display text-base font-bold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-himmel-500',
  variant === 'primary' && 'border-b-4 border-minze-700 bg-minze-500 text-white hover:bg-minze-500/90 active:border-b-0',
  variant === 'secondary' && 'border-b-4 border-himmel-700 bg-himmel-500 text-white hover:bg-himmel-500/90 active:border-b-0',
  variant === 'outline' && 'border-2 border-b-4 border-tinte/15 bg-flaeche text-tinte hover:bg-tinte/[0.03] active:border-b-2',
  variant === 'ghost' && 'text-tinte/70 hover:bg-tinte/[0.05]',
  extra
);

/** Text in der Lernsprache: eigene Schreibrichtung und Sprache, Umschrift getrennt darunter */
export function TargetText({ item, lang, showTranslit, className = '', translitClass = '' }: {
  item: Pick<Item, 'text' | 'translit'>; lang: LangTag; showTranslit: boolean; className?: string; translitClass?: string;
}) {
  return (
    <span className="flex flex-col">
      <span lang={lang} dir={dirOf(lang)} className={cn('lf-target', className)} data-testid="testo-lingua">{item.text}</span>
      {showTranslit && item.translit && <span lang={`${lang}-Latn`} dir="ltr" className={cn('text-sm italic text-tinte/55', translitClass)} data-testid="trascrizione">{item.translit}</span>}
    </span>
  );
}

/** Text in der Ausgangssprache (Übersetzung, Erklärung) */
export function SourceText({ children, lang, className = '', testId }: { children: ReactNode; lang: LangTag; className?: string; testId?: string }) {
  return <span lang={lang} dir={dirOf(lang)} className={className} data-testid={testId}>{children}</span>;
}

export function PlayButton({ item, lang, voice, label, size = 'md' }: { item: Pick<Item, 'text' | 'audio'>; lang: LangTag; voice: VoiceState; label: string; size?: 'md' | 'lg' }) {
  if (!item.audio && voice !== 'yes') return null;
  return (
    <button type="button" onClick={() => playItem(item, lang, voice)} aria-label={label} title={label} data-testid="ascolta"
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-himmel-500 text-white shadow-weich transition hover:bg-himmel-600 active:scale-95',
        size === 'lg' ? 'h-20 w-20' : 'h-9 w-9')}>
      <Volume2 size={size === 'lg' ? 36 : 18} />
    </button>
  );
}

/** Hinweis zur Stimme der Lernsprache (ehrlich: keine Stimme = Lesen statt Hören) */
export function VoiceNote({ voice, lang }: { voice: VoiceState; lang: LangTag }) {
  const { t, ui } = useT();
  if (voice === 'yes') return null;
  return (
    <p className="rounded-xl bg-sonne-50 px-3 py-2 text-sm text-tinte/75 ring-1 ring-sonne-300/60" data-testid={voice === 'no' ? 'nessuna-voce' : 'voce-cerco'} role="status">
      {t(voice === 'no' ? 'lesson.noVoice' : 'lesson.voiceChecking', { lang: nameOf(lang, ui) })}
    </p>
  );
}

const KIND_STYLE: Record<CourseEntry['kind'], string> = {
  course: 'bg-minze-100 text-minze-700',
  intro: 'bg-himmel-100 text-himmel-700',
  demo: 'bg-lila-100 text-lila-700'
};
export function KindBadge({ kind }: { kind: CourseEntry['kind'] | 'none' }) {
  const { t } = useT();
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold', kind === 'none' ? 'bg-tinte/[0.07] text-tinte/55' : KIND_STYLE[kind])} data-testid="tipo-corso" data-kind={kind}>
      {t(`kind.${kind}` as Key)}
    </span>
  );
}

export function lessonCount(t: ReturnType<typeof useT>['t'], n: number) {
  return n === 1 ? t('lessons.1') : t('lessons.n', { n });
}

/** Kursart, Niveau und echte Lektionsanzahl */
export function CourseFacts({ entry }: { entry: CourseEntry }) {
  const { t } = useT();
  return (
    <span className="flex flex-wrap items-center gap-1.5 text-sm text-tinte/65">
      <KindBadge kind={entry.kind} />
      <span data-testid="numero-lezioni" data-n={entry.lessons.length}>{lessonCount(t, entry.lessons.length)}</span>
      <span aria-hidden>·</span>
      <span>{t('level', { level: entry.level })}</span>
    </span>
  );
}

export function QualityNote({ quality }: { quality: TranslationFile['quality'] }) {
  const { t } = useT();
  return <p className={cn('text-xs', quality === 'machine' ? 'font-semibold text-koralle-700' : 'text-tinte/55')} data-testid="qualita" data-quality={quality}>{t(`quality.${quality}` as Key)}</p>;
}

export function LangName({ tag, ui, className = '' }: { tag: LangTag; ui: LangTag; className?: string }) {
  const name = nameOf(tag, ui);
  const endo = endonymOf(tag);
  return (
    <span className={cn('inline-flex flex-col leading-tight', className)}>
      <span className="font-bold">{name}</span>
      {endo.toLocaleLowerCase() !== name.toLocaleLowerCase() && <span lang={tag} dir={dirOf(tag)} className="text-sm text-tinte/55">{endo}</span>}
    </span>
  );
}

/**
 * Sprachauswahl mit Suche (übersetzter Name, Originalname, englischer Name, Kennung).
 * badge(tag) zeigt optional den Kursstand einer Sprache.
 */
export function LangPicker({ value, onPick, exclude, extraTags, badge, top, testId }: {
  value: LangTag | null;
  onPick: (tag: LangTag) => void;
  exclude?: LangTag | null;
  extraTags: LangTag[];
  badge?: (tag: LangTag) => ReactNode;
  /** Sprachen, die oben in einer eigenen Gruppe stehen */
  top?: { title: string; tags: LangTag[] };
  testId: string;
}) {
  const { t, ui } = useT();
  const [q, setQ] = useState('');
  const all = useMemo(() => catalog(ui, extraTags), [ui, extraTags]);
  const list = useMemo(() => searchCatalog(all.filter((l) => l.tag !== exclude), q), [all, q, exclude]);
  const topList = !q && top ? top.tags.map((tg) => all.find((l) => l.tag === tg)).filter((l): l is CatalogLang => !!l && l.tag !== exclude) : [];
  const row = (l: CatalogLang, group: string) => (
    <li key={`${group}-${l.tag}`}>
      <button type="button" onClick={() => onPick(l.tag)} data-testid={`lingua-${l.tag}`} data-tag={l.tag} aria-pressed={value === l.tag}
        className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-tinte/[0.04]', value === l.tag && 'bg-minze-50 ring-2 ring-minze-300')}>
        <span className="min-w-0 flex-1"><LangName tag={l.tag} ui={ui} /></span>
        <span className="shrink-0">{badge?.(l.tag)}</span>
        {value === l.tag && <Check size={20} className="shrink-0 text-minze-600" aria-label={t('pick.chosen')} />}
      </button>
    </li>
  );
  return (
    <div data-testid={testId}>
      <label className="relative block">
        <Search size={18} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-tinte/40" aria-hidden />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('pick.search')} aria-label={t('pick.search')}
          className="w-full rounded-xl border-2 border-tinte/10 bg-flaeche py-3 pe-3 ps-10 text-base outline-none focus:border-himmel-500" data-testid="cerca-lingua" />
      </label>
      <div className="mt-3 max-h-[52vh] overflow-y-auto rounded-xl ring-1 ring-tinte/[0.07]">
        {topList.length > 0 && (
          <>
            <p className="sticky top-0 z-10 bg-flaeche/95 px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-tinte/50">{top!.title}</p>
            <ul className="px-1">{topList.map((l) => row(l, 'top'))}</ul>
            <p className="sticky top-0 z-10 bg-flaeche/95 px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-tinte/50">{t('pick.all')}</p>
          </>
        )}
        {list.length ? <ul className="px-1 pb-1">{list.map((l) => row(l, 'all'))}</ul> : <p className="p-4 text-tinte/60">{t('pick.none')}</p>}
      </div>
    </div>
  );
}

export function Loading() {
  const { t } = useT();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3" role="status">
      <Loader2 className="animate-spin text-minze-600" size={32} />
      <p className="text-tinte/60">{t('loading')}</p>
    </div>
  );
}

export function LoadError({ message }: { message?: string }) {
  const { t } = useT();
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 p-6 text-center" role="alert" data-testid="errore-caricamento">
      <Lino mood="denken" size={100} />
      <p>{message ?? t('error.load')}</p>
      <button type="button" className={bigButton('outline')} onClick={() => window.location.reload()}>{t('retry')}</button>
    </div>
  );
}
