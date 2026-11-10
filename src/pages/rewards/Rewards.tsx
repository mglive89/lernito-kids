import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Star } from 'lucide-react';
import { useApp, useActiveProfile } from '../../store/useApp';
import { Avatar, ProgressBar, TopBar } from '../../components/ui';
import { Lino, LinoSays } from '../../components/Lino';
import { AVATAR_EXTRAS, AVATAR_FARBEN, AVATAR_TIERE, BADGES, levelFromXp, MINIGAMES } from '../../learning/rewards';
import { kitaModules, schoolModules, world3dModules } from '../../learning/registry';
import { lastNDays, wochentagKurz } from '../../lib/date';
import type { LearningModule } from '../../learning/types';
import { L, locale, tr } from '../../i18n';
import { stageFor, yearLabel } from '../../school/systems';
import { subjectName } from '../../school/subjects';
import { sfx } from '../../lib/sound';

export function StarsPage() {
  const { progress } = useActiveProfile();
  const days = lastNDays(7);
  const max = Math.max(5, ...days.map((d) => progress.daily[d]?.stars ?? 0));
  const next = MINIGAMES.find((m) => m.starsNeeded > progress.stars);
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Meine Sterne', 'Le mie stelle')} back="/home" />
      <main className="seite flex flex-col items-center gap-6">
        <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="flex flex-col items-center">
          <Star size={120} className="fill-sonne-500 text-sonne-500" />
          <p className="font-display text-6xl font-bold" data-testid="sterne-gesamt">{progress.stars}</p>
          <p className="text-xl">{L('Sterne gesammelt', 'stelle raccolte')}</p>
        </motion.div>
        {next && (
          <div className="karte w-full max-w-xl p-5">
            <p className="mb-2 font-bold">{L(`Noch ${next.starsNeeded - progress.stars} Sterne bis zum Mini-Spiel „${tr(next.title)}“`, `Ancora ${next.starsNeeded - progress.stars} stelle per il minigioco «${tr(next.title)}»`)} {next.emoji}</p>
            <ProgressBar value={progress.stars / next.starsNeeded} color="bg-sonne-500" />
          </div>
        )}
        <section className="karte w-full max-w-xl p-5" aria-labelledby="woche">
          <h2 id="woche" className="mb-4 font-display text-xl font-bold">{L('Diese Woche', 'Questa settimana')}</h2>
          <div className="flex h-40 items-end justify-between gap-2">
            {days.map((d) => {
              const v = progress.daily[d]?.stars ?? 0;
              const wd = wochentagKurz(new Date(`${d}T12:00:00`).getDay());
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1" aria-label={L(`${wd}: ${v} Sterne`, `${wd}: ${v} stelle`)}>
                  <span className="text-sm font-bold">{v || ''}</span>
                  <motion.div className="w-full rounded-t-xl bg-sonne-500" initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}px` }} />
                  <span className="text-sm">{wd}</span>
                </div>
              );
            })}
          </div>
        </section>
        <p className="max-w-xl text-center text-tinte/70">{L('Für jede gelöste Aufgabe bekommst du einen Stern. Sterne kann man nicht verlieren – sie gehören dir!', 'Per ogni esercizio risolto ricevi una stella. Le stelle non si perdono: sono tue!')}</p>
      </main>
    </div>
  );
}

export function BadgesPage() {
  const { progress } = useActiveProfile();
  const owned = progress.badges;
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Meine Erfolge', 'I miei traguardi')} back="/home" stars={progress.stars} />
      <main className="seite">
        <LinoSays text={L(`Du hast schon ${Object.keys(owned).length} von ${BADGES.length} Abzeichen!`, `Hai già ${Object.keys(owned).length} distintivi su ${BADGES.length}!`)} size={80} mood="jubel" />
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5">
          {BADGES.map((b) => {
            const has = !!owned[b.id];
            return (
              <div key={b.id} className={`flex flex-col items-center gap-1.5 p-3 text-center sm:p-4 ${has ? 'karte-3d bg-gradient-to-b from-sonne-50 to-white ring-sonne-300' : 'rounded-blob bg-white/60 border-2 border-dashed border-tinte/15'}`} data-testid={`badge-${b.id}`} data-owned={has}>
                <span className={`emoji flex h-16 w-16 items-center justify-center rounded-full text-4xl sm:h-20 sm:w-20 sm:text-5xl ${has ? 'bg-sonne-100 ring-4 ring-sonne-300' : 'bg-tinte/[0.05] opacity-40 grayscale'}`} aria-hidden>{b.emoji}</span>
                <span className={`font-display text-sm font-bold leading-tight sm:text-base ${has ? '' : 'text-tinte/60'}`}>{tr(b.title)}</span>
                <span className="text-xs leading-snug text-tinte/55 sm:text-sm">{tr(b.description)}</span>
                {has && <span className="text-xs text-tinte/50">{L('am', 'il')} {new Date(owned[b.id]!).toLocaleDateString(locale())}</span>}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function PathSection({ title, emoji, modules }: { title: string; emoji: string; modules: LearningModule[] }) {
  const { progress } = useActiveProfile();
  const done = modules.filter((m) => (progress.modules[m.id]?.rounds ?? 0) > 0).length;
  return (
    <section className="karte p-5">
      <div className="mb-3 flex items-center gap-3">
        <span className="emoji text-4xl">{emoji}</span>
        <h2 className="flex-1 font-display text-2xl font-bold">{title}</h2>
        <span className="font-bold">{done}/{modules.length}</span>
      </div>
      <ProgressBar value={modules.length ? done / modules.length : 0} />
      <ol className="mt-4 flex flex-wrap items-center gap-2">
        {modules.map((m, i) => {
          const p = progress.modules[m.id];
          return (
            <li key={m.id} className="flex items-center gap-2">
              <Link to={`/spiel/${m.id}`} className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-knopf ${p?.rounds ? 'bg-minze-300' : 'bg-white'}`} title={tr(m.title)} aria-label={`${tr(m.title)}${p?.rounds ? L(', schon gespielt', ', già giocato') : ''}`}>
                <span className="emoji">{m.emoji}</span>
              </Link>
              {i < modules.length - 1 && <span className="h-1 w-4 rounded bg-tinte/15" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function AdventurePage() {
  const { profile, progress } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const country = profile?.country ?? 'DE';
  const year = profile && profile.year > 0 ? profile.year : 1;
  const stage = stageFor(country, year);
  const label = yearLabel(country, year).replace(/ · .*/, '');
  const icons: Record<string, string> = { mathe: '⛰️', deutsch: '🌲', italiano: '🌲', englisch: '🏰', sachkunde: '🔬', scienze: '🔬', biologie: '🧬', physik: '⚡', chemie: '⚗️', geschichte: '🏛️', geographie: '🗺️' };
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Mein Lernabenteuer', 'La mia avventura')} back="/entdecken" stars={progress.stars} />
      <main className="seite flex flex-col gap-4">
        <LinoSays text={L('Jeder Kreis ist eine Station auf deiner Reise. Grüne Kreise hast du schon besucht!', 'Ogni cerchio è una tappa del tuo viaggio. Quelli verdi li hai già visitati!')} size={80} />
        {profile?.year === 0 && <PathSection title={L('Kindergarten-Insel', 'Isola dell’infanzia')} emoji="🏝️" modules={kitaModules(custom)} />}
        {stage.subjects.map((id) => {
          const mods = schoolModules(country, year, id, custom);
          return mods.length ? <PathSection key={id} title={`${subjectName(id, country)} · ${label}`} emoji={icons[id] ?? '📘'} modules={mods} /> : null;
        })}
        <PathSection title={L('Programmieren und Informatik', 'Programmazione e informatica')} emoji="🤖" modules={[...schoolModules(country, year, 'programmieren', custom), ...schoolModules(country, year, 'informatik', custom)]} />
        <PathSection title={L('3D-Welt', 'Mondo 3D')} emoji="🧊" modules={world3dModules()} />
      </main>
    </div>
  );
}

export function AvatarPage() {
  const { profile, progress } = useActiveProfile();
  const update = useApp((s) => s.updateProfile);
  const [saved, setSaved] = useState(false);
  if (!profile) return null;
  const lvl = levelFromXp(progress.xp).level;
  const set = (patch: Partial<typeof profile.avatar>) => {
    sfx.tap();
    update(profile.id, { avatar: { ...profile.avatar, ...patch }, avatarCustomized: true });
    setSaved(true);
    useApp.getState().checkBadges();
  };
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Mein Avatar', 'Il mio avatar')} back="/profil" stars={progress.stars} />
      <main className="seite flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <motion.div key={JSON.stringify(profile.avatar)} initial={{ scale: 0.8, rotate: -8 }} animate={{ scale: 1, rotate: 0 }}><Avatar config={profile.avatar} size={150} /></motion.div>
          <p className="font-display text-2xl font-bold">{profile.name}</p>
          {saved && <p className="text-minze-700" role="status">{L('Gespeichert!', 'Salvato!')}</p>}
        </div>
        <fieldset>
          <legend className="mb-3 font-display text-2xl font-bold">{L('Tier', 'Animale')}</legend>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {AVATAR_TIERE.map((t) => (
              <button key={t} type="button" onClick={() => set({ animal: t })} aria-pressed={profile.avatar.animal === t} className={`knopf aspect-square text-5xl ${profile.avatar.animal === t ? 'bg-sonne-300 ring-4 ring-tinte' : 'bg-white'}`}><span className="emoji">{t}</span></button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-3 font-display text-2xl font-bold">{L('Farbe', 'Colore')}</legend>
          <div className="flex flex-wrap gap-3">
            {AVATAR_FARBEN.map((c) => <button key={c} type="button" aria-label={L(`Farbe ${c}`, `Colore ${c}`)} aria-pressed={profile.avatar.color === c} onClick={() => set({ color: c })} className={`h-16 w-16 rounded-full shadow-knopf ${profile.avatar.color === c ? 'ring-4 ring-tinte ring-offset-2' : ''}`} style={{ background: c }} />)}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-1 font-display text-2xl font-bold">Extras</legend>
          <p className="mb-3 text-tinte/70">{L(`Neue Extras bekommst du, wenn du ein neues Level erreichst. Du bist auf Level ${lvl}.`, `Ricevi nuovi accessori quando sali di livello. Sei al livello ${lvl}.`)}</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {AVATAR_EXTRAS.map((e) => {
              const locked = e.level > lvl;
              return (
                <button key={e.id} type="button" disabled={locked} onClick={() => set({ extra: e.id })} aria-pressed={profile.avatar.extra === e.id} className={`knopf flex-col py-3 text-base ${profile.avatar.extra === e.id ? 'bg-lila-300 ring-4 ring-tinte' : 'bg-white'}`}>
                  <span className="emoji text-4xl">{locked ? <Lock /> : e.emoji || '🚫'}</span>
                  <span>{locked ? L(`ab Level ${e.level}`, `dal livello ${e.level}`) : tr(e.name)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="flex justify-center"><Lino mood="winken" size={100} /></div>
      </main>
    </div>
  );
}

