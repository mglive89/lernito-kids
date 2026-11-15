/**
 * Weitere Kurssprachen: Türkisch, Portugiesisch, Rumänisch, Polnisch.
 * Gleiche Reihenfolge wie Wörter und Sätze in data.ts.
 * Jede Zeile: Türkisch | Portugiesisch | Rumänisch | Polnisch.
 */
export type ExtraLang = 'tr' | 'pt' | 'ro' | 'pl';
export const EXTRA_LANGS: ExtraLang[] = ['tr', 'pt', 'ro', 'pl'];

export const EXTRA: Record<string, { words: string[]; sentences: string[] }> = {
  saluti: {
    words: [
      'Merhaba | Olá | Salut | Cześć',
      'Günaydın | Bom dia | Bună dimineața | Dzień dobry',
      'İyi geceler | Boa noite | Noapte bună | Dobranoc',
      'Hoşça kal | Adeus | La revedere | Do widzenia',
      'Teşekkürler | Obrigado | Mulțumesc | Dziękuję',
      'Lütfen | Por favor | Te rog | Proszę',
      'Evet | Sim | Da | Tak',
      'Hayır | Não | Nu | Nie'
    ],
    sentences: [
      'Nasılsın? | Como estás? | Ce faci? | Jak się masz?',
      'İyiyim, teşekkürler. | Estou bem, obrigado. | Sunt bine, mulțumesc. | Dobrze, dziękuję.',
      'Benim adım Anna. | Chamo-me Anna. | Mă numesc Anna. | Mam na imię Anna.'
    ]
  },
  numeri: {
    words: [
      'bir | um | unu | jeden',
      'iki | dois | doi | dwa',
      'üç | três | trei | trzy',
      'dört | quatro | patru | cztery',
      'beş | cinco | cinci | pięć',
      'altı | seis | șase | sześć',
      'yedi | sete | șapte | siedem',
      'sekiz | oito | opt | osiem',
      'dokuz | nove | nouă | dziewięć',
      'on | dez | zece | dziesięć'
    ],
    sentences: [
      'Yedi yaşındayım. | Tenho sete anos. | Am șapte ani. | Mam siedem lat.',
      'İki köpeğim var. | Tenho dois cães. | Am doi câini. | Mam dwa psy.',
      'Üç elma, lütfen. | Três maçãs, por favor. | Trei mere, te rog. | Trzy jabłka, proszę.'
    ]
  },
  colori: {
    words: [
      'kırmızı | vermelho | roșu | czerwony',
      'mavi | azul | albastru | niebieski',
      'yeşil | verde | verde | zielony',
      'sarı | amarelo | galben | żółty',
      'siyah | preto | negru | czarny',
      'beyaz | branco | alb | biały',
      'turuncu | laranja | portocaliu | pomarańczowy',
      'pembe | cor-de-rosa | roz | różowy'
    ],
    sentences: [
      'Gökyüzü mavi. | O céu é azul. | Cerul este albastru. | Niebo jest niebieskie.',
      'Elma kırmızı. | A maçã é vermelha. | Mărul este roșu. | Jabłko jest czerwone.',
      'En sevdiğim renk yeşil. | A minha cor preferida é o verde. | Culoarea mea preferată este verde. | Mój ulubiony kolor to zielony.'
    ]
  },
  animali: {
    words: [
      'köpek | o cão | câinele | pies',
      'kedi | o gato | pisica | kot',
      'kuş | o pássaro | pasărea | ptak',
      'balık | o peixe | peștele | ryba',
      'at | o cavalo | calul | koń',
      'inek | a vaca | vaca | krowa',
      'tavşan | o coelho | iepurele | królik',
      'fare | o rato | șoarecele | mysz'
    ],
    sentences: [
      'Bir kedim var. | Tenho um gato. | Am o pisică. | Mam kota.',
      'Köpek büyük. | O cão é grande. | Câinele este mare. | Pies jest duży.',
      'Kuş uçabilir. | O pássaro sabe voar. | Pasărea poate zbura. | Ptak umie latać.'
    ]
  },
  famiglia: {
    words: [
      'anne | a mãe | mama | mama',
      'baba | o pai | tata | tata',
      'erkek kardeş | o irmão | fratele | brat',
      'kız kardeş | a irmã | sora | siostra',
      'büyükanne | a avó | bunica | babcia',
      'büyükbaba | o avô | bunicul | dziadek',
      'bebek | o bebé | bebelușul | niemowlę',
      'aile | a família | familia | rodzina'
    ],
    sentences: [
      'Bu benim annem. | Esta é a minha mãe. | Aceasta este mama mea. | To jest moja mama.',
      'Bir erkek kardeşim var. | Tenho um irmão. | Am un frate. | Mam brata.',
      'Ailemi seviyorum. | Adoro a minha família. | Îmi iubesc familia. | Kocham moją rodzinę.'
    ]
  },
  cibo: {
    words: [
      'elma | a maçã | mărul | jabłko',
      'ekmek | o pão | pâinea | chleb',
      'süt | o leite | laptele | mleko',
      'su | a água | apa | woda',
      'peynir | o queijo | brânza | ser',
      'muz | a banana | banana | banan',
      'yumurta | o ovo | oul | jajko',
      'pasta | o bolo | prăjitura | ciasto'
    ],
    sentences: [
      'Karnım aç. | Tenho fome. | Mi-e foame. | Jestem głodny.',
      'Su istiyorum, lütfen. | Queria água, por favor. | Aș vrea apă, te rog. | Poproszę wodę.',
      'Elmaları severim. | Gosto de maçãs. | Îmi plac merele. | Lubię jabłka.'
    ]
  },
  scuola: {
    words: [
      'kitap | o livro | cartea | książka',
      'tükenmez kalem | a caneta | pixul | długopis',
      'kurşun kalem | o lápis | creionul | ołówek',
      'okul çantası | a mochila | ghiozdanul | tornister',
      'okul | a escola | școala | szkoła',
      'öğretmen | a professora | învățătoarea | nauczycielka',
      'sandalye | a cadeira | scaunul | krzesło',
      'cetvel | a régua | rigla | linijka'
    ],
    sentences: [
      'Okula gidiyorum. | Vou para a escola. | Merg la școală. | Idę do szkoły.',
      'Kitabım nerede? | Onde está o meu livro? | Unde este cartea mea? | Gdzie jest moja książka?',
      'Kırmızı bir kalemim var. | Tenho um lápis vermelho. | Am un creion roșu. | Mam czerwony ołówek.'
    ]
  },
  frasi: {
    words: [
      'Affedersiniz | Desculpe | Scuzați-mă | Przepraszam',
      'Bilmiyorum. | Não sei. | Nu știu. | Nie wiem.',
      'İmdat! | Socorro! | Ajutor! | Pomocy!',
      'İyi ki doğdun! | Parabéns! | La mulți ani! | Wszystkiego najlepszego!',
      'Afiyet olsun! | Bom apetite! | Poftă bună! | Smacznego!',
      'Memnun oldum. | Muito prazer. | Încântat de cunoștință. | Miło mi.',
      'Harika! | Ótimo! | Super! | Super!',
      'Tekrar eder misin, lütfen? | Podes repetir, por favor? | Poți repeta, te rog? | Możesz powtórzyć, proszę?'
    ],
    sentences: [
      'Tuvalet nerede? | Onde é a casa de banho? | Unde este toaleta? | Gdzie jest toaleta?',
      'Anlamıyorum. | Não percebo. | Nu înțeleg. | Nie rozumiem.',
      'Birlikte oynayalım! | Vamos brincar juntos! | Hai să ne jucăm împreună! | Pobawmy się razem!'
    ]
  }
};

export function extraRow(line: string): Record<ExtraLang, string> {
  const [tr, pt, ro, pl] = line.split('|').map((x) => x.trim());
  return { tr: tr!, pt: pt!, ro: ro!, pl: pl! };
}
