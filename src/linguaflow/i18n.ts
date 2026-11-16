/**
 * Texte der Oberfläche von LinguaFlow (getrennt von den Kursinhalten).
 * Neue Oberflächensprache: ein weiteres Wörterbuch hinzufügen und in UI_LANGS (catalog.ts) eintragen.
 */
import { useOwner } from './store';
import { deviceUiLang, dirOf } from './catalog';
import type { LangTag } from './types';

const it = {
  'settings.effects': 'Suoni ed effetti (coriandoli, stelle, animazioni)', 'ex.streak': '{n} di fila!', 'done.perfect': 'Perfetto, nessun errore!', 'done.stars': '{n} stelle su 3',
  'nav.lessons': 'Lezioni', 'nav.review': 'Ripasso', 'nav.courses': 'Corsi', 'nav.settings': 'Impostazioni', 'nav.practice': 'Pratica con Puppy',
  'loading': 'Un momento …', 'error.load': 'Non riesco a caricare i corsi. Controlla la connessione e riprova.', 'retry': 'Riprova',
  'welcome.title': 'Benvenuto in {app}!', 'welcome.text': 'Impara una lingua con lezioni brevi, dialoghi veri ed esercizi. Puppy ti accompagna.',
  'welcome.ui': 'Lingua dell’app', 'welcome.uiHint': 'In che lingua vuoi i menu e i pulsanti?', 'next': 'Avanti', 'back': 'Indietro',
  'pick.known': 'Parlo…', 'pick.knownHint': 'La lingua che conosci: traduzioni e spiegazioni saranno in questa lingua.',
  'pick.target': 'Voglio imparare…', 'pick.targetHint': 'La lingua che vuoi imparare.',
  'pick.search': 'Cerca una lingua (anche nel suo nome originale)', 'pick.none': 'Nessuna lingua trovata.',
  'pick.withCourses': 'Con lezioni', 'pick.all': 'Tutte le lingue', 'pick.suggested': 'Suggerita',
  'pick.change': 'Cambia', 'pick.chosen': 'Scelta',
  'avail.start': 'Inizia il corso', 'avail.continue': 'Continua il corso', 'avail.none': 'Corso non ancora disponibile',
  'avail.noneText': 'Per {known} → {target} non ci sono ancora lezioni. La tua scelta resta salvata.',
  'avail.otherSources': 'Lezioni di {target} esistono per chi parla:', 'avail.useSource': 'Usa {lang} come lingua di partenza',
  'avail.variants': 'Esiste un corso per una variante vicina:', 'avail.noOther': 'Per ora non ci sono lezioni di {target} in nessuna lingua.',
  'kind.course': 'Modulo completo', 'kind.intro': 'Introduzione', 'kind.demo': 'Demo', 'kind.none': 'Non ancora disponibile',
  'lessons.n': '{n} lezioni', 'lessons.1': '1 lezione', 'level': 'Livello {level}',
  'quality.unreviewed': 'Testi scritti a mano, non ancora controllati da madrelingua.',
  'quality.machine': 'Traduzione automatica: può contenere errori.', 'quality.reviewed': 'Controllato da madrelingua.',
  'home.progress': '{done} di {n} lezioni completate', 'home.review': 'Ripasso degli errori', 'home.reviewN': '{n} esercizi da ripassare',
  'home.reviewNone': 'Nessun errore da ripassare.', 'home.myCourses': 'I miei corsi', 'home.addCourse': 'Aggiungi un corso',
  'home.active': 'Attivo', 'home.switch': 'Passa a questo corso', 'home.minutes': '{n} min', 'home.start': 'Inizia', 'home.again': 'Ripeti',
  'home.done': 'Completata', 'home.short': 'Questo corso è breve: {kind} con {lessons}, non un modulo completo.',
  'lesson.goal': 'Obiettivo', 'lesson.dialogue': 'Dialogo', 'lesson.words': 'Parole e frasi utili', 'lesson.startEx': 'Inizia gli esercizi',
  'lesson.showTr': 'Traduzione', 'lesson.showTranslit': 'Trascrizione', 'lesson.listenAll': 'Ascolta il dialogo', 'lesson.play': 'Ascolta',
  'lesson.noVoice': 'Su questo dispositivo non c’è una voce per {lang}: leggi il testo. Gli esercizi di ascolto diventano esercizi di lettura.',
  'lesson.voiceChecking': 'Cerco una voce per {lang} …', 'lesson.close': 'Chiudi la lezione', 'lesson.of': '{i} di {n}',
  'ex.listen': 'Ascolta e scegli il significato', 'ex.read': 'Esercizio di lettura: leggi e scegli il significato',
  'ex.choiceToSource': 'Che cosa significa?', 'ex.choiceToTarget': 'Come si dice in {lang}?', 'ex.cloze': 'Completa la frase',
  'ex.order': 'Metti in ordine la frase', 'ex.write': 'Scrivi in {lang}', 'ex.situation': 'Situazione finale',
  'ex.placeholder': 'Scrivi qui …', 'ex.check': 'Controlla', 'ex.continue': 'Continua', 'ex.right': 'Giusto!', 'ex.wrong': 'Non proprio.',
  'ex.solution': 'Risposta corretta:', 'ex.saved': 'Salvato nel ripasso.', 'ex.tapWords': 'Tocca le parti nell’ordine giusto.',
  'ex.listenAgain': 'Ascolta di nuovo', 'ex.hint': 'Aiuto',
  'done.title': 'Lezione completata!', 'done.score': '{score} risposte giuste su {total}', 'done.mistakes': '{n} esercizi salvati nel ripasso',
  'done.next': 'Lezione successiva', 'done.home': 'Torna alle lezioni', 'done.review': 'Ripassa gli errori',
  'review.title': 'Ripasso', 'review.empty': 'Bravo! Non ci sono errori da ripassare in questo corso.', 'review.start': 'Inizia il ripasso',
  'review.done': 'Ripasso finito: {n} esercizi risolti.', 'review.left': 'Ancora da ripassare: {n}',
  'settings.title': 'Impostazioni', 'settings.ui': 'Lingua dell’app', 'settings.pair': 'Lingue del corso',
  'settings.translation': 'Mostra la traduzione nei dialoghi', 'settings.translit': 'Mostra la trascrizione (se c’è)',
  'settings.data': 'I progressi restano su questo dispositivo. Nessun account, nessun abbonamento.',
  'notfound': 'Questo corso non c’è (più).', 'offline': 'Sei offline: le lezioni già aperte funzionano comunque.'
};
type Dict = typeof it;
export type Key = keyof Dict;

const de: Dict = {
  'settings.effects': 'Töne und Effekte (Konfetti, Sterne, Animationen)', 'ex.streak': '{n} in Folge!', 'done.perfect': 'Perfekt, kein Fehler!', 'done.stars': '{n} von 3 Sternen',
  'nav.lessons': 'Lektionen', 'nav.review': 'Wiederholen', 'nav.courses': 'Kurse', 'nav.settings': 'Einstellungen', 'nav.practice': 'Üben mit Puppy',
  'loading': 'Einen Moment …', 'error.load': 'Die Kurse lassen sich nicht laden. Prüfe die Verbindung und versuche es erneut.', 'retry': 'Erneut versuchen',
  'welcome.title': 'Willkommen bei {app}!', 'welcome.text': 'Lerne eine Sprache mit kurzen Lektionen, echten Dialogen und Übungen. Puppy begleitet dich.',
  'welcome.ui': 'Sprache der App', 'welcome.uiHint': 'In welcher Sprache möchtest du Menüs und Knöpfe?', 'next': 'Weiter', 'back': 'Zurück',
  'pick.known': 'Ich spreche …', 'pick.knownHint': 'Die Sprache, die du kannst: Übersetzungen und Erklärungen kommen in dieser Sprache.',
  'pick.target': 'Ich möchte lernen …', 'pick.targetHint': 'Die Sprache, die du lernen möchtest.',
  'pick.search': 'Sprache suchen (auch mit ihrem Originalnamen)', 'pick.none': 'Keine Sprache gefunden.',
  'pick.withCourses': 'Mit Lektionen', 'pick.all': 'Alle Sprachen', 'pick.suggested': 'Vorschlag',
  'pick.change': 'Ändern', 'pick.chosen': 'Gewählt',
  'avail.start': 'Kurs starten', 'avail.continue': 'Kurs fortsetzen', 'avail.none': 'Kurs noch nicht verfügbar',
  'avail.noneText': 'Für {known} → {target} gibt es noch keine Lektionen. Deine Auswahl bleibt gespeichert.',
  'avail.otherSources': 'Lektionen für {target} gibt es für Sprecher von:', 'avail.useSource': '{lang} als Ausgangssprache nehmen',
  'avail.variants': 'Es gibt einen Kurs für eine verwandte Variante:', 'avail.noOther': 'Für {target} gibt es noch in keiner Sprache Lektionen.',
  'kind.course': 'Vollständiges Modul', 'kind.intro': 'Einführung', 'kind.demo': 'Demo', 'kind.none': 'Noch nicht verfügbar',
  'lessons.n': '{n} Lektionen', 'lessons.1': '1 Lektion', 'level': 'Niveau {level}',
  'quality.unreviewed': 'Von Hand geschrieben, noch nicht von Muttersprachlern geprüft.',
  'quality.machine': 'Maschinell übersetzt: kann Fehler enthalten.', 'quality.reviewed': 'Von Muttersprachlern geprüft.',
  'home.progress': '{done} von {n} Lektionen geschafft', 'home.review': 'Fehler wiederholen', 'home.reviewN': '{n} Übungen zum Wiederholen',
  'home.reviewNone': 'Keine Fehler zum Wiederholen.', 'home.myCourses': 'Meine Kurse', 'home.addCourse': 'Kurs hinzufügen',
  'home.active': 'Aktiv', 'home.switch': 'Zu diesem Kurs wechseln', 'home.minutes': '{n} Min.', 'home.start': 'Starten', 'home.again': 'Wiederholen',
  'home.done': 'Geschafft', 'home.short': 'Dieser Kurs ist kurz: {kind} mit {lessons}, kein vollständiges Modul.',
  'lesson.goal': 'Ziel', 'lesson.dialogue': 'Dialog', 'lesson.words': 'Nützliche Wörter und Sätze', 'lesson.startEx': 'Übungen starten',
  'lesson.showTr': 'Übersetzung', 'lesson.showTranslit': 'Umschrift', 'lesson.listenAll': 'Dialog anhören', 'lesson.play': 'Anhören',
  'lesson.noVoice': 'Auf diesem Gerät gibt es keine Stimme für {lang}: lies den Text. Hörübungen werden zu Leseübungen.',
  'lesson.voiceChecking': 'Suche eine Stimme für {lang} …', 'lesson.close': 'Lektion schließen', 'lesson.of': '{i} von {n}',
  'ex.listen': 'Hör zu und wähle die Bedeutung', 'ex.read': 'Leseübung: lies und wähle die Bedeutung',
  'ex.choiceToSource': 'Was bedeutet das?', 'ex.choiceToTarget': 'Wie sagt man das auf {lang}?', 'ex.cloze': 'Ergänze den Satz',
  'ex.order': 'Bring den Satz in die richtige Reihenfolge', 'ex.write': 'Schreib auf {lang}', 'ex.situation': 'Abschluss-Situation',
  'ex.placeholder': 'Hier schreiben …', 'ex.check': 'Prüfen', 'ex.continue': 'Weiter', 'ex.right': 'Richtig!', 'ex.wrong': 'Nicht ganz.',
  'ex.solution': 'Richtige Antwort:', 'ex.saved': 'Zum Wiederholen gespeichert.', 'ex.tapWords': 'Tippe die Teile in der richtigen Reihenfolge an.',
  'ex.listenAgain': 'Noch einmal hören', 'ex.hint': 'Hilfe',
  'done.title': 'Lektion geschafft!', 'done.score': '{score} von {total} richtig', 'done.mistakes': '{n} Übungen zum Wiederholen gespeichert',
  'done.next': 'Nächste Lektion', 'done.home': 'Zurück zu den Lektionen', 'done.review': 'Fehler wiederholen',
  'review.title': 'Wiederholen', 'review.empty': 'Super! In diesem Kurs gibt es nichts zu wiederholen.', 'review.start': 'Wiederholung starten',
  'review.done': 'Wiederholung fertig: {n} Übungen gelöst.', 'review.left': 'Noch zu wiederholen: {n}',
  'settings.title': 'Einstellungen', 'settings.ui': 'Sprache der App', 'settings.pair': 'Sprachen des Kurses',
  'settings.translation': 'Übersetzung in Dialogen zeigen', 'settings.translit': 'Umschrift zeigen (falls vorhanden)',
  'settings.data': 'Der Fortschritt bleibt auf diesem Gerät. Kein Konto, kein Abo.',
  'notfound': 'Diesen Kurs gibt es nicht (mehr).', 'offline': 'Du bist offline: bereits geöffnete Lektionen funktionieren trotzdem.'
};

const en: Dict = {
  'settings.effects': 'Sounds and effects (confetti, stars, animations)', 'ex.streak': '{n} in a row!', 'done.perfect': 'Perfect, no mistakes!', 'done.stars': '{n} of 3 stars',
  'nav.lessons': 'Lessons', 'nav.review': 'Review', 'nav.courses': 'Courses', 'nav.settings': 'Settings', 'nav.practice': 'Practise with Puppy',
  'loading': 'One moment …', 'error.load': 'The courses could not be loaded. Check your connection and try again.', 'retry': 'Try again',
  'welcome.title': 'Welcome to {app}!', 'welcome.text': 'Learn a language with short lessons, real dialogues and exercises. Puppy is with you.',
  'welcome.ui': 'App language', 'welcome.uiHint': 'Which language do you want for menus and buttons?', 'next': 'Next', 'back': 'Back',
  'pick.known': 'I speak…', 'pick.knownHint': 'The language you know: translations and explanations will be in this language.',
  'pick.target': 'I want to learn…', 'pick.targetHint': 'The language you want to learn.',
  'pick.search': 'Search a language (also by its own name)', 'pick.none': 'No language found.',
  'pick.withCourses': 'With lessons', 'pick.all': 'All languages', 'pick.suggested': 'Suggested',
  'pick.change': 'Change', 'pick.chosen': 'Selected',
  'avail.start': 'Start the course', 'avail.continue': 'Continue the course', 'avail.none': 'Course not available yet',
  'avail.noneText': 'There are no lessons yet for {known} → {target}. Your choice stays saved.',
  'avail.otherSources': 'Lessons for {target} exist for speakers of:', 'avail.useSource': 'Use {lang} as my source language',
  'avail.variants': 'There is a course for a related variant:', 'avail.noOther': 'There are no {target} lessons in any language yet.',
  'kind.course': 'Full module', 'kind.intro': 'Introduction', 'kind.demo': 'Demo', 'kind.none': 'Not available yet',
  'lessons.n': '{n} lessons', 'lessons.1': '1 lesson', 'level': 'Level {level}',
  'quality.unreviewed': 'Written by hand, not yet checked by native speakers.',
  'quality.machine': 'Machine translation: may contain mistakes.', 'quality.reviewed': 'Checked by native speakers.',
  'home.progress': '{done} of {n} lessons completed', 'home.review': 'Review your mistakes', 'home.reviewN': '{n} exercises to review',
  'home.reviewNone': 'No mistakes to review.', 'home.myCourses': 'My courses', 'home.addCourse': 'Add a course',
  'home.active': 'Active', 'home.switch': 'Switch to this course', 'home.minutes': '{n} min', 'home.start': 'Start', 'home.again': 'Repeat',
  'home.done': 'Completed', 'home.short': 'This course is short: {kind} with {lessons}, not a full module.',
  'lesson.goal': 'Goal', 'lesson.dialogue': 'Dialogue', 'lesson.words': 'Useful words and phrases', 'lesson.startEx': 'Start the exercises',
  'lesson.showTr': 'Translation', 'lesson.showTranslit': 'Transliteration', 'lesson.listenAll': 'Listen to the dialogue', 'lesson.play': 'Listen',
  'lesson.noVoice': 'This device has no voice for {lang}: read the text. Listening exercises become reading exercises.',
  'lesson.voiceChecking': 'Looking for a {lang} voice …', 'lesson.close': 'Close the lesson', 'lesson.of': '{i} of {n}',
  'ex.listen': 'Listen and choose the meaning', 'ex.read': 'Reading exercise: read and choose the meaning',
  'ex.choiceToSource': 'What does it mean?', 'ex.choiceToTarget': 'How do you say it in {lang}?', 'ex.cloze': 'Complete the sentence',
  'ex.order': 'Put the sentence in order', 'ex.write': 'Write it in {lang}', 'ex.situation': 'Final situation',
  'ex.placeholder': 'Type here …', 'ex.check': 'Check', 'ex.continue': 'Continue', 'ex.right': 'Correct!', 'ex.wrong': 'Not quite.',
  'ex.solution': 'Correct answer:', 'ex.saved': 'Saved for review.', 'ex.tapWords': 'Tap the parts in the right order.',
  'ex.listenAgain': 'Listen again', 'ex.hint': 'Help',
  'done.title': 'Lesson complete!', 'done.score': '{score} of {total} correct', 'done.mistakes': '{n} exercises saved for review',
  'done.next': 'Next lesson', 'done.home': 'Back to the lessons', 'done.review': 'Review mistakes',
  'review.title': 'Review', 'review.empty': 'Well done! Nothing to review in this course.', 'review.start': 'Start the review',
  'review.done': 'Review finished: {n} exercises solved.', 'review.left': 'Still to review: {n}',
  'settings.title': 'Settings', 'settings.ui': 'App language', 'settings.pair': 'Course languages',
  'settings.translation': 'Show translations in dialogues', 'settings.translit': 'Show transliteration (if available)',
  'settings.data': 'Your progress stays on this device. No account, no subscription.',
  'notfound': 'This course does not exist (any more).', 'offline': 'You are offline: lessons you already opened still work.'
};

export const DICTS: Record<string, Dict> = { it, de, en };

export function translate(ui: LangTag, key: Key, vars?: Record<string, string | number>): string {
  const d = DICTS[ui] ?? DICTS[ui.split('-')[0]!] ?? en;
  let s = d[key] ?? en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

/** Aktuelle Oberflächensprache (gewählt oder Gerätesprache) */
export function useUiLang(): LangTag {
  const o = useOwner();
  return o.ui ?? deviceUiLang('it');
}

export function useT() {
  const ui = useUiLang();
  const t = (key: Key, vars?: Record<string, string | number>) => translate(ui, key, vars);
  return { t, ui, dir: dirOf(ui) };
}
