import type { BankItem } from '../../bank';
import type { Difficulty } from '../../types';
import type { Country } from '../../../school/systems';

/* Zusatzfragen Grundschule: Sachunterricht / Scienze e English for Kids (3 Antworten, kindgerecht) */
const q = (de: string, it: string, e?: string, lv?: Difficulty, c?: Country): BankItem => ({ de, it, e, lv, c });

export const MORE_PRIMARY: Record<string, BankItem[]> = {
  's1-jahreszeiten': [
    q('Womit siehst du? | mit den Augen | mit den Ohren ; mit der Nase | Wir haben zwei Augen.', 'Con che cosa vedi? | con gli occhi | con le orecchie ; con il naso | Abbiamo due occhi.', '👀'),
    q('Womit schmeckst du? | mit der Zunge | mit den Füßen ; mit den Haaren | Süß, sauer, salzig, bitter.', 'Con che cosa senti i sapori? | con la lingua | con i piedi ; con i capelli | Dolce, aspro, salato, amaro.', '👅'),
    q('In welcher Jahreszeit ist es am heißesten? | Sommer | Winter ; Herbst | Dann gehen wir ins Freibad.', 'In quale stagione fa più caldo? | estate | inverno ; autunno | Si va al mare.', '☀️'),
    q('Was ziehst du an, wenn es regnet? | Regenjacke und Gummistiefel | Badehose ; Sandalen | So bleibst du trocken.', 'Che cosa metti quando piove? | impermeabile e stivali | costume da bagno ; sandali | Così resti asciutto.', '🌧️'),
    q('Wie viele Monate hat ein Jahr? | 12 | 7 ; 10 | Januar bis Dezember.', 'Quanti mesi ha un anno? | 12 | 7 ; 10 | Da gennaio a dicembre.', '📅', 2),
    q('In welcher Jahreszeit blühen viele Blumen neu? | Frühling | Winter ; Herbst | Die Natur erwacht.', 'In quale stagione sbocciano tanti fiori? | primavera | inverno ; autunno | La natura si risveglia.', '🌷', 2),
    q('Was ist gesund? | Obst und Gemüse | jeden Tag Chips ; nur Limonade | Bunt essen hält fit.', 'Che cosa fa bene alla salute? | frutta e verdura | patatine ogni giorno ; solo bibite | Mangiare colorato tiene in forma.', '🥕', 2),
    q('Welcher Monat kommt nach März? | April | Februar ; Mai | Januar, Februar, März, April …', 'Quale mese viene dopo marzo? | aprile | febbraio ; maggio | Gennaio, febbraio, marzo, aprile…', '🗓️', 2),
    q('Wo gehst du über die Straße am sichersten? | am Zebrastreifen oder an der Ampel | zwischen parkenden Autos ; in der Kurve | Dort sehen dich die Autos.', 'Dove attraversi la strada nel modo più sicuro? | sulle strisce o al semaforo | tra le auto parcheggiate ; in curva | Lì le auto ti vedono.', '🚸', 3),
    q('Was zeigt ein Thermometer? | wie warm oder kalt es ist | wie spät es ist ; wie schwer etwas ist | Die Temperatur.', 'Che cosa indica il termometro? | quanto fa caldo o freddo | che ore sono ; quanto pesa una cosa | La temperatura.', '🌡️', 3),
    q('Was ist ein Gewitter? | Regen mit Blitz und Donner | ein leiser Wind ; ein sonniger Tag | Bei Gewitter gehst du ins Haus.', 'Che cos’è un temporale? | pioggia con lampi e tuoni | un vento leggero ; una giornata di sole | Durante il temporale si sta in casa.', '⛈️', 3),
    q('Warum trägst du beim Radfahren einen Helm? | Er schützt deinen Kopf. | Er hält warm. ; Er macht schneller. | Sicherheit geht vor.', 'Perché metti il casco in bici? | Protegge la testa. | Tiene caldo. ; Fa andare più veloce. | La sicurezza prima di tutto.', '⛑️', 3),
    q('Warum wird es im Winter früher dunkel? | Die Tage sind im Winter kürzer. | Die Sonne ist krank. ; Der Mond ist größer. | Die Erde ist dann schräg von der Sonne weg geneigt.', 'Perché d’inverno fa buio prima? | D’inverno le giornate sono più corte. | Il sole è malato. ; La luna è più grande. | La Terra è inclinata lontano dal sole.', '🌙', 3)
  ],
  's2-tiere': [
    q('Wie nennt man ein Hundebaby? | Welpe | Kalb ; Küken | Welpen spielen gern.', 'Come si chiama il cucciolo del cane? | cucciolo | vitello ; pulcino | I cuccioli amano giocare.', '🐶'),
    q('Was frisst eine Kuh? | Gras und Heu | Fleisch ; Fische | Sie ist ein Pflanzenfresser.', 'Che cosa mangia la mucca? | erba e fieno | carne ; pesci | È un’erbivora.', '🐄'),
    q('Wo lebt ein Fisch? | im Wasser | auf dem Baum ; in der Wüste | Er atmet mit Kiemen.', 'Dove vive un pesce? | nell’acqua | sull’albero ; nel deserto | Respira con le branchie.', '🐟'),
    q('Was gibt uns das Huhn? | Eier | Milch ; Wolle | Das Schaf gibt Wolle.', 'Che cosa ci dà la gallina? | uova | latte ; lana | La pecora dà la lana.', '🥚'),
    q('Welches Tier hat einen Panzer? | Schildkröte | Hase ; Ente | Sie kann sich darin verstecken.', 'Quale animale ha il guscio? | tartaruga | coniglio ; anatra | Ci si può nascondere dentro.', '🐢', 2),
    q('Wie viele Beine hat ein Insekt? | 6 | 8 ; 4 | Zum Beispiel die Ameise.', 'Quante zampe ha un insetto? | 6 | 8 ; 4 | Per esempio la formica.', '🐜', 2),
    q('Was wird aus einem Samen? | eine neue Pflanze | ein Stein ; ein Tier | Er braucht Wasser und Erde.', 'Che cosa nasce da un seme? | una nuova pianta | un sasso ; un animale | Ha bisogno di acqua e terra.', '🌱', 2),
    q('Welches Tier ist nachts wach? | Eule | Huhn ; Schmetterling | Eulen sehen im Dunkeln gut.', 'Quale animale è sveglio di notte? | gufo | gallina ; farfalla | I gufi vedono bene al buio.', '🦉', 2),
    q('Was machen Zugvögel im Herbst? | Sie fliegen in den warmen Süden. | Sie schlafen im Boden. ; Sie werden zu Fischen. | Im Frühling kommen sie zurück.', 'Che cosa fanno gli uccelli migratori in autunno? | Volano verso il Sud caldo. | Dormono sottoterra. ; Diventano pesci. | In primavera ritornano.', '🐦', 3),
    q('Was gehört in die gelbe Tonne / den Kunststoff? | Joghurtbecher | Apfelreste ; Zeitung | Verpackungen werden recycelt.', 'Che cosa va nella plastica? | il vasetto dello yogurt | i resti di mela ; il giornale | Gli imballaggi si riciclano.', '♻️', 3),
    q('Woraus wird Brot gemacht? | aus Mehl vom Getreide | aus Milch ; aus Zucker allein | Weizen wird zu Mehl gemahlen.', 'Con che cosa si fa il pane? | con la farina dei cereali | con il latte ; solo con lo zucchero | Il grano diventa farina.', '🍞', 3),
    q('Welches Tier gehört zu den Säugetieren? | Delfin | Hai ; Pinguin | Delfine atmen Luft und säugen ihre Jungen.', 'Quale animale è un mammifero? | delfino | squalo ; pinguino | I delfini respirano aria e allattano.', '🐬', 3),
    q('Was brauchen alle Tiere zum Leben? | Nahrung, Wasser und Luft | nur Spielzeug ; nur Sonne | Genau wie wir.', 'Di che cosa hanno bisogno tutti gli animali per vivere? | cibo, acqua e aria | solo giocattoli ; solo sole | Proprio come noi.', '🐾', 3)
  ],
  's3-natur': [
    q('Was braucht ein Feuer zum Brennen? | Luft | Wasser ; Sand | Ohne Sauerstoff geht es aus.', 'Di che cosa ha bisogno il fuoco per bruciare? | aria | acqua ; sabbia | Senza ossigeno si spegne.', '🔥'),
    q('Was ist ein Nadelbaum? | Tanne | Eiche ; Buche | Er hat Nadeln statt Blätter.', 'Quale albero è una conifera? | abete | quercia ; faggio | Ha gli aghi al posto delle foglie.', '🌲'),
    q('Was entsteht, wenn Wasserdampf abkühlt? | Wassertropfen | Eis sofort ; Sand | Zum Beispiel am kalten Fenster.', 'Che cosa si forma quando il vapore si raffredda? | goccioline d’acqua | subito ghiaccio ; sabbia | Per esempio sul vetro freddo.', '💧'),
    q('Was gehört in den Glascontainer? | leere Flaschen aus Glas | Plastiktüten ; Batterien | Glas wird wieder eingeschmolzen.', 'Che cosa va nel vetro? | bottiglie di vetro vuote | sacchetti di plastica ; pile | Il vetro si rifonde.', '🍾', 2),
    q('Wie heißt der Kreislauf von Verdunsten, Wolken und Regen? | Wasserkreislauf | Mondkreislauf ; Blutkreislauf | Das Wasser geht nie verloren.', 'Come si chiama il ciclo di evaporazione, nuvole e pioggia? | ciclo dell’acqua | ciclo della luna ; circolazione del sangue | L’acqua non si perde mai.', '🌦️', 2),
    q('Was nehmen Wurzeln aus dem Boden auf? | Wasser | Licht ; Luft allein | Sie halten die Pflanze auch fest.', 'Che cosa assorbono le radici dal terreno? | acqua | luce ; solo aria | Tengono anche ferma la pianta.', '🌳', 2),
    q('Warum soll man Batterien nicht in den Hausmüll werfen? | Sie enthalten giftige Stoffe. | Sie sind zu leicht. ; Sie riechen. | Es gibt Sammelboxen im Geschäft.', 'Perché le pile non vanno nell’indifferenziata? | Contengono sostanze tossiche. | Sono troppo leggere. ; Puzzano. | Ci sono appositi contenitori nei negozi.', '🔋', 2),
    q('Welcher Stoff schwimmt auf Wasser? | Holz | Stein ; Eisenschraube | Holz ist leichter als Wasser.', 'Quale materiale galleggia sull’acqua? | legno | sasso ; vite di ferro | Il legno è più leggero dell’acqua.', '🪵', 3),
    q('Welche Tiere helfen, den Boden locker zu machen? | Regenwürmer | Vögel ; Fische | Sie graben Gänge.', 'Quali animali rendono il terreno soffice? | lombrichi | uccelli ; pesci | Scavano gallerie.', '🪱', 3),
    q('Wozu braucht die Pflanze ihre Blätter? | um mit Sonnenlicht Nahrung herzustellen | um zu laufen ; um Wasser zu speichern im Boden | Das heißt Fotosynthese.', 'A che cosa servono le foglie alla pianta? | a produrre nutrimento con la luce del sole | a camminare ; a tenere l’acqua nel terreno | Si chiama fotosintesi.', '🍃', 3),
    q('Was passiert mit Schokolade in der heißen Sonne? | Sie schmilzt. | Sie gefriert. ; Sie wird zu Gas. | Wärme macht feste Stoffe flüssig.', 'Che cosa succede al cioccolato sotto il sole caldo? | Si scioglie. | Gela. ; Diventa gas. | Il calore rende liquidi i solidi.', '🍫', 3),
    q('Warum ist ein Wald wichtig? | Bäume machen Sauerstoff und sind Zuhause für Tiere. | Er macht Lärm. ; Er verbraucht Sauerstoff. | Wälder schützen auch vor Erdrutschen.', 'Perché un bosco è importante? | Gli alberi producono ossigeno e sono casa per gli animali. | Fa rumore. ; Consuma ossigeno. | I boschi proteggono anche dalle frane.', '🌲', 3)
  ],
  's4-welt': [
    q('Welche Himmelsrichtung liegt gegenüber von Norden? | Süden | Osten ; Westen | Nord – Ost – Süd – West.', 'Quale punto cardinale è opposto al Nord? | Sud | Est ; Ovest | Nord – Est – Sud – Ovest.', '🧭'),
    q('Wo geht die Sonne auf? | im Osten | im Westen ; im Norden | Im Westen geht sie unter.', 'Dove sorge il sole? | a Est | a Ovest ; a Nord | Tramonta a Ovest.', '🌅'),
    q('Was ist eine Landkarte? | ein Bild der Erde von oben, verkleinert | ein Foto vom Himmel ; ein Kalender | Mit Legende und Maßstab.', 'Che cos’è una carta geografica? | un’immagine dall’alto della Terra, rimpicciolita | una foto del cielo ; un calendario | Con legenda e scala.', '🗺️'),
    q('Welcher Stoff isoliert Strom (leitet nicht)? | Gummi | Kupfer ; Eisen | Deshalb sind Kabel mit Gummi oder Plastik umhüllt.', 'Quale materiale isola la corrente? | gomma | rame ; ferro | Per questo i cavi sono rivestiti.', '🔌', 2),
    q('Warum darf man nie in eine Steckdose fassen? | Strom ist gefährlich. | Sie ist zu klein. ; Sie ist schmutzig. | Strom kann schwer verletzen.', 'Perché non si toccano mai le prese? | La corrente è pericolosa. | Sono troppo piccole. ; Sono sporche. | La corrente può ferire gravemente.', '⚡', 2),
    q('Wie heißt der Erdteil, auf dem wir leben? | Europa | Afrika ; Asien | Deutschland und Italien liegen in Europa.', 'Come si chiama il continente in cui viviamo? | Europa | Africa ; Asia | Italia e Germania sono in Europa.', '🌍', 2),
    q('Was zeigt der Maßstab 1 : 100 000 auf einer Karte? | 1 cm auf der Karte sind 1 km in Wirklichkeit | 1 cm sind 100 km ; 1 m sind 1 cm | 100 000 cm = 1 km.', 'Che cosa indica la scala 1 : 100 000? | 1 cm sulla carta è 1 km nella realtà | 1 cm è 100 km ; 1 m è 1 cm | 100 000 cm = 1 km.', '📏', 3),
    q('Was braucht eine Lampe im Stromkreis zum Leuchten? | einen geschlossenen Stromkreis | einen offenen Schalter ; nur ein Kabel | Der Strom muss im Kreis fließen.', 'Che cosa serve alla lampadina per accendersi? | un circuito chiuso | un interruttore aperto ; un solo filo | La corrente deve girare in cerchio.', '💡', 3),
    q('Wer wählt in Deutschland den Bundestag? | die Bürgerinnen und Bürger ab 18 | nur der Kanzler ; die Kinder | Das ist Demokratie.', 'Chi elegge il Bundestag in Germania? | i cittadini dai 18 anni | solo il cancelliere ; i bambini | È la democrazia.', '🗳️', 3, 'DE'),
    q('Wer wählt in Italien das Parlament? | die Bürgerinnen und Bürger ab 18 | nur der Präsident ; die Kinder | Das ist Demokratie.', 'Chi elegge il Parlamento italiano? | i cittadini maggiorenni | solo il Presidente ; i bambini | È la democrazia.', '🗳️', 3, 'IT'),
    q('Was ist ein Windrad? | eine Anlage, die aus Wind Strom macht | ein Spielzeug für den Sommer ; ein Wetterhahn | Erneuerbare Energie.', 'Che cos’è una pala eolica? | un impianto che trasforma il vento in corrente | un giocattolo estivo ; una banderuola | Energia rinnovabile.', '🌬️', 3),
    q('Was zeigt die Legende einer Karte? | was die Zeichen und Farben bedeuten | wer die Karte gemalt hat ; die Uhrzeit | Blau = Wasser, Grün = Tiefland …', 'Che cosa mostra la legenda di una carta? | che cosa significano simboli e colori | chi ha disegnato la carta ; l’ora | Blu = acqua, verde = pianura…', '🗺️', 3)
  ],
  'e-basis': [
    q('Was heißt „gelb“ auf Englisch? | yellow | yes ; yoghurt | Die Sonne ist yellow.', 'Come si dice «giallo» in inglese? | yellow | yes ; yoghurt | Il sole è yellow.', '🟡'),
    q('Was heißt „vier“ auf Englisch? | four | for ; five | one, two, three, four.', 'Come si dice «quattro» in inglese? | four | for ; five | one, two, three, four.', '4️⃣'),
    q('Was heißt „Haus“ auf Englisch? | house | mouse ; horse | My house is big.', 'Come si dice «casa» in inglese? | house | mouse ; horse | My house is big.', '🏠'),
    q('Was heißt „Vater“ auf Englisch? | father | mother ; brother | Kurz: dad.', 'Come si dice «papà» in inglese? | father | mother ; brother | Breve: dad.', '👨'),
    q('Was heißt „Vogel“ auf Englisch? | bird | bed ; bread | The bird can fly.', 'Come si dice «uccello» in inglese? | bird | bed ; bread | The bird can fly.', '🐦', 2),
    q('Was heißt „Guten Morgen“ auf Englisch? | Good morning | Good night ; Good bye | Am Abend: good evening.', 'Come si dice «buongiorno» in inglese? | Good morning | Good night ; Goodbye | La sera: good evening.', '🌅', 2),
    q('Was heißt „Pferd“ auf Englisch? | horse | house ; hose | The horse runs fast.', 'Come si dice «cavallo» in inglese? | horse | house ; hose | The horse runs fast.', '🐴', 2),
    q('Was heißt „zehn“ auf Englisch? | ten | two ; tea | Ten fingers.', 'Come si dice «dieci» in inglese? | ten | two ; tea | Ten fingers.', '🔟', 2),
    q('Was heißt „Wie heißt du?“ auf Englisch? | What’s your name? | How are you? ; Where are you? | Antwort: My name is …', 'Come si dice «Come ti chiami?» in inglese? | What’s your name? | How are you? ; Where are you? | Risposta: My name is…', '🙋', 3),
    q('Was heißt „Ich bin acht Jahre alt“? | I am eight years old. | I have eight years. ; I am eight years. | Im Englischen sagt man „I am“.', 'Come si dice «Ho otto anni»? | I am eight years old. | I have eight years. ; I am eight years. | In inglese si usa «I am».', '🎂', 3),
    q('Was heißt „Ich mag Pizza“? | I like pizza. | I am pizza. ; I have like pizza. | like = mögen.', 'Come si dice «Mi piace la pizza»? | I like pizza. | I am pizza. ; I have like pizza. | like = piacere.', '🍕', 3)
  ]
};
