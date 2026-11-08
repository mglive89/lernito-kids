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

const SUBJECT_NAMES: Record<string, string> = { mathe: 'Mathematik', deutsch: 'Deutsch', sachunterricht: 'Sachunterricht', englisch: 'Englisch', kita: 'Kindergarten' };

export function VideosPage() {
  const { progress } = useActiveProfile();
  const custom = useApp((s) => s.customVideos).filter((v) => v.published);
  const items: { id: string; title: string; description: string; subject: string; topic: string; emoji: string }[] = [
    ...LESSONS.map((l) => ({ id: l.id, title: l.title, description: l.description, subject: l.subject, topic: l.topic, emoji: l.emoji })),
    ...custom.map((v) => ({ id: v.id, title: v.title, description: v.description, subject: v.subject, topic: v.topic, emoji: '🎞️' }))
  ];
  const bySubject = items.reduce<Record<string, typeof items>>((acc, it) => { (acc[it.subject] ??= []).push(it); return acc; }, {});
  return (
    <div className="min-h-[100dvh]">
      <TopBar title="Lernvideos" back="/home" stars={progress.stars} />
      <main className="seite flex flex-col gap-6">
        <LinoSays text="Schau ein kurzes Video und mach danach das Quiz!" size={80} />
        {Object.entries(bySubject).map(([subject, list]) => (
          <section key={subject} aria-labelledby={`v-${subject}`}>
            <h2 id={`v-${subject}`} className="mb-3 font-display text-2xl font-bold">{SUBJECT_NAMES[subject] ?? subject}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((v) => {
                const p = progress.videos[v.id];
                return (
                  <Link key={v.id} to={`/videos/${v.id}`} className="karte flex flex-col gap-2 p-5" data-testid={`video-${v.id}`}>
                    <div className="flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-himmel-300 to-lila-300 text-6xl"><span className="emoji">{v.emoji}</span><Play className="ml-2 fill-white text-white" size={40} /></div>
                    <span className="font-display text-xl font-bold">{v.title}</span>
                    <span className="text-tinte/70">{v.topic} · {v.description}</span>
                    <ProgressBar value={p?.progress ?? 0} label="Angesehen" />
                    {p?.completed && <span className="text-sm font-bold text-minze-700">✅ Angesehen</span>}
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
      <TopBar title="Video" back="/videos" />
      <main className="seite"><LinoSays text="Dieses Video gibt es nicht." mood="denken" /></main>
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
      <input type="range" min={0} max={duration} step={0.1} value={t} onChange={(e) => onSeek(Number(e.target.value))} className="w-full accent-himmel-500" aria-label="Position im Video" />
      <div className="flex flex-wrap items-center gap-2">
        <button className="knopf h-14 w-14 bg-sonne-500 px-0" onClick={onToggle} aria-label={playing ? 'Pause' : 'Abspielen'} data-testid="play-toggle">{playing ? <Pause /> : <Play />}</button>
        <button className="knopf h-14 w-14 bg-white px-0" onClick={onRestart} aria-label="Von vorn"><RotateCcw /></button>
        <span className="font-mono text-lg" aria-live="off">{fmt(t)} / {fmt(duration)}</span>
        <div className="flex-1" />
        <button className={`knopf h-14 px-3 text-base ${cc ? 'bg-himmel-300' : 'bg-white'}`} onClick={() => setCc(!cc)} aria-pressed={cc} aria-label="Untertitel">{cc ? <Captions /> : <CaptionsOff />} Untertitel</button>
        {setReadAloud && <button className={`knopf h-14 px-3 text-base ${readAloud ? 'bg-himmel-300' : 'bg-white'}`} onClick={() => setReadAloud(!readAloud)} aria-pressed={readAloud} aria-label="Vorlesen">{readAloud ? <Volume2 /> : <VolumeX />} Vorlesen</button>}
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
    if (playing && readAloud && cue && cue !== lastCue.current) speak(cue.text, { force: true });
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
      <TopBar title={lesson.title} back="/videos" />
      <main className="seite flex flex-col items-center gap-4">
        <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-3xl bg-himmel-100 shadow-karte" data-testid="lesson-stage">
          <PlusLessonScene t={t} />
          {cc && cue && (
            <p className="absolute inset-x-4 bottom-3 rounded-xl bg-tinte/85 px-4 py-2 text-center text-lg font-bold text-white sm:text-2xl" data-testid="untertitel">{cue.text}</p>
          )}
          {!playing && t === 0 && (
            <button className="absolute inset-0 flex items-center justify-center bg-tinte/20" onClick={() => setPlaying(true)} aria-label="Video starten">
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-sonne-500 shadow-knopf"><Play size={48} className="fill-tinte" /></span>
            </button>
          )}
        </div>
        <div className="w-full max-w-3xl">
          <PlayerControls playing={playing} onToggle={() => { if (t >= lesson.duration) setT(0); setPlaying((p) => !p); if (playing) stopSpeaking(); }} onRestart={() => { seek(0); setPlaying(true); }} t={t} duration={lesson.duration} onSeek={seek} cc={cc} setCc={setCc} readAloud={readAloud} setReadAloud={setReadAloud} />
        </div>
        <ProgressBar value={progress} label="Fortschritt im Video" />
        {completed && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="karte flex w-full max-w-3xl flex-col items-center gap-3 p-6 text-center">
            <Lino mood="jubel" size={90} />
            <p className="font-display text-2xl font-bold">Video geschafft! Jetzt bist du dran.</p>
            <button className="knopf bg-minze-500 text-white" onClick={() => nav(`/spiel/quiz-${lesson.id}`)} data-testid="zum-quiz">Zum Quiz</button>
          </motion.div>
        )}
        <p className="text-center text-sm text-tinte/60">Selbst erstellte animierte Erklärung von Lernito Kids. Die Untertitel sind immer verfügbar – auch ohne Ton.</p>
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
    <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-label="Animierte Erklärung: drei Äpfel plus zwei Äpfel sind fünf Äpfel">
      <rect width="640" height="360" fill="#DDF1FF" />
      <rect y="280" width="640" height="80" fill="#8EE3BF" />
      <circle cx="580" cy="60" r="34" fill="#FFD166" />
      {/* Lino */}
      <g transform={`translate(${t < 5 ? 40 + t * 8 : 80} ${t < 5 ? 150 + Math.sin(t * 4) * 6 : 150}) scale(0.55)`}>
        <g fill="#FF8A3D">{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 66} cy={Math.sin(a) * 66} r="20" />; })}<circle r="72" /></g>
        <ellipse rx="52" ry="48" fill="#FFD166" />
        <circle cx="-19" cy="-8" r="8" fill="#2B2D42" /><circle cx="19" cy="-8" r="8" fill="#2B2D42" />
        <ellipse cy="14" rx="17" ry="13" fill="#FFF1CC" />
        <path d="M-10 21 q10 10 20 0" stroke="#2B2D42" strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cy="120" rx="44" ry="28" fill="#FFB627" />
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
      {t >= 34 && <text x="320" y="200" textAnchor="middle" fontSize="34" fontWeight="700" fill="#5233B0" fontFamily="Fredoka, sans-serif">Plus = zusammenzählen</text>}
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
      if (!b) { setError('Die Videodatei wurde auf diesem Gerät nicht gefunden.'); return; }
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
        {!src && !error && <div className="aspect-video w-full max-w-3xl animate-pulse rounded-3xl bg-white" role="status" aria-label="Video wird geladen" />}
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
        {cues.length === 0 && src && <p className="text-sm text-tinte/60">Für dieses Video sind keine Untertitel hinterlegt.</p>}
        {completed && video.quizModuleId && <button className="knopf bg-minze-500 text-white" onClick={() => nav(`/spiel/${video.quizModuleId}`)}>Zum Quiz</button>}
        {completed && !video.quizModuleId && <LinoSays text="Super zugeschaut!" mood="jubel" />}
      </main>
    </div>
  );
}
