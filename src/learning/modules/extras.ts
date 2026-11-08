import type { ChoiceTask, Difficulty, InputTask, LearningModule, Rng, Task } from '../types';
import { randInt, shuffle } from '../../lib/random';
import { b, bankModule, type BankItem } from '../bank';
import { L, tx } from '../../i18n';

/* Zusatzfächer: Religion/Ethik (neutral, mehrere Religionen) und Informatik – für alle Schulstufen. */

const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;
const times = <T>(n: number, fn: (i: number) => T): T[] => Array.from({ length: n }, (_, i) => fn(i));

/* ---------- Religion und Ethik ---------- */
const REL_KLEIN: BankItem[] = [
  b('Wie heißt das Fest, an dem Christen die Geburt von Jesus feiern? | Weihnachten | Ostern ; Pfingsten ; Ramadan', 'Come si chiama la festa in cui i cristiani celebrano la nascita di Gesù? | Natale | Pasqua ; Pentecoste ; Ramadan', '🎄'),
  b('Was feiern Christen an Ostern? | die Auferstehung von Jesus | die Geburt von Jesus ; das neue Jahr ; die Ernte', 'Che cosa celebrano i cristiani a Pasqua? | la risurrezione di Gesù | la nascita di Gesù ; il nuovo anno ; il raccolto', '🐣'),
  b('Wie heißt das Lichterfest im Judentum? | Chanukka | Diwali ; Weihnachten ; Ramadan', 'Come si chiama la festa delle luci nell’ebraismo? | Hanukkà | Diwali ; Natale ; Ramadan', '🕎'),
  b('In welchem Monat fasten viele Muslime tagsüber? | im Ramadan | im Advent ; an Pessach ; an Diwali', 'In quale mese molti musulmani digiunano di giorno? | Ramadan | Avvento ; Pesach ; Diwali', '🌙'),
  b('Wie heißt das hinduistische Lichterfest? | Diwali | Chanukka ; Ostern ; Eid', 'Come si chiama la festa hindu delle luci? | Diwali | Hanukkà ; Pasqua ; Eid', '🪔'),
  b('Was bedeutet „teilen“? | anderen etwas von dem geben, was man hat | alles für sich behalten ; etwas kaputt machen ; jemanden auslachen', 'Che cosa significa «condividere»? | dare agli altri una parte di ciò che si ha | tenere tutto per sé ; rompere qualcosa ; prendere in giro', '🤝'),
  b('Ein Kind ist traurig, weil niemand mit ihm spielt. Was ist freundlich? | es einladen mitzuspielen | es auslachen ; weggehen ; es wegschicken', 'Un bambino è triste perché nessuno gioca con lui. Che cosa è gentile? | invitarlo a giocare | ridere di lui ; andare via ; mandarlo via', '🧸'),
  b('Was ist die „Goldene Regel“? | Behandle andere so, wie du behandelt werden möchtest. | Der Stärkere hat immer recht. ; Gold ist das Wichtigste. ; Gewinnen ist alles. | Sie kommt in vielen Religionen vor.', 'Che cos’è la «regola d’oro»? | Tratta gli altri come vorresti essere trattato. | Il più forte ha sempre ragione. ; L’oro è la cosa più importante. ; Vincere è tutto. | Si trova in molte religioni.', '✨'),
  b('Wie heißt das Gotteshaus der Christen? | Kirche | Moschee ; Synagoge ; Tempel', 'Come si chiama il luogo di culto dei cristiani? | chiesa | moschea ; sinagoga ; tempio', '⛪'),
  b('Wie heißt das Gotteshaus der Muslime? | Moschee | Kirche ; Synagoge ; Pagode', 'Come si chiama il luogo di culto dei musulmani? | moschea | chiesa ; sinagoga ; pagoda', '🕌'),
  b('Wie heißt das Gotteshaus der Juden? | Synagoge | Moschee ; Kirche ; Stupa', 'Come si chiama il luogo di culto degli ebrei? | sinagoga | moschea ; chiesa ; stupa', '🕍'),
  b('Was hilft, wenn man sich gestritten hat? | in Ruhe reden und sich entschuldigen | schreien ; schubsen ; nie wieder sprechen', 'Che cosa aiuta dopo un litigio? | parlare con calma e chiedere scusa | urlare ; spingere ; non parlarsi più', '🕊️')
];

const REL_MITTEL: BankItem[] = [
  b('Welche drei Religionen nennt man „abrahamitisch“? | Judentum, Christentum, Islam | Hinduismus, Buddhismus, Islam ; Christentum, Buddhismus, Shintoismus ; Judentum, Hinduismus, Taoismus | Alle berufen sich auf Abraham.', 'Quali tre religioni si chiamano «abramitiche»? | ebraismo, cristianesimo, islam | induismo, buddhismo, islam ; cristianesimo, buddhismo, shintoismo ; ebraismo, induismo, taoismo | Tutte si richiamano ad Abramo.', '📜'),
  b('Wie heißt die heilige Schrift des Islam? | Koran | Tora ; Veden ; Tripitaka', 'Come si chiama il libro sacro dell’islam? | Corano | Torah ; Veda ; Tipitaka', '📖'),
  b('Wie heißen die fünf Bücher Mose im Judentum? | Tora | Talmud ; Koran ; Evangelien', 'Come si chiamano i cinque libri di Mosè nell’ebraismo? | Torah | Talmud ; Corano ; Vangeli', '📜'),
  b('Wer gilt als Begründer des Buddhismus? | Siddhartha Gautama (Buddha) | Konfuzius ; Mohammed ; Mose', 'Chi è considerato il fondatore del buddhismo? | Siddhartha Gautama (il Buddha) | Confucio ; Maometto ; Mosè', '☸️'),
  b('Wie viele Evangelien enthält das Neue Testament? | vier | zwei ; zehn ; zwölf | Matthäus, Markus, Lukas, Johannes.', 'Quanti Vangeli contiene il Nuovo Testamento? | quattro | due ; dieci ; dodici | Matteo, Marco, Luca, Giovanni.', '✝️'),
  b('Was sind die „fünf Säulen“ des Islam? | Glaubensbekenntnis, Gebet, Almosen, Fasten, Pilgerfahrt | fünf Moscheen ; fünf Propheten ; fünf heilige Städte', 'Che cosa sono i «cinque pilastri» dell’islam? | professione di fede, preghiera, elemosina, digiuno, pellegrinaggio | cinque moschee ; cinque profeti ; cinque città sante', '🕋', 2),
  b('Was ist ein Gewissen? | die innere Stimme, die zwischen gut und böse unterscheidet | ein Körperteil ; ein Gesetz ; eine Religion', 'Che cos’è la coscienza? | la voce interiore che distingue il bene dal male | una parte del corpo ; una legge ; una religione', '💭'),
  b('Was bedeutet Toleranz? | andere Meinungen und Lebensweisen respektieren | allen zustimmen müssen ; keine Meinung haben ; andere ignorieren', 'Che cosa significa tolleranza? | rispettare opinioni e modi di vivere diversi | essere sempre d’accordo ; non avere opinioni ; ignorare gli altri', '🤲'),
  b('Was ist das Ziel im Buddhismus? | das Nirwana – das Ende des Leidens | Reichtum ; ewiger Wettkampf ; Macht über andere', 'Qual è la meta nel buddhismo? | il nirvana – la fine della sofferenza | la ricchezza ; la competizione ; il potere sugli altri', '🧘', 2),
  b('Was steht in Artikel 1 der Allgemeinen Erklärung der Menschenrechte? | Alle Menschen sind frei und gleich an Würde und Rechten geboren. | Nur Erwachsene haben Rechte. ; Jeder muss reich sein. ; Der Staat hat immer recht.', 'Che cosa dice l’articolo 1 della Dichiarazione universale dei diritti umani? | Tutti gli esseri umani nascono liberi ed eguali in dignità e diritti. | Solo gli adulti hanno diritti. ; Tutti devono essere ricchi. ; Lo Stato ha sempre ragione.', '🌍', 2),
  b('Wie heißt das Oberhaupt der katholischen Kirche? | der Papst | der Patriarch ; der Imam ; der Rabbiner', 'Come si chiama il capo della Chiesa cattolica? | il papa | il patriarca ; l’imam ; il rabbino', '⛪'),
  b('Was ist Zivilcourage? | mutig für andere eintreten, wenn Unrecht geschieht | wegschauen ; nur an sich denken ; immer still sein', 'Che cos’è il coraggio civile? | difendere gli altri quando subiscono un’ingiustizia | girarsi dall’altra parte ; pensare solo a sé ; stare sempre zitti', '🦸', 2)
];

const REL_OBER: BankItem[] = [
  b('Was besagt Kants kategorischer Imperativ (vereinfacht)? | Handle so, dass deine Regel ein allgemeines Gesetz sein könnte. | Tu, was dir nützt. ; Der Zweck heiligt die Mittel. ; Folge immer der Mehrheit.', 'Che cosa dice l’imperativo categorico di Kant (semplificato)? | Agisci in modo che la tua regola possa valere come legge universale. | Fai ciò che ti conviene. ; Il fine giustifica i mezzi. ; Segui sempre la maggioranza.', '⚖️', 2),
  b('Was ist der Utilitarismus? | eine Ethik, die das größte Glück der größten Zahl anstrebt | die Lehre von Gott ; eine Kunstrichtung ; eine Religion aus Asien | Bentham, Mill.', 'Che cos’è l’utilitarismo? | un’etica che cerca la massima felicità per il maggior numero | la dottrina su Dio ; una corrente artistica ; una religione asiatica | Bentham, Mill.', '📊', 2),
  b('Was bedeutet Säkularisierung? | der wachsende Abstand von Staat bzw. Gesellschaft und Religion | die Gründung neuer Kirchen ; die Pflicht zum Gottesdienst ; ein Fest im Herbst', 'Che cosa significa secolarizzazione? | il distacco crescente tra Stato, società e religione | la fondazione di nuove chiese ; l’obbligo di culto ; una festa d’autunno', '🏛️', 2),
  b('Was untersucht die Bioethik? | moralische Fragen zu Leben, Medizin und Forschung | nur Pflanzen ; Rechenregeln ; Sportregeln | z. B. Gentechnik, Sterbehilfe.', 'Che cosa studia la bioetica? | le questioni morali su vita, medicina e ricerca | solo le piante ; le regole di calcolo ; le regole sportive | Per esempio ingegneria genetica, fine vita.', '🧬', 3),
  b('Was bedeutet Ökumene? | die Zusammenarbeit der christlichen Kirchen | ein Weltreligionsfest ; eine Steuer ; eine Gebetszeit', 'Che cosa significa ecumenismo? | la collaborazione tra le Chiese cristiane | una festa mondiale ; una tassa ; un orario di preghiera', '🤝', 3),
  b('Wer schrieb die „Nikomachische Ethik“ (Tugend, Mitte)? | Aristoteles | Platon ; Sokrates ; Seneca', 'Chi scrisse l’«Etica Nicomachea» (virtù, giusto mezzo)? | Aristotele | Platone ; Socrate ; Seneca', '🏺', 2),
  b('Was ist das Theodizee-Problem? | die Frage, wie ein guter Gott das Leid in der Welt zulässt | die Frage nach dem Alter der Erde ; ein Rechenproblem ; ein Problem der Logik ohne Bezug zur Religion', 'Che cos’è il problema della teodicea? | la domanda su come un Dio buono permetta il male nel mondo | l’età della Terra ; un problema di calcolo ; un problema di logica senza religione', '❓', 3),
  b('Was garantiert Religionsfreiheit? | jeder darf eine Religion wählen, wechseln oder keine haben | jeder muss derselben Religion angehören ; Religion ist verboten ; nur Erwachsene dürfen glauben', 'Che cosa garantisce la libertà religiosa? | ognuno può scegliere, cambiare o non avere una religione | tutti devono avere la stessa religione ; la religione è vietata ; solo gli adulti possono credere', '🕊️')
];

/* ---------- Informatik ---------- */
const INFO_KLEIN: BankItem[] = [
  b('Womit schreibt man Buchstaben am Computer? | mit der Tastatur | mit dem Bildschirm ; mit dem Lautsprecher ; mit dem Kabel', 'Con che cosa si scrivono le lettere al computer? | con la tastiera | con lo schermo ; con l’altoparlante ; con il cavo', '⌨️'),
  b('Welches Gerät zeigt Bilder an? | der Bildschirm | die Maus ; die Tastatur ; der Drucker', 'Quale dispositivo mostra le immagini? | lo schermo | il mouse ; la tastiera ; la stampante', '🖥️'),
  b('Jemand Unbekanntes fragt online nach deiner Adresse. Was tust du? | nichts verraten und einem Erwachsenen Bescheid sagen | die Adresse schicken ; ein Foto schicken ; das Passwort verraten', 'Uno sconosciuto online ti chiede l’indirizzo. Che cosa fai? | non dico niente e avviso un adulto | mando l’indirizzo ; mando una foto ; dico la password', '🛡️'),
  b('Wem darfst du dein Passwort sagen? | nur deinen Eltern | allen Freunden ; jedem im Internet ; der Klasse', 'A chi puoi dire la tua password? | solo ai genitori | a tutti gli amici ; a chiunque su Internet ; alla classe', '🔐'),
  b('Was ist ein Algorithmus? | eine genaue Schritt-für-Schritt-Anleitung | ein Computerspiel ; ein Tier ; ein Kabel', 'Che cos’è un algoritmo? | una sequenza precisa di istruzioni | un videogioco ; un animale ; un cavo', '📋'),
  b('Welches Gerät druckt Papier aus? | der Drucker | der Scanner ; die Maus ; das Mikrofon', 'Quale dispositivo stampa su carta? | la stampante | lo scanner ; il mouse ; il microfono', '🖨️'),
  b('Du siehst online etwas, das dir Angst macht. Was tust du? | einem Erwachsenen davon erzählen | es weiterschicken ; es geheim halten ; noch mehr davon suchen', 'Online vedi qualcosa che ti fa paura. Che cosa fai? | ne parlo con un adulto | lo inoltro ; lo tengo segreto ; ne cerco altro', '🧑‍🏫'),
  b('Was ist das Internet? | ein weltweites Netz aus verbundenen Computern | ein großer Computer in einem Keller ; ein Fernsehsender ; ein Spiel', 'Che cos’è Internet? | una rete mondiale di computer collegati | un grande computer in cantina ; un canale TV ; un gioco', '🌐', 2)
];

const INFO_MITTEL: BankItem[] = [
  b('Was macht die CPU (Prozessor)? | sie führt Befehle aus und rechnet | sie speichert Daten dauerhaft ; sie zeigt Bilder ; sie kühlt den PC', 'Che cosa fa la CPU (processore)? | esegue le istruzioni e calcola | memorizza i dati in modo permanente ; mostra le immagini ; raffredda il PC', '🧠'),
  b('Was ist RAM? | der Arbeitsspeicher, der beim Ausschalten gelöscht wird | die Festplatte ; das Betriebssystem ; ein Virus', 'Che cos’è la RAM? | la memoria di lavoro che si cancella allo spegnimento | il disco fisso ; il sistema operativo ; un virus', '💾'),
  b('Wie viele Bit hat ein Byte? | 8 | 2 ; 10 ; 16', 'Quanti bit ha un byte? | 8 | 2 ; 10 ; 16', '🔢'),
  b('Welches Passwort ist am sichersten? | M7!kaLp#29qz | 123456 ; passwort ; deinname2012', 'Quale password è più sicura? | M7!kaLp#29qz | 123456 ; password ; tuonome2012', '🔐'),
  b('Was ist Phishing? | Betrug mit gefälschten Nachrichten, um Daten zu stehlen | ein Angelspiel ; ein Virenschutz ; eine Art Kabel', 'Che cos’è il phishing? | una truffa con messaggi falsi per rubare dati | un gioco di pesca ; un antivirus ; un tipo di cavo', '🎣'),
  b('Was ist ein Betriebssystem? | Software, die den Computer verwaltet (z. B. Windows, Linux) | ein Textprogramm ; ein Bildschirm ; eine Webseite', 'Che cos’è un sistema operativo? | il software che gestisce il computer (es. Windows, Linux) | un programma di scrittura ; uno schermo ; un sito web', '🪟'),
  b('Was bedeutet „https“ in einer Adresse? | die Verbindung ist verschlüsselt | die Seite ist kostenlos ; die Seite ist für Kinder ; die Seite ist neu', 'Che cosa significa «https» in un indirizzo? | la connessione è cifrata | il sito è gratis ; il sito è per bambini ; il sito è nuovo', '🔒', 2),
  b('Was ist Cybermobbing? | jemanden über Internet oder Handy fertigmachen | ein Computerspiel ; ein Virus ; ein Online-Kurs', 'Che cos’è il cyberbullismo? | offendere o umiliare qualcuno tramite Internet o telefono | un videogioco ; un virus ; un corso online', '🚫'),
  b('Was ist eine IP-Adresse? | eine Nummer, die ein Gerät im Netz identifiziert | ein Passwort ; eine E-Mail ; ein Ordner', 'Che cos’è un indirizzo IP? | un numero che identifica un dispositivo nella rete | una password ; un’e-mail ; una cartella', '📡', 2),
  b('Was macht DNS? | es übersetzt Namen wie example.org in IP-Adressen | es sendet E-Mails ; es löscht Viren ; es lädt den Akku', 'Che cosa fa il DNS? | traduce nomi come example.org in indirizzi IP | invia e-mail ; elimina virus ; carica la batteria', '📖', 3)
];

const INFO_OBER: BankItem[] = [
  b('Welche SQL-Anweisung liest Daten aus einer Tabelle? | SELECT | INSERT ; DELETE ; DROP', 'Quale istruzione SQL legge i dati da una tabella? | SELECT | INSERT ; DELETE ; DROP', '🗃️'),
  b('Was liefert diese Abfrage? § SELECT name FROM schueler WHERE alter > 15; | die Namen aller Schüler älter als 15 | alle Spalten ; alle Schüler unter 15 ; die Anzahl der Schüler', 'Che cosa restituisce questa query? § SELECT nome FROM studenti WHERE eta > 15; | i nomi degli studenti con più di 15 anni | tutte le colonne ; gli studenti sotto i 15 anni ; il numero degli studenti', undefined, 2),
  b('Was ist ein Primärschlüssel? | ein Feld, das jeden Datensatz eindeutig kennzeichnet | ein Passwort ; die erste Spalte immer ; ein Fremdschlüssel', 'Che cos’è una chiave primaria? | un campo che identifica univocamente ogni record | una password ; sempre la prima colonna ; una chiave esterna', '🔑', 2),
  b('Welche Laufzeit hat die binäre Suche in einer sortierten Liste? | O(log n) | O(n²) ; O(n) ; O(1)', 'Quale complessità ha la ricerca binaria in una lista ordinata? | O(log n) | O(n²) ; O(n) ; O(1)', '🔎', 2),
  b('Welche Laufzeit hat Bubblesort im schlechtesten Fall? | O(n²) | O(log n) ; O(n) ; O(1)', 'Quale complessità ha il bubble sort nel caso peggiore? | O(n²) | O(log n) ; O(n) ; O(1)', '🫧', 3),
  b('Was ist ein Stack (Stapel)? | eine Datenstruktur nach dem Prinzip LIFO | FIFO ; eine sortierte Liste ; ein Netzwerk', 'Che cos’è uno stack (pila)? | una struttura dati LIFO | FIFO ; una lista ordinata ; una rete', '📚', 2),
  b('Was ist eine Queue (Warteschlange)? | eine Datenstruktur nach dem Prinzip FIFO | LIFO ; ein Baum ; ein Graph ohne Kanten', 'Che cos’è una queue (coda)? | una struttura dati FIFO | LIFO ; un albero ; un grafo senza archi', '🚶', 2),
  b('Wofür steht das TCP/IP-Modell? | für die Regeln, nach denen Daten im Internet übertragen werden | für Grafikformate ; für Programmiersprachen ; für Speicherchips', 'A che cosa serve il modello TCP/IP? | alle regole con cui i dati viaggiano su Internet | ai formati grafici ; ai linguaggi di programmazione ; ai chip di memoria', '📶', 2),
  b('Was ist asymmetrische Verschlüsselung? | ein Verfahren mit öffentlichem und privatem Schlüssel | ein Verfahren ohne Schlüssel ; ein Verfahren mit nur einem geheimen Schlüssel ; Komprimierung', 'Che cos’è la crittografia asimmetrica? | un metodo con chiave pubblica e chiave privata | un metodo senza chiave ; un metodo con una sola chiave segreta ; la compressione', '🔏', 3),
  b('Was regelt die DSGVO (GDPR)? | den Schutz personenbezogener Daten in der EU | Urheberrecht für Musik ; Steuern im Internet ; Tempolimits', 'Che cosa regola il GDPR? | la protezione dei dati personali nell’UE | il diritto d’autore musicale ; le tasse online ; i limiti di velocità', '🇪🇺', 2),
  b('Was ist maschinelles Lernen? | Computer lernen Muster aus Daten statt aus fest programmierten Regeln | Computer lernen Vokabeln ; Roboter gehen zur Schule ; Software ohne Daten | Teilgebiet der KI.', 'Che cos’è il machine learning? | i computer imparano schemi dai dati invece che da regole fisse | i computer imparano il vocabolario ; i robot vanno a scuola ; software senza dati | Parte dell’IA.', '🤖', 3)
];

/* Generator: Binär- und Hexadezimalzahlen */
function genBinaer(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const max = level === 1 ? 15 : level === 2 ? 63 : 255;
    const v = randInt(rng, 2, max);
    const bin = v.toString(2);
    const mode = level === 3 ? i % 3 : i % 2;
    if (mode === 0) {
      return {
        id: tid('bin', i), type: 'input', answer: v,
        prompt: L(`Welche Dezimalzahl ist die Binärzahl ${bin}?`, `Quale numero decimale corrisponde al binario ${bin}?`),
        visual: { kind: 'table', head: bin.split('').map((_, k) => String(2 ** (bin.length - 1 - k))), rows: [bin.split('')] },
        hint: L('Addiere die Stellenwerte, unter denen eine 1 steht.', 'Somma i valori di posizione dove c’è un 1.'),
        explain: [bin.split('').map((d, k) => (d === '1' ? String(2 ** (bin.length - 1 - k)) : null)).filter(Boolean).join(' + ') + ` = ${v}`]
      } satisfies InputTask;
    }
    if (mode === 1) {
      const wrong = new Set<string>();
      while (wrong.size < 3) { const w = (v + randInt(rng, -4, 4)).toString(2); if (w !== bin && !w.startsWith('-') && w !== '0') wrong.add(w); }
      return {
        id: tid('bin', i), type: 'choice', prompt: L(`Wie schreibt man ${v} im Binärsystem?`, `Come si scrive ${v} in binario?`),
        options: shuffle(rng, [bin, ...wrong]).map((x) => ({ id: x, label: x })), correctId: bin, optionStyle: 'text',
        hint: L('Teile immer wieder durch 2 und notiere die Reste von unten nach oben.', 'Dividi ripetutamente per 2 e leggi i resti dal basso verso l’alto.'),
        explain: [`${v} = ${bin}₂`]
      } satisfies ChoiceTask;
    }
    const hex = v.toString(16).toUpperCase();
    return {
      id: tid('hex', i), type: 'input', answer: v,
      prompt: L(`Welche Dezimalzahl ist die Hexadezimalzahl ${hex}?`, `Quale numero decimale corrisponde all’esadecimale ${hex}?`),
      hint: L('A=10, B=11, C=12, D=13, E=14, F=15. Erste Stelle mal 16.', 'A=10, B=11, C=12, D=13, E=14, F=15. La prima cifra vale ×16.'),
      explain: [hex.length === 2 ? `${parseInt(hex[0]!, 16)} · 16 + ${parseInt(hex[1]!, 16)} = ${v}` : `${hex} = ${v}`]
    } satisfies InputTask;
  });
}

/* Generator: Logikgatter */
function genLogik(level: Difficulty, rng: Rng, n = 6): Task[] {
  const gates = level === 1 ? ['AND', 'OR', 'NOT'] : ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'];
  const ev = (g: string, a: number, b: number) => {
    switch (g) {
      case 'AND': return a & b; case 'OR': return a | b; case 'NOT': return a ? 0 : 1;
      case 'XOR': return a ^ b; case 'NAND': return (a & b) ? 0 : 1; default: return (a | b) ? 0 : 1;
    }
  };
  return times(n, (i): Task => {
    const g = gates[randInt(rng, 0, gates.length - 1)]!;
    const a = randInt(rng, 0, 1), b2 = randInt(rng, 0, 1);
    const res = ev(g, a, b2);
    const expr = g === 'NOT' ? `NOT ${a}` : `${a} ${g} ${b2}`;
    return {
      id: tid('logik', i), type: 'choice', prompt: L(`Was ergibt ${expr}?`, `Quanto vale ${expr}?`), visual: { kind: 'code', code: expr },
      options: [{ id: '0', label: '0' }, { id: '1', label: '1' }], correctId: String(res), optionStyle: 'text',
      hint: L('AND: beide 1. OR: mindestens eine 1. XOR: genau eine 1. NOT dreht um.', 'AND: entrambi 1. OR: almeno un 1. XOR: esattamente un 1. NOT inverte.'),
      explain: [`${expr} = ${res}`]
    };
  });
}

/* Generator: Caesar-Verschlüsselung */
function genCaesar(level: Difficulty, rng: Rng, n = 5): Task[] {
  const words = L('HAUS,BAUM,MOND,BROT,ROBOTER,SCHULE,CODE,DATEN', 'CASA,LUNA,PANE,SOLE,ROBOT,SCUOLA,CODICE,DATI').split(',');
  const enc = (w: string, k: number) => w.replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k + 26) % 26) + 65));
  return times(n, (i): Task => {
    const k = level === 1 ? 1 : level === 2 ? randInt(rng, 1, 3) : randInt(rng, 3, 7);
    const w = words[randInt(rng, 0, words.length - 1)]!;
    const decode = i % 2 === 1;
    const correct = decode ? w : enc(w, k);
    const shown = decode ? enc(w, k) : w;
    const wrong = (decode ? [enc(shown, -(k + 1)), enc(shown, k), enc(shown, -(k + 2))] : [enc(w, k + 1), enc(w, -k), enc(w, k + 2)]).filter((x) => x !== correct);
    const opts = [...new Set([correct, ...wrong])].slice(0, 4);
    return {
      id: tid('caesar', i), type: 'choice', optionStyle: 'text', correctId: correct,
      prompt: decode ? L(`Entschlüssle „${shown}“ (Verschiebung ${k} nach rechts wurde benutzt).`, `Decifra «${shown}» (è stato usato uno spostamento di ${k} a destra).`) : L(`Verschlüssle „${shown}“ mit Caesar, Verschiebung ${k}.`, `Cifra «${shown}» con il cifrario di Cesare, spostamento ${k}.`),
      options: shuffle(rng, opts).map((x) => ({ id: x, label: x })),
      hint: decode ? L(`Gehe jeden Buchstaben ${k} Schritte im Alphabet zurück.`, `Torna indietro di ${k} lettere nell’alfabeto.`) : L(`Gehe jeden Buchstaben ${k} Schritte im Alphabet weiter (Z → A).`, `Vai avanti di ${k} lettere nell’alfabeto (Z → A).`),
      explain: [`${shown} → ${correct}`]
    };
  });
}

const R = 'religion' as const;
const I = 'informatik' as const;
export const EXTRA_MODULES: LearningModule[] = [
  bankModule({ id: 'rel-feste', subject: R, years: [1, 5], title: ['Feste und Miteinander', 'Feste e stare insieme'], subtitle: ['Religionen, Feste, Freundlichkeit', 'Religioni, feste, gentilezza'], emoji: '🕊️', color: 'sonne', items: REL_KLEIN }),
  bankModule({ id: 'rel-weltreligionen', subject: R, years: [5, 10], title: ['Weltreligionen und Werte', 'Religioni del mondo e valori'], subtitle: ['Schriften, Toleranz, Menschenrechte', 'Testi sacri, tolleranza, diritti'], emoji: '🌍', color: 'lila', items: REL_MITTEL }),
  bankModule({ id: 'rel-ethik', subject: R, years: [10, 13], title: ['Ethik und Philosophie', 'Etica e filosofia'], subtitle: ['Kant, Utilitarismus, Bioethik', 'Kant, utilitarismo, bioetica'], emoji: '⚖️', color: 'himmel', items: REL_OBER }),
  bankModule({ id: 'info-computer', subject: I, years: [1, 5], title: ['Computer und sicher im Netz', 'Il computer e la sicurezza online'], subtitle: ['Geräte, Passwörter, Hilfe holen', 'Dispositivi, password, chiedere aiuto'], emoji: '💻', color: 'himmel', items: INFO_KLEIN }),
  bankModule({ id: 'info-hardware-netz', subject: I, years: [5, 10], title: ['Hardware, Internet, Sicherheit', 'Hardware, Internet, sicurezza'], subtitle: ['CPU, RAM, Phishing, IP', 'CPU, RAM, phishing, IP'], emoji: '🖥️', color: 'minze', items: INFO_MITTEL }),
  { id: 'info-binaer', title: tx('Binär- und Hexzahlen', 'Binario ed esadecimale'), subtitle: tx('Wie Computer zählen', 'Come contano i computer'), emoji: '🔢', color: 'lila', area: 'schule', subject: I, years: [5, 13], topic: tx('Zahlensysteme', 'Sistemi di numerazione'), roundSize: 6, generate: (l, r) => genBinaer(l, r) },
  { id: 'info-logik', title: tx('Logikgatter', 'Porte logiche'), subtitle: tx('AND, OR, NOT, XOR', 'AND, OR, NOT, XOR'), emoji: '🔌', color: 'koralle', area: 'schule', subject: I, years: [7, 13], topic: tx('Logik', 'Logica'), roundSize: 6, generate: (l, r) => genLogik(l, r) },
  { id: 'info-caesar', title: tx('Geheimschrift (Caesar)', 'Cifrario di Cesare'), subtitle: tx('Verschlüsseln und entschlüsseln', 'Cifrare e decifrare'), emoji: '🗝️', color: 'sonne', area: 'schule', subject: I, years: [4, 10], topic: tx('Verschlüsselung', 'Crittografia'), roundSize: 5, generate: (l, r) => genCaesar(l, r) },
  bankModule({ id: 'info-oberstufe', subject: I, years: [10, 13], title: ['Datenbanken, Algorithmen, Netze', 'Database, algoritmi, reti'], subtitle: ['SQL, O-Notation, Kryptografie', 'SQL, complessità, crittografia'], emoji: '🗃️', color: 'himmel', items: INFO_OBER, codeLang: 'sql' })
];
