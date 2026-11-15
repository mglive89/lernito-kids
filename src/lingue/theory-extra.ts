import type { ExtraLang } from './data-extra';
import type { Note, P } from './theory';

/**
 * Theorie für Türkisch, Portugiesisch, Rumänisch und Polnisch – erklärt auf [Deutsch, Italienisch].
 */

export const PRONUNCIATION_EXTRA: Record<ExtraLang, { sound: string; tip: P }[]> = {
  tr: [
    { sound: 'ı', tip: ['Das „ı“ ohne Punkt ist ein dumpfes „i“, fast wie das „e“ in „bitte“: altı, sarı, kırmızı.', 'La «ı» senza puntino è una «i» sorda, a metà tra «i» e «u», con le labbra distese: altı, sarı, kırmızı.'] },
    { sound: 'ç / ş / c', tip: ['„ç“ = „tsch“ (üç), „ş“ = „sch“ (beş, kuş), „c“ = „dsch“ (cetvel).', '«ç» = «c» di «ciao» (üç), «ş» = «sc» di «scena» (beş, kuş), «c» = «g» di «gelato» (cetvel).'] },
    { sound: 'ğ', tip: ['Das „weiche g“ spricht man nicht, es macht den Vokal davor länger: öğretmen, doğdun.', 'La «g morbida» non si pronuncia, allunga solo la vocale prima: öğretmen, doğdun.'] },
    { sound: 'ö / ü', tip: ['„ö“ und „ü“ klingen wie im Deutschen: dört, köpek, üç.', '«ö» = «e» con le labbra a «o», «ü» = «i» con le labbra a «u»: dört, köpek, üç.'] },
    { sound: 'y', tip: ['„y“ klingt wie deutsches „j“: yedi, yeşil, yumurta.', '«y» suona come la «i» di «ieri»: yedi, yeşil, yumurta.'] },
    { sound: 'Betonung', tip: ['Meist wird die letzte Silbe betont: Merhaba, teşekkürler, okul.', 'Di solito l’accento cade sull’ultima sillaba: Merhaba, teşekkürler, okul.'] }
  ],
  pt: [
    { sound: 'ão / ãe', tip: ['Die Tilde macht den Laut nasal, Luft auch durch die Nase: não, pão, cão, mãe.', 'La tilde rende il suono nasale, l’aria passa anche dal naso: não, pão, cão, mãe.'] },
    { sound: '-e / -o', tip: ['Am Wortende ist „e“ fast stumm und „o“ klingt wie „u“: sete, gato, livro.', 'In fondo alla parola la «e» quasi non si sente e la «o» suona come «u»: sete, gato, livro.'] },
    { sound: 's', tip: ['Vor Konsonanten und am Wortende klingt „s“ in Portugal wie „sch“: dois, três, escola.', 'Davanti a consonante e in fondo alla parola la «s» in Portogallo suona come «sc»: dois, três, escola.'] },
    { sound: 'lh / nh', tip: ['„lh“ = „lj“ (vermelho, coelho), „nh“ = „nj“ (minha, casa de banho).', '«lh» = «gli» (vermelho, coelho), «nh» = «gn» (minha, casa de banho).'] },
    { sound: 'ç', tip: ['„ç“ klingt wie scharfes „s“: maçã.', '«ç» suona come una «s» sorda: maçã.'] },
    { sound: 'r / rr', tip: ['Am Wortanfang und als „rr“ ist das „r“ kräftig hinten im Hals: rato, régua.', 'All’inizio della parola e come «rr» la «r» è forte, in gola: rato, régua.'] }
  ],
  ro: [
    { sound: 'ă', tip: ['„ă“ ist ein kurzes, dumpfes „e“ wie in „bitte“: mă, mărul, bună.', '«ă» è una vocale breve e sorda, come una «e» detta senza aprire la bocca: mă, mărul, bună.'] },
    { sound: 'â / î', tip: ['„â“ und „î“ sind derselbe Laut: ein dumpfes „i“ tief im Hals: pâine, înțeleg.', '«â» e «î» sono lo stesso suono: una «i» cupa, a metà tra «i» e «u»: pâine, înțeleg.'] },
    { sound: 'ș / ț', tip: ['„ș“ = „sch“ (șase, școala), „ț“ = „ts“ (mulțumesc).', '«ș» = «sc» di «scena» (șase, școala), «ț» = «z» di «pizza» (mulțumesc).'] },
    { sound: 'ce / ci / che / chi', tip: ['Wie im Italienischen: „ce/ci“ = „tsch“ (cinci, ce faci), „che/chi“ = „k“, „ghi“ = „gi“ hart (ghiozdanul).', 'Proprio come in italiano: «ce/ci» dolci (cinci, ce faci), «che/chi» duri, «ghi» duro (ghiozdanul).'] },
    { sound: '-i', tip: ['Ein „i“ am Wortende nach Konsonant ist fast unhörbar: câini, ani, doi.', 'Una «i» finale dopo consonante si sente appena: câini, ani.'] }
  ],
  pl: [
    { sound: 'sz / cz', tip: ['„sz“ = „sch“ (szkoła, proszę), „cz“ = „tsch“ (czerwony, cztery).', '«sz» = «sc» di «scena» (szkoła, proszę), «cz» = «c» di «ciao» (czerwony, cztery).'] },
    { sound: 'ż / rz', tip: ['„ż“ und „rz“ klingen gleich, wie das „g“ in „Garage“: żółty, różowy.', '«ż» e «rz» suonano uguali, come la «j» francese di «jour»: żółty, różowy.'] },
    { sound: 'ł', tip: ['„ł“ klingt wie englisches „w“: ołówek, szkoła, miło.', '«ł» suona come la «u» di «uomo»: ołówek, szkoła, miło.'] },
    { sound: 'ą / ę', tip: ['Nasale Vokale: pięć, dziękuję. Am Wortende klingt „ę“ fast wie „e“: proszę.', 'Vocali nasali: pięć, dziękuję. In fondo alla parola la «ę» è quasi una «e»: proszę.'] },
    { sound: 'ć / ś / ń', tip: ['Weiche Laute: „ć“ ein weiches „tsch“ (pięć), „ś“ ein weiches „sch“ (sześć), „ń“ = „nj“ (dzień).', 'Suoni morbidi: «ć» come una «c» dolce leggera (pięć), «ś» come una «sc» leggera (sześć), «ń» = «gn» (dzień).'] },
    { sound: 'w / ch', tip: ['„w“ = deutsches „w“ (woda, dwa); „ch“ = rauhes „ch“ wie in „Bach“ (chleb).', '«w» = «v» (woda, dwa); «ch» = una «h» aspirata e forte (chleb).'] }
  ]
};

export const NOTES_EXTRA: Record<string, Record<ExtraLang, Note[]>> = {
  saluti: {
    tr: [
      { title: ['Begrüßen auf Türkisch', 'Salutare in turco'], steps: [['„Merhaba“ passt immer. „Günaydın“ sagst du am Morgen, „İyi geceler“ vor dem Schlafen.', '«Merhaba» va sempre bene. «Günaydın» si dice la mattina, «İyi geceler» prima di dormire.'], ['„Hoşça kal“ sagt, wer geht. Wer bleibt, antwortet „Güle güle“.', '«Hoşça kal» lo dice chi se ne va. Chi resta risponde «Güle güle».'], ['„Teşekkürler“ = danke, „Lütfen“ = bitte.', '«Teşekkürler» = grazie, «Lütfen» = per favore.']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['„Nasılsın?“ = Wie geht es dir? Das „-sın“ am Ende heißt „du“.', '«Nasılsın?» = come stai? Il «-sın» finale vuol dire «tu».'], ['Antwort: „İyiyim“ = „iyi“ (gut) + „-yim“ (ich bin).', 'Risposta: «İyiyim» = «iyi» (bene) + «-yim» (io sono).']], example: { text: 'Nasılsın? – İyiyim, teşekkürler.', meaning: ['Wie geht es dir? – Gut, danke.', 'Come stai? – Bene, grazie.'] } },
      { title: ['Sich vorstellen', 'Presentarsi'], steps: [['„Benim adım Anna.“ – wörtlich „mein Name Anna“. Ein Wort für „ist“ braucht man nicht.', '«Benim adım Anna.» – parola per parola «mio nome Anna». Non serve la parola «è».'], ['„ad“ = Name, „adım“ = mein Name: Im Türkischen hängt man kleine Endungen an.', '«ad» = nome, «adım» = il mio nome: in turco si aggiungono piccole terminazioni.']] }
    ],
    pt: [
      { title: ['Begrüßen auf Portugiesisch', 'Salutare in portoghese'], steps: [['„Olá“ = Hallo, „Bom dia“ am Morgen, „Boa noite“ am Abend und zur Nacht.', '«Olá» = ciao, «Bom dia» la mattina, «Boa noite» la sera e la notte.'], ['„Adeus“ = Auf Wiedersehen; unter Freunden sagt man oft „Tchau“.', '«Adeus» = arrivederci; tra amici si dice spesso «Tchau».']] },
      { title: ['Danke sagen', 'Dire grazie'], steps: [['Jungen sagen „Obrigado“, Mädchen sagen „Obrigada“.', 'I maschi dicono «Obrigado», le femmine «Obrigada».'], ['„Por favor“ = bitte – wie im Spanischen.', '«Por favor» = per favore.']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['„Como estás?“ – Antwort: „Estou bem, obrigado.“', '«Como estás?» – risposta: «Estou bem, obrigado.»'], ['„Chamo-me Anna.“ = Ich heiße Anna. In Portugal steht „me“ mit Bindestrich hinter dem Verb.', '«Chamo-me Anna.» = mi chiamo Anna. In Portogallo «me» va dopo il verbo, con il trattino.']], example: { text: 'Como estás? – Estou bem, obrigado.', meaning: ['Wie geht es dir? – Mir geht es gut, danke.', 'Come stai? – Sto bene, grazie.'] } }
    ],
    ro: [
      { title: ['Begrüßen auf Rumänisch', 'Salutare in rumeno'], steps: [['„Salut“ unter Freunden, „Bună dimineața“ am Morgen, „Noapte bună“ vor dem Schlafen.', '«Salut» tra amici, «Bună dimineața» la mattina, «Noapte bună» prima di dormire.'], ['„La revedere“ = Auf Wiedersehen.', '«La revedere» = arrivederci.'], ['„Mulțumesc“ = danke, „Te rog“ = bitte (wörtlich „ich bitte dich“).', '«Mulțumesc» = grazie, «Te rog» = per favore (parola per parola «ti prego»).']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['„Ce faci?“ – wörtlich „Was machst du?“, gemeint ist „Wie geht es dir?“.', '«Ce faci?» – parola per parola «che fai?», ma vuol dire «come stai?».'], ['Antwort: „Sunt bine.“ = Mir geht es gut („ich bin gut“).', 'Risposta: «Sunt bine.» = sto bene («sono bene»).']], example: { text: 'Ce faci? – Sunt bine, mulțumesc.', meaning: ['Wie geht es dir? – Gut, danke.', 'Come stai? – Sto bene, grazie.'] } },
      { title: ['Sich vorstellen', 'Presentarsi'], steps: [['„Mă numesc Anna.“ = Ich heiße Anna – wörtlich „ich nenne mich Anna“.', '«Mă numesc Anna.» = proprio come «mi chiamo Anna».']] }
    ],
    pl: [
      { title: ['Begrüßen auf Polnisch', 'Salutare in polacco'], steps: [['„Cześć“ heißt Hallo UND Tschüss – unter Freunden.', '«Cześć» vuol dire ciao, sia quando arrivi sia quando vai via – tra amici.'], ['„Dzień dobry“ sagst du tagsüber zu Erwachsenen, „Do widzenia“ = Auf Wiedersehen.', '«Dzień dobry» si dice di giorno agli adulti, «Do widzenia» = arrivederci.'], ['„Dziękuję“ = danke, „Proszę“ = bitte.', '«Dziękuję» = grazie, «Proszę» = per favore (e anche «prego»).']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['„Jak się masz?“ – wörtlich „Wie hast du dich?“.', '«Jak się masz?» – parola per parola «come ti hai?».'], ['Antwort: „Dobrze, dziękuję.“ = Gut, danke.', 'Risposta: «Dobrze, dziękuję.» = bene, grazie.']] },
      { title: ['Sich vorstellen', 'Presentarsi'], steps: [['„Mam na imię Anna.“ – wörtlich „Ich habe als Namen Anna“.', '«Mam na imię Anna.» – parola per parola «ho come nome Anna».']], example: { text: 'Mam na imię Anna.', meaning: ['Ich heiße Anna.', 'Mi chiamo Anna.'] } }
    ]
  },
  numeri: {
    tr: [
      { title: ['Zahlen von 1 bis 10', 'Numeri da 1 a 10'], steps: [['bir, iki, üç, dört, beş, altı, yedi, sekiz, dokuz, on.', 'bir, iki, üç, dört, beş, altı, yedi, sekiz, dokuz, on.'], ['„bir“ heißt auch „ein/eine“: bir kedi = eine Katze.', '«bir» vuol dire anche «un/una»: bir kedi = un gatto.']] },
      { title: ['Nach Zahlen keine Mehrzahl', 'Dopo i numeri niente plurale'], steps: [['Nach einer Zahl bleibt das Nomen in der Einzahl: üç elma = drei Apfel.', 'Dopo un numero il nome resta singolare: üç elma = «tre mela».'], ['„İki köpeğim var.“ = Ich habe zwei Hunde – wörtlich „zwei Hund-mein gibt es“.', '«İki köpeğim var.» = ho due cani – parola per parola «due cane-mio c’è».']], example: { text: 'Üç elma, lütfen.', meaning: ['Drei Äpfel, bitte.', 'Tre mele, per favore.'] } },
      { title: ['Wie alt bist du?', 'Quanti anni hai?'], steps: [['„Yedi yaşındayım.“ – „yaş“ heißt Alter, die Endung „-ım“ heißt „ich bin“.', '«Yedi yaşındayım.» – «yaş» vuol dire età, la terminazione «-ım» vuol dire «io sono».']] }
    ],
    pt: [
      { title: ['Zahlen von 1 bis 10', 'Numeri da 1 a 10'], steps: [['„um“ und „dois“ haben eine weibliche Form: uma maçã, duas maçãs.', '«um» e «dois» hanno una forma femminile: uma maçã, duas maçãs.'], ['„três“ und „seis“: das „s“ am Ende klingt wie „sch“.', '«três» e «seis»: la «s» finale suona come «sc».']] },
      { title: ['Wie alt bist du?', 'Quanti anni hai?'], steps: [['Wie im Italienischen mit „haben“: „Tenho sete anos.“', 'Come in italiano con «avere»: «Tenho sete anos.»'], ['„tenho“ = ich habe (Verb „ter“).', '«tenho» = io ho (verbo «ter»).']], example: { text: 'Tenho sete anos.', meaning: ['Ich bin sieben Jahre alt.', 'Ho sette anni.'] } },
      { title: ['Mehrzahl', 'Il plurale'], steps: [['Meist hängt man -s an: maçã → maçãs. Manche Wörter ändern sich: cão → cães.', 'Di solito si aggiunge -s: maçã → maçãs. Alcune parole cambiano: cão → cães.']] }
    ],
    ro: [
      { title: ['Zahlen von 1 bis 10', 'Numeri da 1 a 10'], steps: [['Beim Zählen „unu“, vor Nomen „un“ (männlich) oder „o“ (weiblich): un câine, o pisică.', 'Quando conti «unu», davanti al nome «un» (maschile) o «o» (femminile): un câine, o pisică.'], ['Auch „doi“ hat eine weibliche Form: doi câini, două pisici.', 'Anche «doi» ha la forma femminile: doi câini, două pisici.']] },
      { title: ['Wie alt bist du?', 'Quanti anni hai?'], steps: [['Wie im Italienischen mit „haben“: „Am șapte ani.“', 'Come in italiano con «avere»: «Am șapte ani.»'], ['„am“ = ich habe.', '«am» = io ho.']], example: { text: 'Am șapte ani.', meaning: ['Ich bin sieben Jahre alt.', 'Ho sette anni.'] } },
      { title: ['Mehrzahl', 'Il plurale'], steps: [['Die Endung ändert sich: câine → câini, măr → mere.', 'Cambia la terminazione: câine → câini, măr → mere.']] }
    ],
    pl: [
      { title: ['Zahlen von 1 bis 10', 'Numeri da 1 a 10'], steps: [['„jeden“ ändert sich mit dem Geschlecht: jeden pies, jedna krowa, jedno jabłko.', '«jeden» cambia con il genere: jeden pies, jedna krowa, jedno jabłko.'], ['Nach 2, 3, 4 steht die Mehrzahl (dwa psy, trzy jabłka), ab 5 eine andere Form (pięć psów).', 'Dopo 2, 3, 4 si usa il plurale (dwa psy, trzy jabłka), da 5 in su un’altra forma (pięć psów).']] },
      { title: ['Wie alt bist du?', 'Quanti anni hai?'], steps: [['Polnisch benutzt „haben“: „Mam siedem lat.“', 'Il polacco usa «avere»: «Mam siedem lat.»'], ['„mam“ = ich habe, „lat“ = Jahre.', '«mam» = io ho, «lat» = anni.']], example: { text: 'Mam siedem lat.', meaning: ['Ich bin sieben Jahre alt.', 'Ho sette anni.'] } }
    ]
  },
  colori: {
    tr: [
      { title: ['Farbe vor dem Nomen', 'Il colore prima del nome'], steps: [['Die Farbe steht vor dem Nomen und ändert sich nie: kırmızı elma, mavi kuş.', 'Il colore va prima del nome e non cambia mai: kırmızı elma (mela rossa), mavi kuş.']] },
      { title: ['Ohne „ist“', 'Senza «è»'], steps: [['„Gökyüzü mavi.“ – wörtlich „Himmel blau“. Ein „ist“ braucht man nicht.', '«Gökyüzü mavi.» – parola per parola «cielo blu». Non serve «è».'], ['„En sevdiğim renk“ = meine Lieblingsfarbe („die Farbe, die ich am meisten mag“).', '«En sevdiğim renk» = il mio colore preferito («il colore che amo di più»).']], example: { text: 'Elma kırmızı.', meaning: ['Der Apfel ist rot.', 'La mela è rossa.'] } }
    ],
    pt: [
      { title: ['Farbe nach dem Nomen', 'Il colore dopo il nome'], steps: [['Wie im Italienischen steht die Farbe hinter dem Nomen: o lápis vermelho.', 'Come in italiano, il colore va dopo il nome: o lápis vermelho.'], ['Sie passt sich an: vermelho (männlich), vermelha (weiblich): a maçã vermelha.', 'Si accorda: vermelho (maschile), vermelha (femminile): a maçã vermelha.']], example: { text: 'A maçã é vermelha.', meaning: ['Der Apfel ist rot.', 'La mela è rossa.'] } },
      { title: ['Mein Lieblings…', 'Il mio preferito'], steps: [['„A minha cor preferida“ – vor „minha“ steht noch ein Artikel, wie im Italienischen „il mio“.', '«A minha cor preferida» – davanti a «minha» c’è l’articolo, come in italiano «il mio».']] }
    ],
    ro: [
      { title: ['Farbe nach dem Nomen', 'Il colore dopo il nome'], steps: [['Die Farbe steht hinter dem Nomen und passt sich an: mărul roșu, o pisică albă.', 'Il colore va dopo il nome e si accorda: mărul roșu, o pisică albă.']], example: { text: 'Cerul este albastru.', meaning: ['Der Himmel ist blau.', 'Il cielo è azzurro.'] } },
      { title: ['„este“ = ist', '«este» = è'], steps: [['„Mărul este roșu.“ – „este“ heißt „ist“, wie italienisch „è“.', '«Mărul este roșu.» – «este» vuol dire «è».'], ['„Culoarea mea preferată“ = meine Lieblingsfarbe – „mea“ (mein) steht hinter dem Nomen.', '«Culoarea mea preferată» = il mio colore preferito – «mea» (mio) va dopo il nome.']] }
    ],
    pl: [
      { title: ['Farben ändern ihre Endung', 'I colori cambiano terminazione'], steps: [['Männlich -y/-i, weiblich -a, sächlich -e: czerwony kot, czerwona krowa, czerwone jabłko.', 'Maschile -y/-i, femminile -a, neutro -e: czerwony kot, czerwona krowa, czerwone jabłko.'], ['Die Farbe steht meist vor dem Nomen.', 'Il colore di solito va prima del nome.']], example: { text: 'Jabłko jest czerwone.', meaning: ['Der Apfel ist rot.', 'La mela è rossa.'] } },
      { title: ['Mein Lieblings…', 'Il mio preferito'], steps: [['„Mój ulubiony kolor to zielony.“ – „to“ heißt hier „ist“.', '«Mój ulubiony kolor to zielony.» – qui «to» vuol dire «è».']] }
    ]
  },
  animali: {
    tr: [
      { title: ['Keine Artikel', 'Niente articoli'], steps: [['Im Türkischen gibt es kein „der/die/das“: köpek = Hund oder der Hund.', 'In turco non ci sono articoli: köpek = cane o il cane.'], ['„bir“ = ein/eine: bir kedi = eine Katze.', '«bir» = un/una: bir kedi = un gatto.']] },
      { title: ['Mehrzahl mit -ler / -lar', 'Plurale con -ler / -lar'], steps: [['Nach e, i, ö, ü kommt -ler (kediler), nach a, ı, o, u kommt -lar (kuşlar). Das nennt man Vokalharmonie.', 'Dopo e, i, ö, ü si aggiunge -ler (kediler), dopo a, ı, o, u si aggiunge -lar (kuşlar). Si chiama armonia vocalica.']] },
      { title: ['Ich habe …', 'Io ho …'], steps: [['„Bir kedim var.“ – wörtlich „eine Katze-meine gibt es“.', '«Bir kedim var.» – parola per parola «un gatto-mio c’è».'], ['„uçabilir“ = kann fliegen: „-abil“ heißt „können“.', '«uçabilir» = sa volare: «-abil» vuol dire «potere».']], example: { text: 'Bir kedim var.', meaning: ['Ich habe eine Katze.', 'Ho un gatto.'] } }
    ],
    pt: [
      { title: ['Der Artikel: o oder a', 'L’articolo: o oppure a'], steps: [['„o“ für männliche Nomen (o cão, o gato), „a“ für weibliche (a vaca).', '«o» per i nomi maschili (o cão, o gato), «a» per i femminili (a vaca).'], ['In der Mehrzahl: os gatos, as vacas.', 'Al plurale: os gatos, as vacas.']] },
      { title: ['Können', 'Sapere fare'], steps: [['„O pássaro sabe voar.“ – Für Fähigkeiten sagt man „saber“, wie im Italienischen „sa volare“.', '«O pássaro sabe voar.» – per le capacità si usa «saber», proprio come «sa volare».']], example: { text: 'O cão é grande.', meaning: ['Der Hund ist groß.', 'Il cane è grande.'] } }
    ],
    ro: [
      { title: ['Der Artikel hängt hinten dran', 'L’articolo va in fondo'], steps: [['„câine“ = Hund, „câinele“ = der Hund: Der bestimmte Artikel wird ans Wortende gehängt.', '«câine» = cane, «câinele» = il cane: l’articolo determinativo si attacca alla fine della parola.'], ['Weiblich: „pisică“ = Katze, „pisica“ = die Katze.', 'Femminile: «pisică» = gatto/gatta, «pisica» = la gatta.']], example: { text: 'Câinele este mare.', meaning: ['Der Hund ist groß.', 'Il cane è grande.'] } },
      { title: ['Ein, eine', 'Un, una'], steps: [['Der unbestimmte Artikel steht vorne: un cal, o vacă.', 'L’articolo indeterminativo va davanti: un cal, o vacă.'], ['„Pasărea poate zbura.“ = Der Vogel kann fliegen („poate“ = kann).', '«Pasărea poate zbura.» = l’uccello può volare («poate» = può).']] }
    ],
    pl: [
      { title: ['Keine Artikel', 'Niente articoli'], steps: [['Im Polnischen gibt es keine Artikel: pies = Hund oder der Hund.', 'In polacco non ci sono articoli: pies = cane o il cane.'], ['Das Geschlecht erkennst du oft am Ende: -a meist weiblich (krowa, ryba), Konsonant männlich (kot, koń).', 'Il genere si vede spesso dalla fine: -a di solito femminile (krowa, ryba), consonante maschile (kot, koń).']] },
      { title: ['Endungen ändern sich', 'Le terminazioni cambiano'], steps: [['„Mam kota.“ – Nach „mam“ (ich habe) wird aus „kot“ → „kota“.', '«Mam kota.» – dopo «mam» (ho) «kot» diventa «kota».'], ['„Ptak umie latać.“ = Der Vogel kann fliegen („umie“ = kann).', '«Ptak umie latać.» = l’uccello sa volare («umie» = sa).']], example: { text: 'Pies jest duży.', meaning: ['Der Hund ist groß.', 'Il cane è grande.'] } }
    ]
  },
  famiglia: {
    tr: [
      { title: ['Geschwister', 'Fratelli e sorelle'], steps: [['„kardeş“ = Geschwister. „erkek kardeş“ = Bruder (Junge), „kız kardeş“ = Schwester (Mädchen).', '«kardeş» = fratello o sorella. «erkek kardeş» = fratello (maschio), «kız kardeş» = sorella (femmina).']] },
      { title: ['Mein … mit einer Endung', '«Mio» con una terminazione'], steps: [['„anne“ = Mutter, „annem“ = meine Mutter. „-m“ / „-im“ heißt „mein“.', '«anne» = mamma, «annem» = la mia mamma. «-m» / «-im» vuol dire «mio».'], ['Das Verb steht am Satzende: „Ailemi seviyorum.“ = „Meine Familie liebe ich.“', 'Il verbo va alla fine della frase: «Ailemi seviyorum.» = «la mia famiglia amo».']], example: { text: 'Bu benim annem.', meaning: ['Das ist meine Mutter.', 'Questa è la mia mamma.'] } }
    ],
    pt: [
      { title: ['Mein, meine', 'Mio, mia'], steps: [['„o meu irmão“, „a minha irmã“ – mit Artikel davor, wie im Italienischen.', '«o meu irmão», «a minha irmã» – con l’articolo davanti, come in italiano.'], ['„os pais“ heißt die Eltern.', '«os pais» vuol dire i genitori.']], example: { text: 'Esta é a minha mãe.', meaning: ['Das ist meine Mutter.', 'Questa è la mia mamma.'] } },
      { title: ['Lieben', 'Amare'], steps: [['„Adoro a minha família.“ – „adorar“ heißt sehr gern haben.', '«Adoro a minha família.» – «adorar» vuol dire voler bene, adorare.']] }
    ],
    ro: [
      { title: ['Mein kommt hinterher', '«Mio» va dopo'], steps: [['„mama mea“ = meine Mutter, „fratele meu“ = mein Bruder.', '«mama mea» = la mia mamma, «fratele meu» = mio fratello.'], ['„Aceasta este …“ = Das ist … (bei weiblichen Wörtern).', '«Aceasta este …» = questa è …']], example: { text: 'Aceasta este mama mea.', meaning: ['Das ist meine Mutter.', 'Questa è la mia mamma.'] } },
      { title: ['Ich habe …', 'Io ho …'], steps: [['„Am un frate.“ = Ich habe einen Bruder – „am“ = ich habe.', '«Am un frate.» = ho un fratello – «am» = ho.']] }
    ],
    pl: [
      { title: ['Mein, meine', 'Mio, mia'], steps: [['„mój“ für männliche (mój brat), „moja“ für weibliche Wörter (moja mama).', '«mój» per i nomi maschili (mój brat), «moja» per i femminili (moja mama).'], ['„To jest …“ = Das ist …', '«To jest …» = questo è …']], example: { text: 'To jest moja mama.', meaning: ['Das ist meine Mutter.', 'Questa è la mia mamma.'] } },
      { title: ['Endungen nach dem Verb', 'Terminazioni dopo il verbo'], steps: [['„Mam brata.“ – aus „brat“ wird „brata“.', '«Mam brata.» – «brat» diventa «brata».'], ['„Kocham moją rodzinę.“ – aus „rodzina“ wird „rodzinę“.', '«Kocham moją rodzinę.» – «rodzina» diventa «rodzinę».']] }
    ]
  },
  cibo: {
    tr: [
      { title: ['Hunger', 'La fame'], steps: [['„Karnım aç.“ – wörtlich „mein Bauch ist hungrig“.', '«Karnım aç.» – parola per parola «la mia pancia è affamata».']], example: { text: 'Karnım aç.', meaning: ['Ich habe Hunger.', 'Ho fame.'] } },
      { title: ['Ich möchte …', 'Vorrei …'], steps: [['„Su istiyorum, lütfen.“ – das Verb „istiyorum“ (ich möchte) steht am Ende.', '«Su istiyorum, lütfen.» – il verbo «istiyorum» (voglio) va alla fine.'], ['„Elmaları severim.“ = Ich mag Äpfel.', '«Elmaları severim.» = mi piacciono le mele.']] }
    ],
    pt: [
      { title: ['Hunger haben', 'Avere fame'], steps: [['„Tenho fome.“ – genau wie italienisch „ho fame“.', '«Tenho fome.» – proprio come «ho fame».']], example: { text: 'Tenho fome.', meaning: ['Ich habe Hunger.', 'Ho fame.'] } },
      { title: ['Höflich bestellen', 'Chiedere con gentilezza'], steps: [['„Queria água, por favor.“ – „queria“ = ich hätte gern.', '«Queria água, por favor.» – «queria» = vorrei.'], ['„Gosto de maçãs.“ – nach „gosto“ (ich mag) kommt immer „de“.', '«Gosto de maçãs.» – dopo «gosto» (mi piace) ci va sempre «de».']] }
    ],
    ro: [
      { title: ['Mir ist …', 'Mi è …'], steps: [['„Mi-e foame.“ – wörtlich „mir ist Hunger“.', '«Mi-e foame.» – parola per parola «mi è fame».'], ['„Aș vrea apă.“ = Ich hätte gern Wasser.', '«Aș vrea apă.» = vorrei dell’acqua.']] },
      { title: ['Mögen', 'Piacere'], steps: [['„Îmi plac merele.“ – wie im Italienischen „mi piacciono le mele“.', '«Îmi plac merele.» – proprio come «mi piacciono le mele».']], example: { text: 'Îmi plac merele.', meaning: ['Ich mag Äpfel.', 'Mi piacciono le mele.'] } }
    ],
    pl: [
      { title: ['Hunger', 'La fame'], steps: [['„Jestem głodny.“ sagt ein Junge, „Jestem głodna.“ ein Mädchen.', '«Jestem głodny.» lo dice un maschio, «Jestem głodna.» una femmina.']], example: { text: 'Jestem głodny.', meaning: ['Ich habe Hunger.', 'Ho fame.'] } },
      { title: ['Höflich bitten', 'Chiedere con gentilezza'], steps: [['„Poproszę wodę.“ = Ich hätte gern Wasser – aus „woda“ wird „wodę“.', '«Poproszę wodę.» = vorrei dell’acqua – «woda» diventa «wodę».'], ['„Lubię jabłka.“ = Ich mag Äpfel.', '«Lubię jabłka.» = mi piacciono le mele.']] }
    ]
  },
  scuola: {
    tr: [
      { title: ['Wohin? Mit -a / -e', 'Dove vado? Con -a / -e'], steps: [['„okul“ = Schule, „okula“ = zur Schule.', '«okul» = scuola, «okula» = a scuola.']], example: { text: 'Okula gidiyorum.', meaning: ['Ich gehe zur Schule.', 'Vado a scuola.'] } },
      { title: ['Wo ist …?', 'Dov’è …?'], steps: [['„nerede“ = wo. Es steht am Satzende: „Kitabım nerede?“', '«nerede» = dove. Va alla fine della frase: «Kitabım nerede?»'], ['Aus „kitap“ wird „kitabım“ (mein Buch): p wird zu b.', '«kitap» diventa «kitabım» (il mio libro): la p diventa b.']] }
    ],
    pt: [
      { title: ['Wohin gehst du?', 'Dove vai?'], steps: [['„Vou para a escola.“ – „vou“ = ich gehe, „para“ = nach/zu.', '«Vou para a escola.» – «vou» = vado, «para» = verso/a.']], example: { text: 'Vou para a escola.', meaning: ['Ich gehe zur Schule.', 'Vado a scuola.'] } },
      { title: ['Wo ist …?', 'Dov’è …?'], steps: [['„Onde está o meu livro?“ – „onde“ = wo, „está“ = ist.', '«Onde está o meu livro?» – «onde» = dove, «está» = è/si trova.']] }
    ],
    ro: [
      { title: ['Zur Schule', 'A scuola'], steps: [['„Merg la școală.“ – nach „la“ (zu) verliert das Wort den Artikel: școala → la școală.', '«Merg la școală.» – dopo «la» (a) la parola perde l’articolo: școala → la școală.']], example: { text: 'Merg la școală.', meaning: ['Ich gehe zur Schule.', 'Vado a scuola.'] } },
      { title: ['Wo ist …?', 'Dov’è …?'], steps: [['„Unde este cartea mea?“ – „unde“ = wo.', '«Unde este cartea mea?» – «unde» = dove.']] }
    ],
    pl: [
      { title: ['Zur Schule', 'A scuola'], steps: [['„Idę do szkoły.“ – nach „do“ (zu) wird aus „szkoła“ → „szkoły“.', '«Idę do szkoły.» – dopo «do» (a) «szkoła» diventa «szkoły».']], example: { text: 'Idę do szkoły.', meaning: ['Ich gehe zur Schule.', 'Vado a scuola.'] } },
      { title: ['Wo ist …?', 'Dov’è …?'], steps: [['„Gdzie jest moja książka?“ – „gdzie“ = wo.', '«Gdzie jest moja książka?» – «gdzie» = dove.']] }
    ]
  },
  frasi: {
    tr: [
      { title: ['Nein sagen mit -ma / -me', 'Dire di no con -ma / -me'], steps: [['Die Verneinung steckt im Verb: „anlıyorum“ = ich verstehe, „anlamıyorum“ = ich verstehe nicht.', 'La negazione è dentro il verbo: «anlıyorum» = capisco, «anlamıyorum» = non capisco.']], example: { text: 'Anlamıyorum.', meaning: ['Ich verstehe nicht.', 'Non capisco.'] } },
      { title: ['Feste Ausdrücke', 'Espressioni fisse'], steps: [['„İyi ki doğdun!“ = Alles Gute zum Geburtstag – wörtlich „Gut, dass du geboren bist!“.', '«İyi ki doğdun!» = buon compleanno – parola per parola «meno male che sei nato!».'], ['„Afiyet olsun!“ = Guten Appetit! „Birlikte oynayalım!“ = Lass uns zusammen spielen!', '«Afiyet olsun!» = buon appetito! «Birlikte oynayalım!» = giochiamo insieme!']] }
    ],
    pt: [
      { title: ['Nein sagen', 'Dire di no'], steps: [['„não“ steht vor dem Verb, wie italienisch „non“: „Não sei.“, „Não percebo.“', '«não» va prima del verbo, come «non»: «Não sei.», «Não percebo.»']], example: { text: 'Não percebo.', meaning: ['Ich verstehe nicht.', 'Non capisco.'] } },
      { title: ['Feste Ausdrücke', 'Espressioni fisse'], steps: [['„Parabéns!“ = Alles Gute (zum Geburtstag)! „Bom apetite!“ = Guten Appetit!', '«Parabéns!» = auguri / buon compleanno! «Bom apetite!» = buon appetito!'], ['„Vamos brincar juntos!“ – „vamos“ + Verb = Lass uns …', '«Vamos brincar juntos!» – «vamos» + verbo = «andiamo a…», «facciamo…».']] }
    ],
    ro: [
      { title: ['Nein sagen', 'Dire di no'], steps: [['„nu“ steht vor dem Verb, wie italienisch „non“: „Nu știu.“, „Nu înțeleg.“', '«nu» va prima del verbo, come «non»: «Nu știu.», «Nu înțeleg.»']], example: { text: 'Nu înțeleg.', meaning: ['Ich verstehe nicht.', 'Non capisco.'] } },
      { title: ['Feste Ausdrücke', 'Espressioni fisse'], steps: [['„La mulți ani!“ = Alles Gute zum Geburtstag – wörtlich „Auf viele Jahre!“.', '«La mulți ani!» = buon compleanno – parola per parola «a molti anni!».'], ['„Hai să ne jucăm împreună!“ – „Hai să …“ = Komm, lass uns …', '«Hai să ne jucăm împreună!» – «Hai să …» = «dai, …».']] }
    ],
    pl: [
      { title: ['Nein sagen', 'Dire di no'], steps: [['„nie“ steht vor dem Verb: „Nie wiem.“, „Nie rozumiem.“', '«nie» va prima del verbo, come «non»: «Nie wiem.», «Nie rozumiem.»']], example: { text: 'Nie rozumiem.', meaning: ['Ich verstehe nicht.', 'Non capisco.'] } },
      { title: ['Feste Ausdrücke', 'Espressioni fisse'], steps: [['„Smacznego!“ = Guten Appetit! „Wszystkiego najlepszego!“ = Alles Gute!', '«Smacznego!» = buon appetito! «Wszystkiego najlepszego!» = tanti auguri!'], ['„Przepraszam“ = Entschuldigung – auch um etwas zu fragen.', '«Przepraszam» = scusi / mi scusi – anche per chiedere qualcosa.']] }
    ]
  }
};
