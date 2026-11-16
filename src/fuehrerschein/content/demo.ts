import type { Txt } from '../../i18n';
import { RAW_DE } from '../questionsDE';
import { RAW_IT } from '../questionsIT';
import { SIGNS, type SignDef, type SignGroup } from '../signs';
import type { ChapterId, I18n, Question, QuestionImage } from '../schema';
import { DEMO_SOURCE } from './source';
import { CROSSING_DE, CROSSING_IT } from './crossings';

/**
 * Demo-Inhalt: eigene Fragen von Lernito (keine amtlichen Fragen).
 * Status 'demo' – nicht Frage für Frage mit dem amtlichen Katalog abgeglichen.
 */
export { DEMO_SOURCE } from './source';
const V = 1;
const asI18n = (t: Txt): I18n => (typeof t === 'string' ? { de: t, it: t } : { de: t.de, it: t.it });

const CHAPTER_DE: Record<string, ChapterId> = {
  'de-g1': 'vulnerabili', 'de-g2': 'meteo', 'de-g3': 'meteo', 'de-g4': 'vulnerabili', 'de-g5': 'meteo', 'de-g6': 'meteo', 'de-g7': 'vulnerabili',
  'de-g8': 'velocita', 'de-g9': 'velocita', 'de-g10': 'meteo',
  'de-v1': 'velocita', 'de-v2': 'velocita', 'de-v3': 'vulnerabili', 'de-v4': 'autostrada', 'de-v5': 'manovre', 'de-v6': 'manovre', 'de-v7': 'precedenza',
  'de-v8': 'precedenza', 'de-v9': 'vulnerabili', 'de-v10': 'meteo', 'de-v11': 'incidente', 'de-v12': 'velocita', 'de-v13': 'persona', 'de-v14': 'sosta',
  'de-r1': 'precedenza', 'de-r2': 'precedenza', 'de-r3': 'precedenza', 'de-r4': 'vulnerabili', 'de-r5': 'precedenza', 'de-r6': 'precedenza',
  'de-p1': 'persona', 'de-p2': 'persona', 'de-p3': 'persona', 'de-p4': 'persona', 'de-p5': 'incidente',
  'de-t1': 'veicolo', 'de-t2': 'veicolo', 'de-t3': 'veicolo', 'de-t4': 'veicolo', 'de-t5': 'veicolo', 'de-t6': 'veicolo',
  'de-u1': 'ambiente', 'de-u2': 'ambiente', 'de-u3': 'ambiente'
};
const CHAPTER_IT: Record<string, ChapterId> = {
  'it-p1': 'precedenza', 'it-p2': 'precedenza', 'it-p3': 'precedenza', 'it-p4': 'precedenza', 'it-p5': 'precedenza', 'it-p6': 'precedenza', 'it-p7': 'vulnerabili',
  'it-v1': 'velocita', 'it-v2': 'velocita', 'it-v3': 'velocita', 'it-v4': 'velocita', 'it-v5': 'velocita', 'it-v6': 'meteo', 'it-v7': 'persona', 'it-v8': 'meteo',
  'it-s1': 'manovre', 'it-s2': 'manovre', 'it-s3': 'manovre', 'it-s4': 'manovre', 'it-s5': 'manovre',
  'it-f1': 'sosta', 'it-f2': 'sosta', 'it-f3': 'sosta', 'it-f4': 'sosta',
  'it-l1': 'meteo', 'it-l2': 'meteo', 'it-l3': 'meteo', 'it-l4': 'autostrada', 'it-l5': 'autostrada', 'it-l6': 'autostrada',
  'it-c1': 'veicolo', 'it-c2': 'veicolo', 'it-c3': 'incidente', 'it-c4': 'incidente', 'it-c5': 'incidente', 'it-c6': 'persona', 'it-c7': 'incidente',
  'it-a1': 'persona', 'it-a2': 'persona', 'it-a3': 'persona', 'it-a4': 'persona', 'it-a5': 'persona', 'it-a6': 'persona',
  'it-e1': 'veicolo', 'it-e2': 'veicolo', 'it-e3': 'veicolo', 'it-e4': 'ambiente', 'it-e5': 'ambiente'
};

const SHAPE: Record<SignGroup, I18n> = {
  gefahr: { de: 'Verkehrszeichen: Dreieck mit rotem Rand', it: 'Segnale: triangolo con bordo rosso' },
  vorfahrt: { de: 'Verkehrszeichen zur Vorfahrt', it: 'Segnale di precedenza' },
  verbot: { de: 'Verkehrszeichen: rund, mit rotem Rand', it: 'Segnale: rotondo con bordo rosso' },
  gebot: { de: 'Verkehrszeichen: rund und blau', it: 'Segnale: rotondo e blu' },
  hinweis: { de: 'Verkehrszeichen: eckig und blau', it: 'Segnale: quadrato o rettangolare blu' }
};
const signImage = (s: SignDef): QuestionImage => ({ type: 'sign', id: s.id, alt: SHAPE[s.group] });
const diagram = (id: string, alt: I18n): QuestionImage => ({ type: 'diagram', id, alt });
const LETTERS = ['a', 'b', 'c', 'd'];
const VF = [{ id: 'v', text: { de: 'Richtig', it: 'Vero' } }, { id: 'f', text: { de: 'Falsch', it: 'Falso' } }];

function multi(id: string, chapter: ChapterId, weight: number, text: I18n, opts: [I18n, boolean][], explanation: I18n, extra: Partial<Question> = {}): Question {
  return {
    id, country: 'DE', chapter, format: 'multi', weight, text, explanation,
    options: opts.map(([t], i) => ({ id: LETTERS[i]!, text: t })),
    correct: opts.map(([, ok], i) => (ok ? LETTERS[i]! : '')).filter(Boolean),
    source: DEMO_SOURCE, version: V, status: 'demo', ...extra
  };
}
function vf(id: string, chapter: ChapterId, text: I18n, ok: boolean, explanation: I18n, extra: Partial<Question> = {}): Question {
  return { id, country: 'IT', chapter, format: 'vf', text, explanation, options: VF, correct: [ok ? 'v' : 'f'], source: DEMO_SOURCE, version: V, status: 'demo', ...extra };
}

function others(sign: SignDef, n: number): SignDef[] {
  const i = SIGNS.indexOf(sign);
  const rot = (a: SignDef[]) => a.map((_, j) => a[(j + i) % a.length]!);
  return [...rot(SIGNS.filter((s) => s.group === sign.group && s.id !== sign.id)), ...rot(SIGNS.filter((s) => s.group !== sign.group))].slice(0, n);
}

// ---------- Deutschland ----------
const DE_ILLUSTRATED: Question[] = [
  multi('de-b1', 'precedenza', 5, { de: 'Kreuzung ohne Verkehrszeichen und ohne Ampel. Wer darf zuerst fahren?', it: 'Incrocio senza segnali e senza semaforo. Chi passa per primo?' },
    [[{ de: 'Das rote Auto', it: 'Il veicolo rosso' }, true], [{ de: 'Ich mit dem blauen Auto, weil ich geradeaus fahre', it: 'Io con il veicolo blu, perché vado diritto' }, false], [{ de: 'Wer zuerst an der Kreuzung ist', it: 'Chi arriva per primo all’incrocio' }, false]],
    { de: 'Ohne Regelung gilt „rechts vor links“. Das rote Auto kommt von rechts.', it: 'Senza segnali vale la precedenza a destra. Il veicolo rosso arriva da destra.' },
    { image: diagram('rechts-vor-links', { de: 'Kreuzung von oben: blaues Auto kommt von unten, rotes Auto von rechts.', it: 'Incrocio visto dall’alto: veicolo blu da sotto, veicolo rosso da destra.' }),
      trap: { de: 'Geradeaus fahren gibt keinen Vorrang. Auch wer zuerst ankommt, hat deshalb keine Vorfahrt.', it: 'Andare diritto non dà la precedenza. Neanche arrivare per primi.' } }),
  multi('de-b2', 'precedenza', 5, { de: 'Sie wollen mit dem blauen Auto links abbiegen. Wie verhalten Sie sich?', it: 'Con il veicolo blu vuoi svoltare a sinistra. Come ti comporti?' },
    [[{ de: 'Das entgegenkommende rote Auto zuerst fahren lassen', it: 'Lascio passare prima il veicolo rosso che arriva di fronte' }, true], [{ de: 'Vor ihm abbiegen, weil ich schon blinke', it: 'Svolto prima di lui, perché ho già la freccia' }, false], [{ de: 'In der Kreuzung warten, ohne den Gegenverkehr zu behindern', it: 'Aspetto nell’incrocio senza ostacolare chi arriva' }, true]],
    { de: 'Linksabbieger lassen den Gegenverkehr durch und warten dabei so, dass niemand behindert wird.', it: 'Chi svolta a sinistra lascia passare chi arriva di fronte e aspetta senza ostacolare.' },
    { image: diagram('linksabbiegen', { de: 'Kreuzung: blaues Auto will links abbiegen, rotes Auto kommt entgegen.', it: 'Incrocio: veicolo blu svolta a sinistra, veicolo rosso arriva di fronte.' }),
      trap: { de: 'Der Blinker gibt kein Vorrecht – er kündigt nur an, was du vorhast.', it: 'La freccia non dà la precedenza: indica solo cosa vuoi fare.' } }),
  multi('de-b3', 'vulnerabili', 5, { de: 'Sie biegen mit dem blauen Auto rechts ab. Was müssen Sie beachten?', it: 'Con il veicolo blu svolti a destra. A cosa devi fare attenzione?' },
    [[{ de: 'Den Radfahrer auf dem Radweg geradeaus fahren lassen', it: 'Lasciar proseguire il ciclista sulla pista ciclabile' }, true], [{ de: 'Schulterblick nach rechts', it: 'Guardare oltre la spalla destra' }, true], [{ de: 'Zügig abbiegen, bevor der Radfahrer da ist', it: 'Svoltare in fretta prima che arrivi il ciclista' }, false]],
    { de: 'Wer abbiegt, muss geradeaus fahrende Radfahrer durchlassen. Sie stecken oft im toten Winkel.', it: 'Chi svolta deve lasciar passare i ciclisti che vanno diritto. Spesso sono nell’angolo cieco.' },
    { image: diagram('rechtsabbieger-rad', { de: 'Straße mit Radweg rechts: blaues Auto biegt rechts ab, Radfahrer fährt geradeaus.', it: 'Strada con pista ciclabile a destra: veicolo blu svolta a destra, ciclista va diritto.' }) }),
  multi('de-b4', 'autostrada', 5, { de: 'Stau auf einer dreispurigen Autobahn. Wo bilden Sie die Rettungsgasse?', it: 'Coda su un’autostrada a tre corsie. Dove lasci il corridoio di emergenza?' },
    [[{ de: 'Zwischen der linken und der mittleren Spur', it: 'Tra la corsia di sinistra e quella centrale' }, true], [{ de: 'Zwischen der mittleren und der rechten Spur', it: 'Tra la corsia centrale e quella di destra' }, false], [{ de: 'Auf dem Seitenstreifen', it: 'Sulla corsia di emergenza' }, false]],
    { de: 'Die Rettungsgasse liegt immer zwischen der ganz linken Spur und der Spur daneben.', it: 'Il corridoio è sempre tra la corsia più a sinistra e quella accanto.' },
    { image: diagram('rettungsgasse', { de: 'Autobahn mit drei Spuren im Stau, Rettungswagen von hinten.', it: 'Autostrada a tre corsie in coda, ambulanza da dietro.' }),
      trap: { de: 'Die Mitte der Fahrbahn ist nicht automatisch richtig: Bei drei Spuren liegt die Gasse links von der Mitte.', it: 'Il centro della strada non è automaticamente giusto: con tre corsie il corridoio è a sinistra del centro.' } }),
  multi('de-b5', 'vulnerabili', 4, { de: 'Was tun Sie in dieser Situation?', it: 'Cosa fai in questa situazione?' },
    [[{ de: 'Anhalten und den Fußgänger über den Zebrastreifen gehen lassen', it: 'Fermarmi e lasciare attraversare il pedone sulle strisce' }, true], [{ de: 'Hupen und weiterfahren', it: 'Suonare il clacson e proseguire' }, false], [{ de: 'Schneller fahren, um vor ihm vorbei zu sein', it: 'Accelerare per passare prima di lui' }, false]],
    { de: 'Am Fußgängerüberweg müssen Sie Fußgängern das Überqueren ermöglichen.', it: 'Sulle strisce devi permettere ai pedoni di attraversare.' },
    { image: diagram('zebra', { de: 'Straße mit Zebrastreifen, Fußgänger am rechten Rand, blaues Auto nähert sich.', it: 'Strada con strisce pedonali, pedone sul bordo destro, veicolo blu in arrivo.' }) })
];

const DE_TRAPS: Question[] = [
  multi('de-x1', 'precedenza', 5, { de: 'Die Ampel zeigt Grün. Ein Polizist steht Ihnen mit der Brust zugewandt. Was gilt?', it: 'Il semaforo è verde. Un vigile è rivolto verso di te con il petto. Cosa vale?' },
    [[{ de: 'Anhalten', it: 'Fermarsi' }, true], [{ de: 'Weiterfahren, weil die Ampel Grün zeigt', it: 'Proseguire perché il semaforo è verde' }, false], [{ de: 'Hupen und vorsichtig weiterfahren', it: 'Suonare e proseguire con prudenza' }, false]],
    { de: 'Zeichen von Polizeibeamten gehen Ampeln vor. Brust oder Rücken bedeutet: Halt.', it: 'I segnali degli agenti prevalgono sul semaforo. Petto o schiena significano: fermarsi.' },
    { trap: { de: 'Das grüne Licht lenkt ab. Entscheidend ist der Polizist – er steht über der Ampel.', it: 'Il verde distrae. Conta il vigile, che prevale sul semaforo.' } }),
  multi('de-x2', 'meteo', 4, { de: 'Nebel, Sichtweite etwa 80 m. Dürfen Sie die Nebelschlussleuchte einschalten?', it: 'Nebbia, visibilità circa 80 m. Puoi accendere il retronebbia?' },
    [[{ de: 'Nein, erst bei Sichtweite unter 50 m', it: 'No, solo con visibilità sotto i 50 m' }, true], [{ de: 'Ja, bei Nebel immer', it: 'Sì, con la nebbia sempre' }, false], [{ de: 'Ja, wenn ich langsamer als 50 km/h fahre', it: 'Sì, se vado sotto i 50 km/h' }, false]],
    { de: 'Die Nebelschlussleuchte blendet. Sie ist nur bei Sicht unter 50 m erlaubt.', it: 'Il retronebbia abbaglia: è consentito solo con visibilità sotto i 50 m.' },
    { trap: { de: 'Das Wort „Nebel“ verleitet zum Ja. Es kommt aber auf die Sichtweite an.', it: 'La parola “nebbia” spinge a dire sì, ma conta la visibilità.' } }),
  multi('de-x3', 'autostrada', 4, { de: 'Auf der Autobahn steht links eine Kolonne. Dürfen Sie rechts an ihr vorbeifahren?', it: 'In autostrada a sinistra c’è una colonna ferma. Puoi passarle a destra?' },
    [[{ de: 'Ja, aber nur mit geringfügig höherer Geschwindigkeit und mit Vorsicht', it: 'Sì, ma solo poco più veloce e con prudenza' }, true], [{ de: 'Nein, rechts überholen ist auf der Autobahn immer verboten', it: 'No, in autostrada il sorpasso a destra è sempre vietato' }, false], [{ de: 'Ja, mit beliebiger Geschwindigkeit', it: 'Sì, a qualsiasi velocità' }, false]],
    { de: 'Steht die linke Spur oder fährt sie sehr langsam, darf rechts mit geringfügig höherer Geschwindigkeit vorbeigefahren werden.', it: 'Se la corsia di sinistra è ferma o lentissima, si può passare a destra solo poco più veloci.' },
    { trap: { de: '„Rechts überholen ist verboten“ stimmt meistens – aber nicht immer. Lies die Situation genau.', it: '“Sorpassare a destra è vietato” vale quasi sempre, ma non sempre: leggi bene la situazione.' } }),
  multi('de-x4', 'sosta', 3, { de: 'Wo ist das Halten verboten?', it: 'Dove è vietato fermarsi?' },
    [[{ de: 'Auf Fußgängerüberwegen und bis zu 5 m davor', it: 'Sulle strisce pedonali e fino a 5 m prima' }, true], [{ de: 'An engen und unübersichtlichen Straßenstellen', it: 'Nei tratti stretti e senza visibilità' }, true], [{ de: 'Auf einem gekennzeichneten Parkstreifen', it: 'Su una fascia di sosta segnalata' }, false]],
    { de: 'Halteverbote schützen Fußgänger und die Sicht.', it: 'I divieti di fermata proteggono i pedoni e la visibilità.' }),
  multi('de-x5', 'autostrada', 3, { de: 'Wer darf die Autobahn benutzen?', it: 'Chi può usare l’autostrada in Germania?' },
    [[{ de: 'Kraftfahrzeuge, die bauartbedingt schneller als 60 km/h fahren können', it: 'Veicoli a motore che per costruzione superano i 60 km/h' }, true], [{ de: 'Radfahrer', it: 'Ciclisti' }, false], [{ de: 'Mofas und Mopeds bis 45 km/h', it: 'Ciclomotori fino a 45 km/h' }, false]],
    { de: 'Langsame Fahrzeuge würden den schnellen Verkehr gefährden.', it: 'I veicoli lenti metterebbero in pericolo il traffico veloce.' }),
  multi('de-x6', 'incidente', 4, { de: 'Wann bringen Sie einen Verletzten in die stabile Seitenlage?', it: 'Quando metti un ferito in posizione laterale di sicurezza?' },
    [[{ de: 'Wenn er bewusstlos ist und normal atmet', it: 'Se è incosciente e respira normalmente' }, true], [{ de: 'Wenn er nicht atmet', it: 'Se non respira' }, false], [{ de: 'Bei jedem Verletzten', it: 'Con ogni ferito' }, false]],
    { de: 'Wer nicht atmet, braucht sofort Herzdruckmassage. Die Seitenlage hält die Atemwege frei.', it: 'Chi non respira ha bisogno subito del massaggio cardiaco. La posizione laterale tiene libere le vie aeree.' },
    { trap: { de: 'Seitenlage klingt immer richtig – ohne Atmung ist sie aber gefährlich, weil Zeit verloren geht.', it: 'La posizione laterale sembra sempre giusta, ma senza respiro si perde tempo prezioso.' } })
];

function signQuestionsDE(): Question[] {
  return SIGNS.map((s) => {
    const opts: [I18n, boolean][] = [[asI18n(s.meaning), true], ...others(s, 2).map((o): [I18n, boolean] => [asI18n(o.meaning), false])];
    const name = asI18n(s.name), m = asI18n(s.meaning);
    return multi(`de-z-${s.id}`, 'segnali', s.group === 'vorfahrt' ? 5 : 3, { de: 'Was bedeutet dieses Verkehrszeichen?', it: 'Che cosa indica questo segnale?' }, opts,
      { de: `„${name.de}“: ${m.de}`, it: `“${name.it}”: ${m.it}` }, { image: signImage(s) });
  });
}

export const DEMO_DE: Question[] = [
  ...RAW_DE.map(([id, , points, q, opts, expl]) => multi(id, CHAPTER_DE[id]!, points, asI18n(q), opts.map(([t, ok]): [I18n, boolean] => [asI18n(t), ok]), asI18n(expl))),
  ...DE_ILLUSTRATED,
  ...DE_TRAPS,
  ...CROSSING_DE,
  ...signQuestionsDE()
];

// ---------- Italia ----------
const IT_ILLUSTRATED: Question[] = [
  vf('it-b1', 'precedenza', { de: 'An der abgebildeten Kreuzung ohne Zeichen muss das blaue Fahrzeug dem roten Vorfahrt lassen.', it: 'Nell’incrocio raffigurato, senza segnali, il veicolo blu deve dare la precedenza al veicolo rosso.' }, true,
    { de: 'Das rote Fahrzeug kommt von rechts: Es gilt rechts vor links.', it: 'Il veicolo rosso proviene da destra: vale la precedenza a destra.' },
    { image: diagram('rechts-vor-links', { de: 'Kreuzung von oben: blaues Auto von unten, rotes Auto von rechts.', it: 'Incrocio visto dall’alto: veicolo blu da sotto, veicolo rosso da destra.' }) }),
  vf('it-b2', 'precedenza', { de: 'Das blaue Fahrzeug, das links abbiegt, darf vor dem roten Fahrzeug fahren, das geradeaus entgegenkommt.', it: 'Il veicolo blu che svolta a sinistra può passare prima del veicolo rosso che arriva di fronte e va diritto.' }, false,
    { de: 'Wer links abbiegt, lässt den Gegenverkehr durch.', it: 'Chi svolta a sinistra dà la precedenza a chi arriva di fronte.' },
    { image: diagram('linksabbiegen', { de: 'Kreuzung: blaues Auto biegt links ab, rotes Auto kommt entgegen.', it: 'Incrocio: veicolo blu svolta a sinistra, veicolo rosso arriva di fronte.' }),
      trap: { de: 'Wer schon in der Kreuzung steht, fühlt sich im Recht – trotzdem hat der Gegenverkehr Vorrang.', it: 'Chi è già nell’incrocio si sente in diritto di passare, ma la precedenza resta a chi arriva di fronte.' } }),
  vf('it-b3', 'precedenza', { de: 'Im abgebildeten Kreisverkehr ohne Zeichen am Eingang muss das einfahrende blaue Fahrzeug immer warten.', it: 'Nella rotatoria raffigurata, senza segnali agli ingressi, il veicolo blu che entra deve sempre dare la precedenza.' }, false,
    { de: 'Ohne Zeichen gilt auch im Kreisverkehr die allgemeine Regel rechts vor links: Das blaue Fahrzeug kommt für das rote von rechts.', it: 'Senza segnali anche in rotatoria vale la regola generale della precedenza a destra: per il veicolo rosso, il blu arriva da destra.' },
    { image: diagram('rotatoria', { de: 'Kreisverkehr von oben: rotes Auto im Kreis, blaues Auto fährt von unten ein, kein Schild am Eingang.', it: 'Rotatoria vista dall’alto: veicolo rosso nell’anello, veicolo blu entra da sotto, nessun segnale all’ingresso.' }),
      trap: { de: 'Meist steht am Eingang „Vorfahrt gewähren“. Fehlt das Zeichen, gilt die Grundregel.', it: 'Di solito agli ingressi c’è “dare precedenza”: se manca, vale la regola generale.' } }),
  vf('it-b4', 'vulnerabili', { de: 'Das blaue Fahrzeug muss anhalten, damit der Fußgänger den Zebrastreifen überqueren kann.', it: 'Il veicolo blu deve fermarsi per far attraversare il pedone sulle strisce.' }, true,
    { de: 'Fußgängern, die gerade überqueren wollen, muss man Vorrang geben.', it: 'Ai pedoni che stanno per attraversare si deve dare la precedenza.' },
    { image: diagram('zebra', { de: 'Straße mit Zebrastreifen, Fußgänger am Rand, blaues Auto nähert sich.', it: 'Strada con strisce pedonali, pedone sul bordo, veicolo blu in arrivo.' }) }),
  vf('it-b5', 'vulnerabili', { de: 'Beim Rechtsabbiegen muss das blaue Fahrzeug den Radfahrer, der geradeaus fährt, durchlassen.', it: 'Svoltando a destra, il veicolo blu deve lasciar passare il ciclista che prosegue diritto.' }, true,
    { de: 'Radfahrer auf dem Radweg haben Vorrang. Vor dem Abbiegen Spiegel und Schulterblick.', it: 'I ciclisti sulla pista hanno la precedenza. Prima di svoltare controlla specchietto e angolo cieco.' },
    { image: diagram('rechtsabbieger-rad', { de: 'Straße mit Radweg: blaues Auto biegt rechts ab, Radfahrer fährt geradeaus.', it: 'Strada con pista ciclabile: veicolo blu svolta a destra, ciclista va diritto.' }) })
];

const stopSign = SIGNS.find((s) => s.id === 'stop')!;
const IT_TRAPS: Question[] = [
  vf('it-x1', 'precedenza', { de: 'Gelbes Blinklicht an der Ampel bedeutet, dass man immer anhalten muss.', it: 'Il giallo lampeggiante del semaforo obbliga sempre a fermarsi.' }, false,
    { de: 'Gelbes Blinklicht heißt: vorsichtig fahren und die Vorfahrt beachten.', it: 'Il giallo lampeggiante significa procedere con prudenza rispettando la precedenza.' },
    { trap: { de: 'Verwechslung mit gelbem Dauerlicht: Das bedeutet anhalten, das Blinklicht nicht.', it: 'Si confonde con il giallo fisso, che impone di fermarsi; il lampeggiante no.' } }),
  vf('it-x2', 'segnali', { de: 'Das abgebildete Zeichen verpflichtet nur dann zum Anhalten, wenn andere Fahrzeuge kommen.', it: 'Il segnale raffigurato obbliga a fermarsi solo se arrivano altri veicoli.' }, false,
    { de: 'Beim STOP muss man immer anhalten, auch wenn die Straße frei ist.', it: 'Allo STOP ci si deve sempre fermare, anche se la strada è libera.' },
    { image: signImage(stopSign), trap: { de: '„Nur wenn jemand kommt“ gilt für „Vorfahrt gewähren“, nicht für STOP.', it: '“Solo se arriva qualcuno” vale per il dare precedenza, non per lo STOP.' } }),
  vf('it-x3', 'autostrada', { de: 'Auf dem Standstreifen der Autobahn darf man kurz halten, um zu telefonieren.', it: 'Sulla corsia di emergenza dell’autostrada ci si può fermare brevemente per telefonare.' }, false,
    { de: 'Der Standstreifen ist nur für Notfälle (Panne, Unwohlsein) da.', it: 'La corsia di emergenza serve solo per le emergenze (guasto, malore).' },
    { trap: { de: '„Kurz“ klingt harmlos – trotzdem ist es kein Notfall.', it: '“Brevemente” sembra innocuo, ma non è un’emergenza.' } }),
  vf('it-x4', 'autostrada', { de: 'Auf der Autobahn sind Mopeds (ciclomotori) verboten.', it: 'In autostrada è vietata la circolazione dei ciclomotori.' }, true,
    { de: 'Langsame Fahrzeuge sind auf der Autobahn nicht zugelassen.', it: 'I veicoli lenti non sono ammessi in autostrada.' }),
  vf('it-x5', 'incidente', { de: 'Die stabile Seitenlage ist für einen bewusstlosen Verletzten, der normal atmet.', it: 'La posizione laterale di sicurezza si usa per un ferito incosciente che respira normalmente.' }, true,
    { de: 'Wer nicht atmet, braucht Herzdruckmassage und den Notruf 112.', it: 'Chi non respira ha bisogno del massaggio cardiaco e del 112.' }),
  vf('it-x6', 'vulnerabili', { de: 'Fährt ein Radfahrer ganz rechts, braucht man beim Überholen keinen besonderen Seitenabstand.', it: 'Se il ciclista viaggia sul margine destro, per sorpassarlo non serve una distanza laterale particolare.' }, false,
    { de: 'Radfahrer mit ausreichend Abstand überholen, wo möglich mindestens 1,5 m.', it: 'I ciclisti si sorpassano con ampio margine, dove possibile almeno 1,5 m.' },
    { trap: { de: 'Dass er weit rechts fährt, macht wenig Abstand nicht sicherer: Ein Windstoß oder ein Schlagloch reicht.', it: 'Che stia a destra non rende sicuro passargli vicino: basta una buca o un colpo di vento.' } })
];

function signQuestionsIT(): Question[] {
  const out: Question[] = [];
  for (const s of SIGNS) {
    const n = asI18n(s.name), m = asI18n(s.meaning), w = asI18n(others(s, 1)[0]!.name);
    const expl = { de: `Das Zeichen heißt „${n.de}“: ${m.de}`, it: `Il segnale è “${n.it}”: ${m.it}` };
    out.push(vf(`it-z-${s.id}`, 'segnali', { de: `Das abgebildete Zeichen bedeutet: ${n.de}.`, it: `Il segnale raffigurato indica: ${n.it!.toLowerCase()}.` }, true, expl, { image: signImage(s) }));
    out.push(vf(`it-zf-${s.id}`, 'segnali', { de: `Das abgebildete Zeichen bedeutet: ${w.de}.`, it: `Il segnale raffigurato indica: ${w.it!.toLowerCase()}.` }, false, expl, { image: signImage(s) }));
  }
  return out;
}

export const DEMO_IT: Question[] = [
  ...RAW_IT.map(([id, , s, ok, expl]) => vf(id, CHAPTER_IT[id]!, asI18n(s), ok, asI18n(expl))),
  ...IT_ILLUSTRATED,
  ...IT_TRAPS,
  ...CROSSING_IT,
  ...signQuestionsIT()
];
