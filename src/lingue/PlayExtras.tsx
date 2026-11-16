import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Heart, Medal, RotateCcw, Star, Target, Trophy } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui';
import { sfx } from '../lib/sound';
import { L, tr } from '../i18n';
import { HEART_REGEN_MS, MAX_HEARTS, QUESTS, REFILL_STARS, settle, useLangPlay, useLangPlayOf } from './play-state';

/** Lässt die Anzeige alle 30 s neu rechnen (Herzen wachsen mit der Zeit nach). */
function useTick(ms = 30_000) {
  const [, setT] = useState(0);
  useEffect(() => { const t = setInterval(() => setT((x) => x + 1), ms); return () => clearInterval(t); }, [ms]);
}

const minutesLeft = (nextAt: number | null) => (nextAt ? Math.max(1, Math.ceil((nextAt - Date.now()) / 60_000)) : 0);

/** Kleine Herz-Anzeige für Kopfzeilen. */
export function HeartsPill({ pid }: { pid: string | undefined }) {
  useTick();
  const p = useLangPlayOf(pid);
  return (
    <span className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-bold ${p.hearts ? 'bg-koralle-50 text-koralle-600' : 'bg-tinte/[0.06] text-tinte/50'}`}
      data-testid="herzen" data-hearts={p.hearts} aria-label={L(`${p.hearts} von ${MAX_HEARTS} Herzen`, `${p.hearts} cuori su ${MAX_HEARTS}`)}>
      <Heart size={18} className={p.hearts ? 'fill-current' : ''} /> {p.hearts}
    </span>
  );
}

/** Herzen mit Erklärung, Wartezeit und Auffüllen gegen Sterne. */
export function HeartsPanel({ compact = false }: { compact?: boolean }) {
  useTick();
  const { profile, progress } = useActiveProfile();
  const pid = profile?.id;
  const p = useLangPlayOf(pid);
  const refill = useLangPlay((s) => s.refillWithStars);
  const full = p.hearts >= MAX_HEARTS;
  const canBuy = !full && progress.stars >= REFILL_STARS;
  return (
    <div className="karte-3d flex flex-col gap-3 p-4" data-testid="herzen-panel">
      <div className="flex items-center gap-3">
        <div className="flex gap-1" aria-label={L(`${p.hearts} von ${MAX_HEARTS} Herzen`, `${p.hearts} cuori su ${MAX_HEARTS}`)} data-testid="herzen-reihe" data-hearts={p.hearts}>
          {Array.from({ length: MAX_HEARTS }, (_, i) => (
            <Heart key={i} size={26} className={i < p.hearts ? 'fill-koralle-500 text-koralle-500' : 'text-tinte/20'} aria-hidden />
          ))}
        </div>
        <p className="flex-1 text-sm text-tinte/65">
          {full ? L('Alle Herzen voll!', 'Cuori al completo!')
            : L(`Nächstes Herz in ${minutesLeft(p.nextAt)} Min.`, `Prossimo cuore tra ${minutesLeft(p.nextAt)} min`)}
        </p>
      </div>
      {!compact && (
        <p className="text-sm text-tinte/60">
          {L(`Ein Fehler kostet ein Herz. Herzen kommen zurück: alle ${HEART_REGEN_MS / 60_000} Minuten, beim Wiederholen einer geschafften Lektion oder mit einer Tagesmission.`,
            `Ogni errore costa un cuore. I cuori tornano: ogni ${HEART_REGEN_MS / 60_000} minuti, ripassando una lezione già fatta o con una missione del giorno.`)}
        </p>
      )}
      {!full && (
        <button type="button" className="knopf flex items-center justify-center gap-2 bg-flaeche px-4 text-sm disabled:opacity-40" disabled={!canBuy} data-testid="herzen-auffuellen"
          onClick={() => { if (pid && refill(pid)) sfx.unlock(); }}>
          <Star size={18} className="fill-sonne-500 text-sonne-500" />
          {L(`Herzen auffüllen für ${REFILL_STARS} Sterne`, `Riempi i cuori con ${REFILL_STARS} stelle`)}
        </button>
      )}
    </div>
  );
}

/** Hinweis, wenn keine Herzen mehr da sind. */
export function OutOfHeartsModal({ open, onClose, courseLink }: { open: boolean; onClose: () => void; courseLink: string }) {
  return (
    <Modal open={open} onClose={onClose} title={L('Keine Herzen mehr', 'Cuori finiti')}>
      <div className="flex flex-col gap-4" data-testid="keine-herzen">
        <p className="text-tinte/70">
          {L('Mach eine kleine Pause oder wiederhole eine Lektion, die du schon geschafft hast – dabei bekommst du Herzen zurück.',
            'Fai una piccola pausa oppure ripassa una lezione che hai già completato: così riguadagni i cuori.')}
        </p>
        <HeartsPanel compact />
        <Link to={courseLink} onClick={onClose} className="knopf flex items-center justify-center gap-2 bg-himmel-600 px-4 text-white" data-testid="zum-ripasso">
          <RotateCcw size={18} /> {L('Lektion wiederholen', 'Ripassa una lezione')}
        </Link>
      </div>
    </Modal>
  );
}

/** Tagesmissionen der Sprachkurse. */
export function QuestsCard() {
  useTick();
  const { profile } = useActiveProfile();
  const pid = profile?.id;
  const p = useLangPlayOf(pid);
  const claim = useLangPlay((s) => s.claim);
  return (
    <section className="karte-3d p-4 sm:p-5" data-testid="missioni" aria-labelledby="missioni-titel">
      <h2 id="missioni-titel" className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><Target size={22} className="text-himmel-600" /> {L('Tagesmissionen', 'Missioni del giorno')}</h2>
      <ul className="flex flex-col gap-3">
        {QUESTS.map((q) => {
          const v = Math.min(q.goal, q.value(p));
          const done = v >= q.goal;
          const claimed = p.claimed.includes(q.id);
          return (
            <li key={q.id} className="flex items-center gap-3" data-testid={`mission-${q.id}`} data-done={done} data-claimed={claimed}>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${claimed ? 'bg-minze-50 text-minze-700' : done ? 'bg-sonne-100 text-sonne-700' : 'bg-tinte/[0.05] text-tinte/40'}`}>
                {claimed ? <Medal size={22} /> : <Gift size={22} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <p className="font-semibold leading-tight">{tr(q.title())}</p>
                  <p className="text-sm font-semibold text-tinte/55">{v}/{q.goal}</p>
                </div>
                <ProgressBar value={v / q.goal} color={done ? 'bg-sonne-500' : 'bg-himmel-500'} />
              </div>
              {done && !claimed && (
                <button type="button" className="knopf shrink-0 bg-sonne-500 px-3 text-sm" data-testid={`mission-${q.id}-premio`}
                  onClick={() => { if (pid && claim(pid, q.id)) sfx.unlock(); }}>
                  +1 <Heart size={14} className="inline fill-current" aria-label={L('Herz', 'cuore')} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Rangliste der Profile auf diesem Gerät nach Sprach-XP. */
export function FamilyLeaderboard() {
  const profiles = useApp((s) => s.profiles);
  const activeId = useApp((s) => s.activeProfileId);
  const byProfile = useLangPlay((s) => s.byProfile);
  const rows = profiles
    .map((p) => ({ p, xp: settle(byProfile[p.id]).xp }))
    .sort((a, b) => b.xp - a.xp || a.p.name.localeCompare(b.p.name));
  const medal = ['text-sonne-500', 'text-tinte/40', 'text-koralle-400'];
  return (
    <section className="karte-3d p-4 sm:p-5" data-testid="classifica" aria-labelledby="classifica-titel">
      <h2 id="classifica-titel" className="mb-1 flex items-center gap-2 font-display text-lg font-bold"><Trophy size={22} className="text-sonne-600" /> {L('Rangliste', 'Classifica')}</h2>
      <p className="mb-3 text-sm text-tinte/55">{L('Sprach-XP der Profile auf diesem Gerät', 'XP nelle lingue dei profili su questo dispositivo')}</p>
      <ol className="flex flex-col gap-2">
        {rows.map(({ p, xp }, i) => (
          <li key={p.id} className={`flex items-center gap-3 rounded-2xl px-3 py-2 ${p.id === activeId ? 'bg-himmel-50 ring-1 ring-himmel-100' : ''}`} data-testid="classifica-riga">
            <span className={`w-6 text-center font-display font-bold ${medal[i] ?? 'text-tinte/45'}`}>{i < 3 ? <Medal size={20} className="inline" aria-label={`${i + 1}.`} /> : `${i + 1}.`}</span>
            <Avatar config={p.avatar} size={36} />
            <span className="flex-1 truncate font-semibold">{p.name}</span>
            <span className="text-sm font-bold text-tinte/60">{xp} XP</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
