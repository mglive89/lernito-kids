import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Captions, CaptionsOff, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useApp, useActiveProfile, type CustomVideo } from '../store/useApp';
import { Notice, ProgressBar, TopBar } from '../components/ui';
import { Lino, LinoSays } from '../components/Lino';
import { activeCue, LESSONS, parseVtt, type Cue, type Lesson } from '../video/lessons';
import { getMediaBlob } from '../lib/db';
import { speak, stopSpeaking } from '../lib/speech';
import { L, tr } from '../i18n';
import { subjectName } from '../school/subjects';
import { getCountry } from '../school/systems';

const subjectTitle = (id: string) => (id === 'kita' ? L('Kindergarten', 'Scuola dell’infanzia') : subjectName(id === 'sachunterricht' ? 'sachkunde' : id, getCountry()));

export function VideosPage() {
  const { progress } = useActiveProfile();
  const custom = useApp((s) => s.customVideos).filter((v) => v.published);
  const items: { id: string; title: string; description: string; subject: string; topic: string; emoji: string }[] = [
    ...LESSONS.map((l) => ({ id: l.id, title: tr(l.title), description: tr(l.description), subject: l.subject, topic: tr(l.topic), emoji: l.emoji })),
    ...custom.map((v) => ({ id: v.id, title: v.title, description: v.description, subject: v.subject, topic: v.topic, emoji: '🎞️' }))
  ];
  const bySubject = items.reduce<Record<string, typeof items>>((acc, it) => { (acc[it.subject] ??= []).push(it); return acc; }, {});
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Lernvideos', 'Video lezioni')} back="/home" stars={progress.stars} />
      <main className="seite flex flex-col gap-6">
        <LinoSays text={L('Schau ein kurzes Video und mach danach das Quiz!', 'Guarda un breve video e poi fai il quiz!')} size={80} />
        {Object.entries(bySubject).map(([subject, list]) => (
          <section key={subject} aria-labelledby={`v-${subject}`}>
            <h2 id={`v-${subject}`} className="mb-3 font-display text-2xl font-bold">{subjectTitle(subject)}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((v) => {
                const p = progress.videos[v.id];
                return (
                  <Link key={v.id} to={`/videos/${v.id}`} className="karte flex flex-col gap-2 p-5" data-testid={`video-${v.id}`}>
                    <div className="flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-himmel-300 to-lila-300 text-6xl"><span className="emoji">{v.emoji}</span><Play className="ml-2 fill-white text-white" size={40} /></div>
                    <span className="font-display text-xl font-bold">{v.title}</span>
                    <span className="text-tinte/70">{v.topic} · {v.description}</span>
                    <ProgressBar value={p?.progress ?? 0} label={L('Angesehen', 'Visto')} />
                    {p?.completed && <span className="text-sm font-bold text-minze-700">✅ {L('Angesehen', 'Visto')}</span>}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export function VideoPlayerPage() {
  const { lessonId } = useParams();
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const custom = useApp((s) => s.customVideos.find((v) => v.id === lessonId));
  if (lesson) return <AnimatedLessonPlayer lesson={lesson} />;
  if (custom) return <FileVideoPlayer video={custom} />;
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Video', 'Video')} back="/videos" />
      <main className="seite"><LinoSays text={L('Dieses Video gibt es nicht.', 'Questo video non esiste.')} mood="denken" /></main>
    </div>
  );
}

function PlayerControls({ playing, onToggle, onRestart, t, duration, onSeek, cc, setCc, readAloud, setReadAloud }: {
  playing: boolean; onToggle: () => void; onRestart: () => void; t: number; duration: number; onSeek: (v: number) => void;
  cc: boolean; setCc: (v: boolean) => void; readAloud?: boolean; setReadAloud?: (v: boolean) => void;
}) {
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  return (
    <div className="flex w-full flex-col gap-3">
      <input type="range" min={0} max={duration} step={0.1} value={t} onChange={(e) => onSeek(Number(e.target.value))} className="w-full accent-himmel-500" aria-label={L('Position im Video', 'Posizione nel video')} />
      <div className="flex flex-wrap items-center gap-2">
        <button className="knopf h-14 w-14 bg-sonne-500 px-0" onClick={onToggle} aria-label={playing ? L('Pause', 'Pausa') : L('Abspielen', 'Riproduci')} data-testid="play-toggle">{playing ? <Pause /> : <Play />}</button>
        <button className="knopf h-14 w-14 bg-white px-0" onClick={onRestart} aria-label={L('Von vorn', 'Dall’inizio')}><RotateCcw /></button>
        <span className="font-mono text-lg" aria-live="off">{fmt(t)} / {fmt(duration)}</span>
        <div className="flex-1" />
        <button className={`knopf h-14 px-3 text-base ${cc ? 'bg-himmel-300' : 'bg-white'}`} onClick={() => setCc(!cc)} aria-pressed={cc} aria-label={L('Untertitel', 'Sottotitoli')}>{cc ? <Captions /> : <CaptionsOff />} {L('Untertitel', 'Sottotitoli')}</button>
        {setReadAloud && <button className={`knopf h-14 px-3 text-base ${readAloud ? 'bg-himmel-300' : 'bg-white'}`} onClick={() => setReadAloud(!readAloud)} aria-pressed={readAloud} aria-label={L('Vorlesen', 'Leggi')}>{readAloud ? <Volume2 /> : <VolumeX />} {L('Vorlesen', 'Leggi')}</button>}
      </div>
    </div>
  );
}

function AnimatedLessonPlayer({ lesson }: { lesson: Lesson }) {
  const { settings } = useActiveProfile();
  const markVideo = useApp((s) => s.markVideo);
  const nav = useNavigate();
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cc, setCc] = useState(true);
  const [readAloud, setReadAloud] = useState(settings.speech);
  const [completed, setCompleted] = useState(false);
  const lastCue = useRef<Cue | undefined>(undefined);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((prev) => {
        const nt = Math.min(lesson.duration, prev + dt);
        if (nt >= lesson.duration) setPlaying(false);
        return nt;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, lesson.duration]);

  const cue = activeCue(lesson.cues, t);
  useEffect(() => {
    if (playing && readAloud && cue && cue !== lastCue.current) speak(tr(cue.text), { force: true });
    lastCue.current = cue;
  }, [cue, playing, readAloud]);
  useEffect(() => () => stopSpeaking(), []);

  const progress = t / lesson.duration;
  useEffect(() => {
    const isDone = t >= lesson.duration - 0.05;
    if (Math.floor(t) % 5 === 0 || isDone) markVideo(lesson.id, progress, isDone);
    if (isDone) setCompleted(true);
  }, [Math.floor(t)]); // eslint-disable-line react-hooks/exhaustive-deps

  const seek = useCallback((v: number) => { stopSpeaking(); lastCue.current = undefined; setT(v); }, []);

  return (
    <div className="min-h-[100dvh]">
      <TopBar title={tr(lesson.title)} back="/videos" />
      <main className="seite flex flex-col items-center gap-4">
        <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-3xl bg-himmel-100 shadow-karte" data-testid="lesson-stage">
          <PlusLessonScene t={t} />
          {cc && cue && (
            <p className="absolute inset-x-4 bottom-3 rounded-xl bg-tinte/85 px-4 py-2 text-center text-lg font-bold text-white sm:text-2xl" data-testid="untertitel">{tr(cue.text)}</p>
          )}
          {!playing && t === 0 && (
            <button className="absolute inset-0 flex items-center justify-center bg-tinte/20" onClick={() => setPlaying(true)} aria-label={L('Video starten', 'Avvia il video')}>
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-sonne-500 shadow-knopf"><Play size={48} className="fill-tinte" /></span>
            </button>
          )}
        </div>
        <div className="w-full max-w-3xl">
          <PlayerControls playing={playing} onToggle={() => { if (t >= lesson.duration) setT(0); setPlaying((p) => !p); if (playing) stopSpeaking(); }} onRestart={() => { seek(0); setPlaying(true); }} t={t} duration={lesson.duration} onSeek={seek} cc={cc} setCc={setCc} readAloud={readAloud} setReadAloud={setReadAloud} />
        </div>
        <ProgressBar value={progress} label={L('Fortschritt im Video', 'Avanzamento del video')} />
        {completed && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="karte flex w-full max-w-3xl flex-col items-center gap-3 p-6 text-center">
            <Lino mood="jubel" size={90} />
            <p className="font-display text-2xl font-bold">{L('Video geschafft! Jetzt bist du dran.', 'Video finito! Ora tocca a te.')}</p>
            <button className="knopf bg-minze-500 text-white" onClick={() => nav(`/spiel/quiz-${lesson.id}`)} data-testid="zum-quiz">{L('Zum Quiz', 'Al quiz')}</button>
          </motion.div>
        )}
        <p className="text-center text-sm text-tinte/60">{L('Selbst erstellte animierte Erklärung von Lernito Kids. Die Untertitel sind immer verfügbar – auch ohne Ton.', 'Spiegazione animata realizzata da Lernito Kids. I sottotitoli sono sempre disponibili, anche senza audio.')}</p>
      </main>
    </div>
  );
}

/** Animierte Szene der Beispiel-Lektion „Was bedeutet Plus?“ (zeitgesteuert, SVG). */
function PlusLessonScene({ t }: { t: number }) {
  const apple = (x: number, y: number, key: string, highlight = false) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      <circle r={highlight ? 26 : 22} fill="#E63946" stroke={highlight ? '#FFB627' : 'none'} strokeWidth="6" />
      <rect x="-2" y="-30" width="4" height="12" fill="#6B3E1E" />
      <ellipse cx="9" cy="-26" rx="9" ry="5" fill="#38B000" />
    </g>
  );
  const flyIn = Math.max(0, Math.min(1, (t - 11) / 3));
  const counting = t >= 17 && t < 26 ? Math.min(5, Math.floor((t - 17) / 1.6) + 1) : t >= 26 ? 5 : 0;
  const positions = [[200, 230], [255, 230], [310, 230], [365, 230], [420, 230]] as const;
  const eqStep = t >= 26 ? Math.min(5, Math.floor((t - 26) / 1.2) + 1) : 0;
  const eq = ['3', '+', '2', '=', '5'];
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-label={L('Animierte Erklärung: drei Äpfel plus zwei Äpfel sind fünf Äpfel', 'Spiegazione animata: tre mele più due mele fanno cinque mele')}>
      <rect width="640" height="360" fill="#DDF1FF" />
      <rect y="280" width="640" height="80" fill="#8EE3BF" />
      <circle cx="580" cy="60" r="34" fill="#FFD166" />
      {/* Puppy */}
      <g transform={`translate(${t < 5 ? -20 + t * 8 : 20} ${t < 5 ? 95 + Math.sin(t * 4) * 6 : 95})`}>
        <Lino mood={t < 5 ? 'winken' : t >= 26 ? 'jubel' : 'freude'} size={130} still flat />
      </g>
      {/* Korb */}
      {t >= 5 && <path d="M170 250 h290 l-25 50 h-240z" fill="#C98B4B" stroke="#8B5A2B" strokeWidth="4" />}
      {t >= 5 && positions.slice(0, 3).map(([x, y], i) => apple(x, y - (t < 7 ? (7 - t) * 40 : 0), `a${i}`, counting > i))}
      {t >= 11 && positions.slice(3).map(([x, y], i) => apple(x + (1 - flyIn) * 220, y - (1 - flyIn) * 160, `b${i}`, counting > 3 + i))}
      {counting > 0 && t < 26 && (
        <text x="320" y="120" textAnchor="middle" fontSize="80" fontWeight="800" fill="#FF6F59" fontFamily="Fredoka, sans-serif">{counting}</text>
      )}
      {eqStep > 0 && (
        <g fontFamily="Fredoka, sans-serif" fontWeight="800" fontSize="72" textAnchor="middle">
          {eq.slice(0, eqStep).map((c, i) => <text key={i} x={220 + i * 60} y="130" fill={i === 4 ? '#2EC4B6' : '#2B2D42'}>{c}</text>)}
        </g>
      )}
      {t >= 34 && <text x="320" y="200" textAnchor="middle" fontSize="34" fontWeight="700" fill="#5233B0" fontFamily="Fredoka, sans-serif">{L('Plus = zusammenzählen', 'Più = mettere insieme')}</text>}
    </svg>
  );
}

function FileVideoPlayer({ video }: { video: CustomVideo }) {
  const markVideo = useApp((s) => s.markVideo);
  const nav = useNavigate();
  const [src, setSrc] = useState<string | null>(null);
  const [track, setTrack] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cues, setCues] = useState<Cue[]>([]);
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    const urls: string[] = [];
    void (async () => {
      const b = await getMediaBlob(video.mediaId);
      if (!b) { setError(L('Die Videodatei wurde auf diesem Gerät nicht gefunden.', 'Il file video non è stato trovato su questo dispositivo.')); return; }
      const u = URL.createObjectURL(b); urls.push(u); setSrc(u);
      if (video.subtitleMediaId) {
        const s = await getMediaBlob(video.subtitleMediaId);
        if (s) { const text = await s.text(); setCues(parseVtt(text)); const tu = URL.createObjectURL(new Blob([text], { type: 'text/vtt' })); urls.push(tu); setTrack(tu); }
      }
    })();
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [video.mediaId, video.subtitleMediaId]);
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={video.title} back="/videos" />
      <main className="seite flex flex-col items-center gap-4">
        {error && <Notice tone="warn">{error}</Notice>}
        {!src && !error && <div className="aspect-video w-full max-w-3xl animate-pulse rounded-3xl bg-white" role="status" aria-label={L('Video wird geladen', 'Caricamento del video')} />}
        {src && (
          <video
            className="aspect-video w-full max-w-3xl rounded-3xl bg-black shadow-karte"
            src={src}
            controls
            playsInline
            onTimeUpdate={(e) => { const v = e.currentTarget; if (v.duration) markVideo(video.id, v.currentTime / v.duration, false); }}
            onEnded={() => { markVideo(video.id, 1, true); setCompleted(true); }}
          >
            {track && <track kind="subtitles" srcLang="de" label="Deutsch" src={track} default />}
          </video>
        )}
        {cues.length === 0 && src && <p className="text-sm text-tinte/60">{L('Für dieses Video sind keine Untertitel hinterlegt.', 'Per questo video non ci sono sottotitoli.')}</p>}
        {completed && video.quizModuleId && <button className="knopf bg-minze-500 text-white" onClick={() => nav(`/spiel/${video.quizModuleId}`)}>{L('Zum Quiz', 'Al quiz')}</button>}
        {completed && !video.quizModuleId && <LinoSays text={L('Super zugeschaut!', 'Bravo, hai guardato tutto!')} mood="jubel" />}
      </main>
    </div>
  );
}
