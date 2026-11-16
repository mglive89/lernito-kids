import type { I18n, Lesson, Question } from '../schema';
import { DEMO_SOURCE } from './source';

/**
 * Kreuzungsaufgaben mit eigenen Skizzen (src/fuehrerschein/diagrams.tsx, CROSS_SCENES).
 * DE: Reihenfolge wählen (eine richtige Antwort). IT: Aussagen vero/falso.
 */
const COL: Record<string, I18n> = { blau: { de: 'Blau', it: 'blu' }, rot: { de: 'Rot', it: 'rosso' }, gruen: { de: 'Grün', it: 'verde' } };
/** Reihenfolge als Text, z. B. [['rot'], ['blau', 'gruen']] → „1. Rot, 2. Blau und Grün gleichzeitig“ */
function order(steps: string[][]): I18n {
  const part = (lang: 'de' | 'it') => steps.map((s, i) => `${i + 1}. ${s.map((c) => COL[c]![lang]).join(lang === 'de' ? ' und ' : ' e ')}${s.length > 1 ? (lang === 'de' ? ' gleichzeitig' : ' insieme') : ''}`).join(', ');
  return { de: part('de'), it: part('it') };
}
const alt = (de: string, it: string): I18n => ({ de: `Kreuzung von oben. ${de}`, it: `Incrocio visto dall’alto. ${it}` });
const ASK: I18n = { de: 'In welcher Reihenfolge fahren die Fahrzeuge?', it: 'In quale ordine passano i veicoli?' };
const VF = [{ id: 'v', text: { de: 'Richtig', it: 'Vero' } }, { id: 'f', text: { de: 'Falsch', it: 'Falso' } }];

interface Spec {
  scene: string;
  alt: I18n;
  right: string[][];
  wrong: string[][][];
  expl: I18n;
  trap?: I18n;
  it: [I18n, boolean, I18n?][];
}

const SPECS: Spec[] = [
  { scene: 'k-rechts-drei', alt: alt('Ohne Verkehrszeichen. Blau von unten geradeaus, Rot von rechts geradeaus, Grün von links geradeaus.', 'Senza segnali. Blu da sotto diritto, rosso da destra diritto, verde da sinistra diritto.'),
    right: [['rot'], ['blau'], ['gruen']], wrong: [[['blau'], ['rot'], ['gruen']], [['gruen'], ['blau'], ['rot']]],
    expl: { de: 'Rechts vor links: Rot hat rechts niemanden und fährt zuerst, dann Blau (Rot war rechts), dann Grün (Blau war rechts).', it: 'Precedenza a destra: il rosso non ha nessuno a destra e passa per primo, poi il blu (aveva il rosso a destra), poi il verde (aveva il blu a destra).' },
    it: [[{ de: 'Das rote Fahrzeug fährt als erstes.', it: 'Il veicolo rosso passa per primo.' }, true], [{ de: 'Das grüne Fahrzeug fährt vor dem blauen.', it: 'Il veicolo verde passa prima del veicolo blu.' }, false]] },
  { scene: 'k-links-gegen', alt: alt('Ohne Verkehrszeichen. Blau von unten biegt links ab, Rot kommt von oben geradeaus entgegen.', 'Senza segnali. Blu da sotto svolta a sinistra, rosso arriva da sopra diritto.'),
    right: [['rot'], ['blau']], wrong: [[['blau'], ['rot']], [['blau', 'rot']]],
    expl: { de: 'Wer links abbiegt, lässt den Gegenverkehr durch.', it: 'Chi svolta a sinistra lascia passare chi arriva di fronte.' },
    trap: { de: 'Der Blinker oder ein schon begonnenes Abbiegen geben keinen Vorrang.', it: 'La freccia o una svolta già iniziata non danno la precedenza.' },
    it: [[{ de: 'Blau muss Rot Vorrang lassen.', it: 'Il veicolo blu deve dare la precedenza al veicolo rosso.' }, true], [{ de: 'Blau fährt zuerst, weil es mit dem Abbiegen schon begonnen hat.', it: 'Il veicolo blu passa per primo perché ha già iniziato la svolta.' }, false, { de: 'Ein begonnenes Abbiegen gibt keinen Vorrang.', it: 'Aver iniziato la svolta non dà la precedenza.' }]] },
  { scene: 'k-hauptstrasse-links', alt: alt('Blau (unten) und Rot (oben) auf der Vorfahrtstraße, links und rechts „Vorfahrt gewähren“. Blau biegt links ab, Rot fährt geradeaus, Grün kommt von rechts geradeaus.', 'Blu (sotto) e rosso (sopra) sulla strada con diritto di precedenza, ai lati “dare precedenza”. Blu svolta a sinistra, rosso diritto, verde da destra diritto.'),
    right: [['rot'], ['blau'], ['gruen']], wrong: [[['blau'], ['rot'], ['gruen']], [['gruen'], ['rot'], ['blau']]],
    expl: { de: 'Erst die Zeichen: Grün wartet. Zwischen Blau und Rot auf der Vorfahrtstraße gilt: Linksabbieger lässt Gegenverkehr durch.', it: 'Prima i segnali: il verde aspetta. Tra blu e rosso sulla strada principale vale: chi svolta a sinistra lascia passare chi arriva di fronte.' },
    trap: { de: 'Auf der Vorfahrtstraße zu sein heißt nicht, vor dem Gegenverkehr abbiegen zu dürfen.', it: 'Essere sulla strada principale non permette di svoltare a sinistra prima di chi arriva di fronte.' },
    it: [[{ de: 'Grün fährt als letztes.', it: 'Il veicolo verde passa per ultimo.' }, true], [{ de: 'Blau fährt vor Rot, weil es auf der Vorfahrtstraße ist.', it: 'Il veicolo blu passa prima del rosso perché è sulla strada con diritto di precedenza.' }, false, { de: 'Auch Rot ist auf der Vorfahrtstraße – und Linksabbieger warten.', it: 'Anche il rosso è sulla strada principale, e chi svolta a sinistra aspetta.' }]] },
  { scene: 'k-stop', alt: alt('Blau unten am STOP-Schild fährt geradeaus. Auf der Vorfahrtstraße kommt Rot von links geradeaus und Grün von rechts, das rechts abbiegt.', 'Blu sotto allo STOP va diritto. Sulla strada principale il rosso arriva da sinistra diritto, il verde da destra e svolta a destra.'),
    right: [['rot', 'gruen'], ['blau']], wrong: [[['blau'], ['rot', 'gruen']], [['rot'], ['blau'], ['gruen']]],
    expl: { de: 'Blau muss am STOP anhalten und beide Fahrzeuge der Vorfahrtstraße durchlassen. Rot und Grün kreuzen sich nicht und fahren gleichzeitig.', it: 'Il blu deve fermarsi allo STOP e lasciar passare i due veicoli della strada principale. Rosso e verde non si incrociano e passano insieme.' },
    it: [[{ de: 'Blau muss anhalten und fährt als letztes.', it: 'Il veicolo blu deve fermarsi e passa per ultimo.' }, true], [{ de: 'Grün muss Blau Vorfahrt lassen.', it: 'Il veicolo verde deve dare la precedenza al veicolo blu.' }, false]] },
  { scene: 'k-rechtsabbieger', alt: alt('Ohne Verkehrszeichen. Blau unten biegt rechts ab, Rot kommt von links geradeaus.', 'Senza segnali. Blu sotto svolta a destra, rosso arriva da sinistra diritto.'),
    right: [['blau'], ['rot']], wrong: [[['rot'], ['blau']]],
    expl: { de: 'Für Rot kommt Blau von rechts. Ob Blau abbiegt, spielt für die Vorfahrt keine Rolle.', it: 'Per il rosso, il blu arriva da destra. Che il blu svolti non conta per la precedenza.' },
    trap: { de: 'Viele denken, wer abbiegt, muss warten. Bei rechts vor links zählt nur, woher man kommt.', it: 'Molti pensano che chi svolta debba aspettare. Con la precedenza a destra conta solo da dove si arriva.' },
    it: [[{ de: 'Blau fährt vor Rot.', it: 'Il veicolo blu passa prima del veicolo rosso.' }, true, { de: 'Für Rot kommt Blau von rechts – ob Blau abbiegt, ist egal.', it: 'Per il rosso il blu arriva da destra: che svolti non conta.' }], [{ de: 'Blau muss Rot Vorfahrt lassen, weil es abbiegt.', it: 'Il veicolo blu deve dare la precedenza al rosso perché svolta.' }, false]] },
  { scene: 'k-nebenstrasse-zwei', alt: alt('Rot auf der Vorfahrtstraße von rechts geradeaus. Blau unten und Grün oben haben „Vorfahrt gewähren“; Blau fährt geradeaus, Grün biegt rechts ab.', 'Rosso sulla strada principale da destra diritto. Blu sotto e verde sopra hanno “dare precedenza”: blu diritto, verde svolta a destra.'),
    right: [['rot'], ['blau', 'gruen']], wrong: [[['rot'], ['gruen'], ['blau']], [['blau', 'gruen'], ['rot']]],
    expl: { de: 'Erst fährt Rot auf der Vorfahrtstraße. Blau und Grün haben das gleiche Zeichen; Grün biegt rechts ab, die Wege kreuzen sich nicht – beide fahren gleichzeitig.', it: 'Prima passa il rosso sulla strada principale. Blu e verde hanno lo stesso segnale; il verde svolta a destra, le traiettorie non si incrociano: passano insieme.' },
    it: [[{ de: 'Nach Rot fahren Blau und Grün gleichzeitig.', it: 'Dopo il rosso, il veicolo blu e il veicolo verde passano contemporaneamente.' }, true], [{ de: 'Grün fährt als erstes.', it: 'Il veicolo verde passa per primo.' }, false]] }
];

const image = (s: Spec) => ({ type: 'diagram' as const, id: s.scene, alt: s.alt });
const L = ['a', 'b', 'c'];

export const CROSSING_DE: Question[] = SPECS.map((s, i) => {
  const opts = [s.right, ...s.wrong];
  // richtige Antwort nicht immer an erster Stelle speichern (wird ohnehin gemischt)
  return {
    id: `de-k${i + 1}`, country: 'DE', chapter: 'precedenza', format: 'multi', weight: 5, text: ASK,
    options: opts.map((o, k) => ({ id: L[k]!, text: order(o) })), correct: ['a'],
    explanation: s.expl, trap: s.trap, image: image(s), source: DEMO_SOURCE, version: 1, status: 'demo'
  } satisfies Question;
});

export const CROSSING_IT: Question[] = SPECS.flatMap((s, i) => s.it.map(([text, ok, trap], k): Question => ({
  id: `it-k${i + 1}-${k + 1}`, country: 'IT', chapter: 'precedenza', format: 'vf', text,
  options: VF, correct: [ok ? 'v' : 'f'], explanation: s.expl, trap: trap ?? (ok ? undefined : s.trap), image: image(s),
  source: DEMO_SOURCE, version: 1, status: 'demo'
})));

const lessonSections = (scenes: [string, I18n][]) => scenes.map(([id, alt2]) => ({ heading: { de: 'Beispiel', it: 'Esempio' }, body: SPECS.find((s) => s.scene === id)!.expl, image: { type: 'diagram' as const, id, alt: alt2 } }));
const METHOD: I18n = {
  de: '1. Gibt es Polizei oder Ampel? 2. Welche Zeichen gelten für jedes Fahrzeug? Wer auf der Vorfahrtstraße ist, fährt vor den anderen. 3. Bei gleichen Zeichen: rechts vor links. 4. Linksabbieger lassen den Gegenverkehr durch. 5. Wer sich nicht kreuzt, darf gleichzeitig fahren.',
  it: '1. Ci sono agenti o semafori? 2. Quali segnali valgono per ogni veicolo? Chi è sulla strada principale passa prima degli altri. 3. A parità di segnali: precedenza a destra. 4. Chi svolta a sinistra lascia passare chi arriva di fronte. 5. Chi non si incrocia può passare insieme.'
};

export const CROSSING_LESSONS: Lesson[] = (['DE', 'IT'] as const).map((c) => ({
  id: `${c.toLowerCase()}-l-kreuzungen`, country: c, chapter: 'precedenza',
  title: { de: 'Kreuzungsaufgaben: Wer fährt zuerst?', it: 'Incroci: chi passa per primo?' },
  intro: { de: 'Mit fünf Fragen in fester Reihenfolge löst du jede Kreuzungsaufgabe.', it: 'Con cinque domande in ordine fisso risolvi ogni quiz sugli incroci.' },
  sections: [
    { heading: { de: 'Die Methode', it: 'Il metodo' }, body: METHOD },
    ...lessonSections([
      ['k-rechts-drei', SPECS[0]!.alt],
      ['k-hauptstrasse-links', SPECS[2]!.alt],
      ['k-nebenstrasse-zwei', SPECS[5]!.alt]
    ])
  ],
  source: DEMO_SOURCE, version: 1, status: 'demo'
}));
