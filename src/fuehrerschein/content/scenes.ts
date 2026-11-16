import type { ChapterId, I18n, Lesson, Question } from '../schema';
import { DEMO_SOURCE } from './source';

/**
 * Bildaufgaben zu den eigenen Skizzen in src/fuehrerschein/scenes.tsx.
 * DE: Multiple Choice (eine oder mehrere richtig, 2–5 Punkte). IT: Aussagen vero/falso.
 * Demo-Inhalt, nicht mit dem amtlichen Katalog abgeglichen.
 */
const L = ['a', 'b', 'c', 'd'];
const VF = [{ id: 'v', text: { de: 'Richtig', it: 'Vero' } }, { id: 'f', text: { de: 'Falsch', it: 'Falso' } }];

interface SceneSpec {
  scene: string;
  chapter: ChapterId;
  alt: I18n;
  expl: I18n;
  trap?: I18n;
  /** Deutschland: Frage, Gewicht, Antworten */
  de?: { text: I18n; weight: number; opts: [I18n, boolean][] };
  /** Italien: Aussagen vero/falso (eigene Falle optional) */
  it?: [I18n, boolean, I18n?][];
}

const SPECS: SceneSpec[] = [
  {
    scene: 'ueberholen-linie', chapter: 'manovre',
    alt: { de: 'Landstraße mit durchgezogener Mittellinie. Vor dem blauen Auto fährt ein Lkw, von vorn kommt ein rotes Auto.', it: 'Strada extraurbana con striscia centrale continua. Davanti al veicolo blu c’è un camion, di fronte arriva un veicolo rosso.' },
    expl: { de: 'Eine durchgezogene Linie darf nicht überfahren werden. Überholen ist hier verboten, egal wie langsam der Lkw ist.', it: 'La striscia continua non si può oltrepassare. Qui il sorpasso è vietato, anche se il camion è lento.' },
    trap: { de: 'Auch wenn die Gegenspur frei aussieht: Die durchgezogene Linie verbietet das Überholen.', it: 'Anche se la corsia opposta sembra libera, la striscia continua vieta il sorpasso.' },
    de: { text: { de: 'Dürfen Sie den Lkw hier überholen?', it: 'Puoi sorpassare il camion qui?' }, weight: 4, opts: [
      [{ de: 'Nein, die durchgezogene Linie darf ich nicht überfahren', it: 'No, non posso oltrepassare la striscia continua' }, true],
      [{ de: 'Ja, wenn das rote Auto noch weit genug weg ist', it: 'Sì, se il veicolo rosso è ancora abbastanza lontano' }, false],
      [{ de: 'Ja, weil der Lkw langsamer fährt als erlaubt', it: 'Sì, perché il camion va più piano del limite' }, false]] },
    it: [[{ de: 'Hier ist das Überholen des Lkw verboten, weil die Mittellinie durchgezogen ist.', it: 'Qui è vietato sorpassare il camion perché la striscia centrale è continua.' }, true],
      [{ de: 'Man darf überholen, wenn man vor dem roten Auto wieder einschert.', it: 'Si può sorpassare se si rientra prima di incrociare il veicolo rosso.' }, false]]
  },
  {
    scene: 'ueberholen-kurve', chapter: 'manovre',
    alt: { de: 'Rechtskurve, die Bäume verdecken die Sicht. Vor dem blauen Auto fährt ein Traktor, hinter der Kurve kommt ein rotes Auto entgegen.', it: 'Curva a destra, gli alberi coprono la vista. Davanti al veicolo blu c’è un trattore, dopo la curva arriva un veicolo rosso.' },
    expl: { de: 'Vor Kurven ohne Sicht darf man nicht überholen. Den Gegenverkehr sieht man erst, wenn es zu spät ist.', it: 'Prima di una curva senza visibilità non si sorpassa: il veicolo che arriva lo vedi quando è troppo tardi.' },
    trap: { de: 'Die Mittellinie ist unterbrochen – das erlaubt das Überholen aber nur, wenn man weit genug sieht.', it: 'La striscia è discontinua, ma il sorpasso è permesso solo se si vede abbastanza lontano.' },
    de: { text: { de: 'Der Traktor fährt langsam. Was tun Sie?', it: 'Il trattore va piano. Cosa fai?' }, weight: 5, opts: [
      [{ de: 'Hinter dem Traktor bleiben, bis ich die Strecke weit genug überblicke', it: 'Resto dietro al trattore finché vedo la strada abbastanza lontano' }, true],
      [{ de: 'Schnell vor der Kurve überholen', it: 'Sorpasso in fretta prima della curva' }, false],
      [{ de: 'Hupen, damit der Traktor rechts ranfährt', it: 'Suono il clacson perché il trattore si sposti' }, false]] },
    it: [[{ de: 'Vor dieser Kurve darf man den Traktor nicht überholen, weil man nicht sieht, ob jemand entgegenkommt.', it: 'Prima di questa curva non si può sorpassare il trattore perché non si vede se arriva qualcuno.' }, true],
      [{ de: 'Da die Linie unterbrochen ist, darf man hier immer überholen.', it: 'Dato che la striscia è discontinua, qui si può sempre sorpassare.' }, false]]
  },
  {
    scene: 'abstand', chapter: 'velocita',
    alt: { de: 'Zwei Autos hintereinander bei 100 km/h, Abstand 20 Meter.', it: 'Due veicoli in fila a 100 km/h, distanza 20 metri.' },
    expl: { de: 'Außerorts gilt als Faustregel: Abstand in Metern = halber Tacho. Bei 100 km/h also mindestens 50 m – bei Nässe mehr.', it: 'La distanza di sicurezza deve permettere di fermarsi se chi precede frena. Cresce con la velocità e con la strada bagnata: a 100 km/h 20 m sono troppo pochi.' },
    de: { text: { de: 'Sie fahren außerorts 100 km/h. Welcher Abstand ist mindestens nötig?', it: 'Fuori città vai a 100 km/h. Quale distanza serve come minimo?' }, weight: 4, opts: [
      [{ de: 'Etwa 50 m (halber Tacho)', it: 'Circa 50 m (metà del tachimetro)' }, true],
      [{ de: 'Etwa 20 m, wie im Bild', it: 'Circa 20 m, come nell’immagine' }, false],
      [{ de: '10 m reichen, wenn die Sicht gut ist', it: 'Bastano 10 m se la visibilità è buona' }, false]] },
    it: [[{ de: 'Bei 100 km/h reichen 20 m Abstand zum vorderen Fahrzeug.', it: 'A 100 km/h una distanza di 20 metri dal veicolo che precede è sufficiente.' }, false],
      [{ de: 'Der Sicherheitsabstand muss mit der Geschwindigkeit und bei nasser Straße größer werden.', it: 'La distanza di sicurezza deve aumentare con la velocità e con la strada bagnata.' }, true]]
  },
  {
    scene: 'bahnuebergang', chapter: 'precedenza',
    alt: { de: 'Bahnübergang: Die Schranke senkt sich, das rote Licht blinkt, daneben das Andreaskreuz. Das blaue Auto nähert sich.', it: 'Passaggio a livello: la barriera si abbassa, la luce rossa lampeggia, accanto la croce di Sant’Andrea. Il veicolo blu si avvicina.' },
    expl: { de: 'Schienenfahrzeuge haben Vorrang. Bei blinkendem Rotlicht oder sich senkender Schranke vor dem Andreaskreuz warten.', it: 'I treni hanno sempre la precedenza. Con luce rossa lampeggiante o barriere in movimento ci si ferma prima del passaggio a livello.' },
    trap: { de: 'Eine halb geschlossene Schranke ist keine Einladung, noch durchzufahren.', it: 'Una barriera mezza abbassata non è un invito a passare in fretta.' },
    de: { text: { de: 'Was tun Sie jetzt?', it: 'Cosa fai adesso?' }, weight: 5, opts: [
      [{ de: 'Vor dem Andreaskreuz anhalten und warten', it: 'Mi fermo prima della croce di Sant’Andrea e aspetto' }, true],
      [{ de: 'Schnell noch durchfahren, die Schranke ist noch offen', it: 'Passo in fretta, la barriera è ancora aperta' }, false],
      [{ de: 'Auf den Gleisen anhalten und warten', it: 'Mi fermo sui binari e aspetto' }, false]] },
    it: [[{ de: 'Bei sich bewegender Schranke und blinkendem Rotlicht muss man vor dem Bahnübergang anhalten.', it: 'Con barriere in movimento e luce rossa lampeggiante bisogna fermarsi prima del passaggio a livello.' }, true],
      [{ de: 'Solange die Schranke nicht ganz zu ist, darf man schnell durchfahren.', it: 'Finché le barriere non sono del tutto chiuse si può passare in fretta.' }, false]]
  },
  {
    scene: 'bus-haltestelle', chapter: 'vulnerabili',
    alt: { de: 'Ein Linienbus hält mit Warnblinklicht an der Haltestelle. Vor dem Bus läuft ein Kind auf die Straße. Das blaue Auto kommt von hinten.', it: 'Un autobus è fermo alla fermata con le quattro frecce. Davanti al bus un bambino attraversa. Il veicolo blu arriva da dietro.' },
    expl: { de: 'An Bussen, die mit Warnblinklicht an der Haltestelle stehen, darf man nur mit Schrittgeschwindigkeit vorbeifahren – Fahrgäste dürfen nicht gefährdet werden.', it: 'Vicino a un autobus fermo bisogna rallentare molto: chi scende o attraversa davanti al bus può comparire all’improvviso.' },
    trap: { de: 'Kinder vor dem Bus sieht man von hinten nicht.', it: 'Da dietro non vedi i bambini davanti all’autobus.' },
    de: { text: { de: 'Wie dürfen Sie an dem Bus vorbeifahren?', it: 'Come puoi passare accanto all’autobus?' }, weight: 5, opts: [
      [{ de: 'Nur mit Schrittgeschwindigkeit', it: 'Solo a passo d’uomo' }, true],
      [{ de: 'Mit so viel Abstand, dass Fahrgäste nicht gefährdet werden', it: 'Con una distanza tale da non mettere in pericolo i passeggeri' }, true],
      [{ de: 'Normal weiter, wenn gerade niemand zu sehen ist', it: 'Normalmente, se in quel momento non si vede nessuno' }, false]] },
    it: [[{ de: 'Bei einem haltenden Bus muss man auf Fußgänger achten, die vor dem Bus über die Straße gehen.', it: 'Con un autobus fermo bisogna fare attenzione ai pedoni che attraversano davanti al bus.' }, true],
      [{ de: 'Man darf ohne zu bremsen vorbei, wenn die Gegenspur frei ist.', it: 'Si può superare l’autobus fermo senza rallentare se la corsia opposta è libera.' }, false]]
  },
  {
    scene: 'gruenpfeil', chapter: 'precedenza',
    alt: { de: 'Kreuzung, rote Ampel mit grünem Pfeilschild nach rechts. Ein Fußgänger überquert die Straße, in die das blaue Auto abbiegen will.', it: 'Incrocio, semaforo rosso con cartello a freccia verde verso destra. Un pedone attraversa la strada in cui il veicolo blu vuole svoltare.' },
    expl: { de: 'Der Grünpfeil erlaubt das Rechtsabbiegen bei Rot nur nach dem Anhalten an der Haltlinie und ohne Fußgänger oder Radfahrer zu behindern.', it: 'In Germania la freccia verde permette di svoltare a destra col rosso solo dopo essersi fermati alla linea e senza ostacolare pedoni e ciclisti.' },
    trap: { de: 'Das Schild ist kein grünes Licht: Anhalten ist Pflicht.', it: 'Il cartello non è una luce verde: fermarsi è obbligatorio.' },
    de: { text: { de: 'Die Ampel zeigt Rot, daneben der Grünpfeil. Sie wollen rechts abbiegen. Was ist richtig?', it: 'Il semaforo è rosso, accanto la freccia verde. Vuoi svoltare a destra. Cosa è giusto?' }, weight: 5, opts: [
      [{ de: 'Zuerst an der Haltlinie anhalten', it: 'Prima fermarsi alla linea di arresto' }, true],
      [{ de: 'Den Fußgänger zuerst gehen lassen', it: 'Lasciare passare prima il pedone' }, true],
      [{ de: 'Ohne Halt abbiegen, der Pfeil ist ja grün', it: 'Svoltare senza fermarsi, la freccia è verde' }, false]] }
  },
  {
    scene: 'einfaedeln', chapter: 'manovre',
    alt: { de: 'Zweispurige Straße, die linke Spur endet an einer Absperrung. Auf beiden Spuren stehen Autos.', it: 'Strada a due corsie, quella di sinistra termina con una barriera. Su entrambe le corsie ci sono veicoli.' },
    expl: { de: 'Endet ein Fahrstreifen, wechselt man erst unmittelbar vor der Engstelle – abwechselnd, nach dem Reißverschlussverfahren.', it: 'In Germania, quando una corsia finisce, si cambia corsia solo subito prima del restringimento, alternandosi (sistema a cerniera).' },
    trap: { de: 'Frühes Wechseln wirkt höflich, macht den Stau aber länger.', it: 'Cambiare corsia presto sembra gentile, ma allunga la coda.' },
    de: { text: { de: 'Die linke Spur endet. Wann und wie wechseln die Fahrzeuge?', it: 'La corsia di sinistra finisce. Quando e come si cambia corsia?' }, weight: 4, opts: [
      [{ de: 'Unmittelbar vor der Engstelle, abwechselnd', it: 'Subito prima del restringimento, alternandosi' }, true],
      [{ de: 'So früh wie möglich', it: 'Il prima possibile' }, false],
      [{ de: 'Links wartet, bis rechts niemand mehr kommt', it: 'Chi è a sinistra aspetta finché a destra non arriva più nessuno' }, false]] }
  },
  {
    scene: 'autobahn-auffahrt', chapter: 'autostrada',
    alt: { de: 'Autobahnauffahrt: Das blaue Auto fährt auf dem Beschleunigungsstreifen, auf der rechten Spur der Autobahn fährt ein rotes Auto.', it: 'Ingresso in autostrada: il veicolo blu è sulla corsia di accelerazione, sulla corsia di destra dell’autostrada c’è un veicolo rosso.' },
    expl: { de: 'Der Verkehr auf der Autobahn hat Vorfahrt. Auf dem Beschleunigungsstreifen auf Tempo kommen und in eine Lücke einfädeln.', it: 'Chi percorre l’autostrada ha la precedenza. Sulla corsia di accelerazione si prende velocità e ci si inserisce in un varco.' },
    trap: { de: 'Am Anfang des Beschleunigungsstreifens anhalten ist gefährlich: Ohne Tempo findet man keine Lücke.', it: 'Fermarsi all’inizio della corsia di accelerazione è pericoloso: senza velocità non trovi un varco.' },
    de: { text: { de: 'Sie fahren auf die Autobahn auf. Was ist richtig?', it: 'Entri in autostrada. Cosa è giusto?' }, weight: 4, opts: [
      [{ de: 'Das rote Auto hat Vorfahrt', it: 'Il veicolo rosso ha la precedenza' }, true],
      [{ de: 'Den Beschleunigungsstreifen nutzen, um auf Tempo zu kommen', it: 'Usare la corsia di accelerazione per prendere velocità' }, true],
      [{ de: 'Am Anfang des Streifens anhalten und auf eine Lücke warten', it: 'Fermarsi all’inizio della corsia e aspettare un varco' }, false]] },
    it: [[{ de: 'Wer vom Beschleunigungsstreifen auffährt, muss dem Verkehr auf der Autobahn Vorfahrt lassen.', it: 'Chi si immette dalla corsia di accelerazione deve dare la precedenza ai veicoli in autostrada.' }, true],
      [{ de: 'Auf dem Beschleunigungsstreifen hält man am besten am Anfang an.', it: 'Sulla corsia di accelerazione è meglio fermarsi all’inizio e aspettare.' }, false]]
  },
  {
    scene: 'parken-kreuzung', chapter: 'sosta',
    alt: { de: 'Kreuzung: Das blaue Auto parkt direkt an der Ecke, weniger als 5 m vor der Kreuzung. Von links kommt ein rotes Auto.', it: 'Incrocio: il veicolo blu è parcheggiato sull’angolo, a meno di 5 m dall’incrocio. Da sinistra arriva un veicolo rosso.' },
    expl: { de: 'Vor und hinter Kreuzungen ist das Parken bis 5 m von den Schnittpunkten der Fahrbahnkanten verboten. So bleibt die Sicht frei.', it: 'In corrispondenza e in prossimità delle intersezioni la sosta è vietata, perché toglie visibilità a chi arriva.' },
    de: { text: { de: 'Darf das blaue Auto hier parken?', it: 'Il veicolo blu può parcheggiare qui?' }, weight: 3, opts: [
      [{ de: 'Nein, bis 5 m vor einer Kreuzung ist Parken verboten', it: 'No, fino a 5 m prima di un incrocio è vietato parcheggiare' }, true],
      [{ de: 'Ja, wenn das Warnblinklicht an ist', it: 'Sì, se ha le quattro frecce accese' }, false],
      [{ de: 'Ja, wenn kein Parkverbotsschild steht', it: 'Sì, se non c’è un cartello di divieto' }, false]] },
    it: [[{ de: 'Direkt an einer Kreuzung zu parken ist verboten, weil es die Sicht nimmt.', it: 'È vietato sostare sull’incrocio o subito prima, perché si toglie visibilità.' }, true],
      [{ de: 'An der Ecke der Kreuzung darf man parken, wenn man das Warnblinklicht einschaltet.', it: 'Si può sostare sull’angolo dell’incrocio se si accendono le quattro frecce.' }, false]]
  },
  {
    scene: 'tuer-rad', chapter: 'vulnerabili',
    alt: { de: 'Das blaue Auto parkt am rechten Rand, die Fahrertür soll geöffnet werden. Von hinten kommt ein Radfahrer.', it: 'Il veicolo blu è parcheggiato sul bordo destro, si vuole aprire la portiera. Da dietro arriva un ciclista.' },
    expl: { de: 'Wer aussteigt, darf niemanden gefährden: in den Spiegel schauen, über die Schulter blicken und die Tür erst öffnen, wenn niemand kommt.', it: 'Chi scende non deve mettere in pericolo nessuno: guarda nello specchietto, voltati e apri solo quando non arriva nessuno.' },
    trap: { de: 'Wer die Tür öffnet, hat keinen Vorrang – auch nicht „nur kurz“.', it: 'Chi apre la portiera non ha la precedenza, nemmeno “solo un attimo”.' },
    de: { text: { de: 'Sie wollen aus dem blauen Auto aussteigen. Was tun Sie?', it: 'Vuoi scendere dal veicolo blu. Cosa fai?' }, weight: 4, opts: [
      [{ de: 'In den Spiegel schauen und über die Schulter blicken', it: 'Guardo nello specchietto e mi volto' }, true],
      [{ de: 'Den Radfahrer vorbeilassen und dann die Tür öffnen', it: 'Lascio passare il ciclista e poi apro la portiera' }, true],
      [{ de: 'Die Tür zügig öffnen – der Radfahrer muss ausweichen', it: 'Apro in fretta, il ciclista si sposterà' }, false]] },
    it: [[{ de: 'Bevor man die Tür öffnet, muss man sicher sein, dass von hinten niemand kommt.', it: 'Prima di aprire la portiera bisogna assicurarsi che non arrivino veicoli o ciclisti da dietro.' }, true],
      [{ de: 'Wer die Tür öffnet, hat Vorrang vor dem Radfahrer.', it: 'Chi apre la portiera ha la precedenza sul ciclista.' }, false]]
  },
  {
    scene: 'hindernis', chapter: 'precedenza',
    alt: { de: 'Auf der Spur des blauen Autos steht eine Baustelle. Von vorn kommt ein rotes Auto.', it: 'Sulla corsia del veicolo blu c’è un cantiere. Di fronte arriva un veicolo rosso.' },
    expl: { de: 'Wer an einem Hindernis auf der eigenen Seite vorbeifahren will, muss den Gegenverkehr durchlassen.', it: 'Chi ha l’ostacolo sulla propria corsia deve lasciar passare i veicoli che arrivano di fronte.' },
    trap: { de: 'Blinken oder schon nach links ziehen gibt keinen Vorrang.', it: 'Mettere la freccia o spostarsi già a sinistra non dà la precedenza.' },
    de: { text: { de: 'Wer muss warten?', it: 'Chi deve aspettare?' }, weight: 4, opts: [
      [{ de: 'Ich mit dem blauen Auto', it: 'Io con il veicolo blu' }, true],
      [{ de: 'Das rote Auto', it: 'Il veicolo rosso' }, false],
      [{ de: 'Wer zuerst blinkt, darf zuerst fahren', it: 'Chi mette la freccia per primo passa per primo' }, false]] },
    it: [[{ de: 'Blau hat das Hindernis auf seiner Spur und muss Rot vorbeilassen.', it: 'Il veicolo blu ha l’ostacolo sulla sua corsia e deve lasciar passare il rosso.' }, true],
      [{ de: 'Blau darf zuerst fahren, wenn es den linken Blinker setzt.', it: 'Il veicolo blu può passare per primo se mette la freccia a sinistra.' }, false]]
  },
  {
    scene: 'kreisverkehr-zeichen', chapter: 'precedenza',
    alt: { de: 'Kreisverkehr. Am Eingang stehen „Vorfahrt gewähren“ und „Kreisverkehr“. Ein rotes Auto fährt im Kreis, das blaue will einfahren.', it: 'Rotatoria. All’ingresso ci sono “dare precedenza” e “rotatoria”. Un veicolo rosso circola nell’anello, il blu vuole entrare.' },
    expl: { de: 'Mit diesen Zeichen hat der Verkehr im Kreis Vorfahrt. Beim Einfahren nicht blinken, beim Ausfahren rechts blinken.', it: 'Con questi segnali chi circola nella rotatoria ha la precedenza. Per uscire si mette la freccia a destra.' },
    trap: { de: 'Rot kommt von links – trotzdem gilt hier nicht rechts vor links, sondern das Zeichen.', it: 'Il rosso arriva da sinistra, ma qui non vale la precedenza a destra: vale il segnale.' },
    de: { text: { de: 'Wer hat in diesem Kreisverkehr Vorfahrt?', it: 'Chi ha la precedenza in questa rotatoria?' }, weight: 5, opts: [
      [{ de: 'Das rote Auto im Kreis', it: 'Il veicolo rosso nella rotatoria' }, true],
      [{ de: 'Ich, weil Rot von links kommt', it: 'Io, perché il rosso arriva da sinistra' }, false],
      [{ de: 'Wer schneller ist', it: 'Chi è più veloce' }, false]] },
    it: [[{ de: 'Mit „Vorfahrt gewähren“ am Eingang hat Vorfahrt, wer schon im Kreis fährt.', it: 'Con il segnale “dare precedenza” all’ingresso, chi è già nella rotatoria ha la precedenza.' }, true],
      [{ de: 'Beim Einfahren muss man nur Fahrzeugen von rechts Vorfahrt lassen.', it: 'Entrando nella rotatoria si deve dare la precedenza solo a chi arriva da destra.' }, false, { de: 'Das Zeichen am Eingang geht der Regel „rechts vor links“ vor.', it: 'Il segnale all’ingresso prevale sulla regola della precedenza a destra.' }]]
  },
  {
    scene: 'einsatzfahrzeug', chapter: 'precedenza',
    alt: { de: 'Kreuzung, die Ampel des blauen Autos zeigt Grün. Von rechts kommt ein Rettungswagen mit Blaulicht und Martinshorn.', it: 'Incrocio, il semaforo del veicolo blu è verde. Da destra arriva un’ambulanza con lampeggiante blu e sirena.' },
    expl: { de: 'Blaulicht mit Martinshorn heißt: sofort freie Bahn schaffen. Das gilt auch bei Grün.', it: 'Lampeggiante blu e sirena accesi: bisogna lasciare subito libero il passaggio, anche con il verde.' },
    trap: { de: 'Grün gibt dir kein Recht gegen ein Einsatzfahrzeug mit Blaulicht und Horn.', it: 'Il verde non ti dà la precedenza su un mezzo di soccorso con lampeggiante e sirena.' },
    de: { text: { de: 'Ihre Ampel zeigt Grün. Wie verhalten Sie sich?', it: 'Il tuo semaforo è verde. Come ti comporti?' }, weight: 5, opts: [
      [{ de: 'Anhalten und den Rettungswagen durchlassen', it: 'Mi fermo e lascio passare l’ambulanza' }, true],
      [{ de: 'Weiterfahren, weil ich Grün habe', it: 'Proseguo perché ho il verde' }, false],
      [{ de: 'Schnell über die Kreuzung, bevor der Rettungswagen da ist', it: 'Attraverso in fretta prima che arrivi l’ambulanza' }, false]] },
    it: [[{ de: 'Ein Rettungswagen mit Blaulicht und Sirene hat Vorrang: Man muss ihn durchlassen.', it: 'Un’ambulanza con lampeggiante blu e sirena accesi ha la precedenza: bisogna lasciarla passare.' }, true],
      [{ de: 'Bei Grün darf man weiterfahren, auch wenn ein Rettungswagen mit Sirene kommt.', it: 'Con il verde si può proseguire anche se arriva un’ambulanza con la sirena.' }, false]]
  }
];

const image = (s: SceneSpec) => ({ type: 'diagram' as const, id: s.scene, alt: s.alt });

export const SCENE_DE: Question[] = SPECS.filter((s) => s.de).map((s, i): Question => {
  const d = s.de!;
  return {
    id: `de-s${i + 1}`, country: 'DE', chapter: s.chapter, format: 'multi', weight: d.weight, text: d.text,
    options: d.opts.map(([t], k) => ({ id: L[k]!, text: t })),
    correct: d.opts.map(([, ok], k) => (ok ? L[k]! : '')).filter(Boolean),
    explanation: s.expl, trap: s.trap, image: image(s), source: DEMO_SOURCE, version: 1, status: 'demo'
  };
});

export const SCENE_IT: Question[] = SPECS.filter((s) => s.it).flatMap((s, i) => s.it!.map(([text, ok, trap], k): Question => ({
  id: `it-s${i + 1}-${k + 1}`, country: 'IT', chapter: s.chapter, format: 'vf', text,
  options: VF, correct: [ok ? 'v' : 'f'], explanation: s.expl, trap: trap ?? (ok ? undefined : s.trap), image: image(s),
  source: DEMO_SOURCE, version: 1, status: 'demo'
})));

/** Lektion „Situationen im Bild“ je Land mit einigen Beispielen. */
const HEADINGS: Record<string, I18n> = {
  'ueberholen-linie': { de: 'Überholen und durchgezogene Linie', it: 'Sorpasso e striscia continua' },
  'ueberholen-kurve': { de: 'Überholen vor einer Kurve', it: 'Sorpasso prima di una curva' },
  abstand: { de: 'Sicherheitsabstand', it: 'Distanza di sicurezza' },
  'bus-haltestelle': { de: 'Bus an der Haltestelle', it: 'Autobus alla fermata' },
  gruenpfeil: { de: 'Grünpfeil an der Ampel', it: 'Freccia verde al semaforo (Germania)' },
  einfaedeln: { de: 'Reißverschluss', it: 'Immissione a cerniera' },
  bahnuebergang: { de: 'Bahnübergang', it: 'Passaggio a livello' },
  hindernis: { de: 'Hindernis auf der eigenen Seite', it: 'Ostacolo sulla propria corsia' },
  'kreisverkehr-zeichen': { de: 'Kreisverkehr mit Zeichen', it: 'Rotatoria con segnali' },
  einsatzfahrzeug: { de: 'Einsatzfahrzeug mit Blaulicht', it: 'Mezzo di soccorso con sirena' }
};
const example = (id: string) => {
  const s = SPECS.find((x) => x.scene === id)!;
  return { heading: HEADINGS[id]!, body: s.expl, image: image(s) };
};
export const SCENE_LESSONS: Lesson[] = [
  {
    id: 'de-l-situationen', country: 'DE', chapter: 'manovre',
    title: { de: 'Situationen im Bild', it: 'Situazioni su strada' },
    intro: { de: 'Typische Lagen aus der Prüfung: erst das Bild genau ansehen, dann entscheiden.', it: 'Situazioni tipiche dell’esame: prima guarda bene l’immagine, poi decidi.' },
    sections: ['ueberholen-linie', 'abstand', 'bus-haltestelle', 'gruenpfeil', 'einfaedeln'].map(example),
    source: DEMO_SOURCE, version: 1, status: 'demo'
  },
  {
    id: 'it-l-situazioni', country: 'IT', chapter: 'manovre',
    title: { de: 'Situationen im Bild', it: 'Situazioni su strada' },
    intro: { de: 'Typische Lagen aus der Prüfung: erst das Bild genau ansehen, dann entscheiden.', it: 'Situazioni tipiche dell’esame: prima guarda bene l’immagine, poi decidi.' },
    sections: ['ueberholen-kurve', 'bahnuebergang', 'hindernis', 'kreisverkehr-zeichen', 'einsatzfahrzeug'].map(example),
    source: DEMO_SOURCE, version: 1, status: 'demo'
  }
];
