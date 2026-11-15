/**
 * Weitere Kurssprachen: Arabisch, Russisch, Niederländisch, Griechisch.
 * Gleiche Reihenfolge wie Wörter und Sätze in data.ts.
 * Jede Zeile: Arabisch | Arabisch in lateinischer Umschrift | Russisch | Niederländisch | Griechisch.
 * Arabisch ohne Vokalzeichen, wie es die Spracherkennung zurückgibt.
 */
export type ExtraLang2 = 'ar' | 'ru' | 'nl' | 'el';

export const EXTRA2: Record<string, { words: string[]; sentences: string[] }> = {
  saluti: {
    words: [
      'مرحبا | marhaban | Привет | Hallo | Γεια σου',
      'صباح الخير | sabah al-khayr | Доброе утро | Goedemorgen | Καλημέρα',
      'تصبح على خير | tusbih ala khayr | Спокойной ночи | Goedenacht | Καληνύχτα',
      'مع السلامة | maa as-salama | До свидания | Dag | Αντίο',
      'شكرا | shukran | Спасибо | Dank je | Ευχαριστώ',
      'من فضلك | min fadlik | Пожалуйста | Alsjeblieft | Παρακαλώ',
      'نعم | naam | Да | Ja | Ναι',
      'لا | la | Нет | Nee | Όχι'
    ],
    sentences: [
      'كيف حالك؟ | kayfa haluk? | Как дела? | Hoe gaat het? | Τι κάνεις;',
      'أنا بخير، شكرا. | ana bikhayr, shukran. | Хорошо, спасибо. | Goed, dank je. | Είμαι καλά, ευχαριστώ.',
      'اسمي آنا. | ismi Anna. | Меня зовут Анна. | Ik heet Anna. | Με λένε Άννα.'
    ]
  },
  numeri: {
    words: [
      'واحد | wahid | один | één | ένα',
      'اثنان | ithnan | два | twee | δύο',
      'ثلاثة | thalatha | три | drie | τρία',
      'أربعة | arbaa | четыре | vier | τέσσερα',
      'خمسة | khamsa | пять | vijf | πέντε',
      'ستة | sitta | шесть | zes | έξι',
      'سبعة | sabaa | семь | zeven | επτά',
      'ثمانية | thamaniya | восемь | acht | οκτώ',
      'تسعة | tisaa | девять | negen | εννέα',
      'عشرة | ashara | десять | tien | δέκα'
    ],
    sentences: [
      'عمري سبع سنوات. | umri saba sanawat. | Мне семь лет. | Ik ben zeven jaar. | Είμαι επτά χρονών.',
      'عندي كلبان. | indi kalban. | У меня две собаки. | Ik heb twee honden. | Έχω δύο σκύλους.',
      'ثلاث تفاحات من فضلك. | thalath tuffahat min fadlik. | Три яблока, пожалуйста. | Drie appels, alsjeblieft. | Τρία μήλα, παρακαλώ.'
    ]
  },
  colori: {
    words: [
      'أحمر | ahmar | красный | rood | κόκκινο',
      'أزرق | azraq | синий | blauw | μπλε',
      'أخضر | akhdar | зелёный | groen | πράσινο',
      'أصفر | asfar | жёлтый | geel | κίτρινο',
      'أسود | aswad | чёрный | zwart | μαύρο',
      'أبيض | abyad | белый | wit | άσπρο',
      'برتقالي | burtuqali | оранжевый | oranje | πορτοκαλί',
      'وردي | wardi | розовый | roze | ροζ'
    ],
    sentences: [
      'السماء زرقاء. | as-samaa zarqaa. | Небо голубое. | De lucht is blauw. | Ο ουρανός είναι μπλε.',
      'التفاحة حمراء. | at-tuffaha hamraa. | Яблоко красное. | De appel is rood. | Το μήλο είναι κόκκινο.',
      'لوني المفضل هو الأخضر. | lawni al-mufaddal huwa al-akhdar. | Мой любимый цвет зелёный. | Mijn lievelingskleur is groen. | Το αγαπημένο μου χρώμα είναι το πράσινο.'
    ]
  },
  animali: {
    words: [
      'كلب | kalb | собака | de hond | ο σκύλος',
      'قطة | qitta | кошка | de kat | η γάτα',
      'طائر | tair | птица | de vogel | το πουλί',
      'سمكة | samaka | рыба | de vis | το ψάρι',
      'حصان | hisan | лошадь | het paard | το άλογο',
      'بقرة | baqara | корова | de koe | η αγελάδα',
      'أرنب | arnab | кролик | het konijn | το κουνέλι',
      'فأر | far | мышь | de muis | το ποντίκι'
    ],
    sentences: [
      'عندي قطة. | indi qitta. | У меня есть кошка. | Ik heb een kat. | Έχω μια γάτα.',
      'الكلب كبير. | al-kalb kabir. | Собака большая. | De hond is groot. | Ο σκύλος είναι μεγάλος.',
      'الطائر يستطيع أن يطير. | at-tair yastati an yatir. | Птица умеет летать. | De vogel kan vliegen. | Το πουλί μπορεί να πετάξει.'
    ]
  },
  famiglia: {
    words: [
      'أم | umm | мама | de moeder | η μαμά',
      'أب | ab | папа | de vader | ο μπαμπάς',
      'أخ | akh | брат | de broer | ο αδελφός',
      'أخت | ukht | сестра | de zus | η αδελφή',
      'جدة | jadda | бабушка | de oma | η γιαγιά',
      'جد | jadd | дедушка | de opa | ο παππούς',
      'طفل رضيع | tifl radi | малыш | de baby | το μωρό',
      'عائلة | aila | семья | de familie | η οικογένεια'
    ],
    sentences: [
      'هذه أمي. | hadhihi ummi. | Это моя мама. | Dit is mijn moeder. | Αυτή είναι η μαμά μου.',
      'عندي أخ. | indi akh. | У меня есть брат. | Ik heb een broer. | Έχω έναν αδελφό.',
      'أحب عائلتي. | uhibbu ailati. | Я люблю свою семью. | Ik hou van mijn familie. | Αγαπώ την οικογένειά μου.'
    ]
  },
  cibo: {
    words: [
      'تفاحة | tuffaha | яблоко | de appel | το μήλο',
      'خبز | khubz | хлеб | het brood | το ψωμί',
      'حليب | halib | молоко | de melk | το γάλα',
      'ماء | maa | вода | het water | το νερό',
      'جبن | jubn | сыр | de kaas | το τυρί',
      'موزة | mawza | банан | de banaan | η μπανάνα',
      'بيضة | bayda | яйцо | het ei | το αυγό',
      'كعكة | kaaka | торт | de taart | η τούρτα'
    ],
    sentences: [
      'أنا جائع. | ana jai. | Я голоден. | Ik heb honger. | Έχω πείνα.',
      'أريد ماء من فضلك. | urid maa min fadlik. | Я хочу воды, пожалуйста. | Ik wil graag water. | Θέλω νερό, παρακαλώ.',
      'أحب التفاح. | uhibbu at-tuffah. | Я люблю яблоки. | Ik hou van appels. | Μου αρέσουν τα μήλα.'
    ]
  },
  scuola: {
    words: [
      'كتاب | kitab | книга | het boek | το βιβλίο',
      'قلم حبر | qalam hibr | ручка | de pen | το στυλό',
      'قلم رصاص | qalam rasas | карандаш | het potlood | το μολύβι',
      'حقيبة مدرسية | haqiba madrasiya | рюкзак | de schooltas | η σχολική τσάντα',
      'مدرسة | madrasa | школа | de school | το σχολείο',
      'معلمة | muallima | учительница | de juf | η δασκάλα',
      'كرسي | kursi | стул | de stoel | η καρέκλα',
      'مسطرة | mistara | линейка | de liniaal | ο χάρακας'
    ],
    sentences: [
      'أذهب إلى المدرسة. | adhhabu ila al-madrasa. | Я иду в школу. | Ik ga naar school. | Πηγαίνω στο σχολείο.',
      'أين كتابي؟ | ayna kitabi? | Где моя книга? | Waar is mijn boek? | Πού είναι το βιβλίο μου;',
      'عندي قلم رصاص أحمر. | indi qalam rasas ahmar. | У меня есть красный карандаш. | Ik heb een rood potlood. | Έχω ένα κόκκινο μολύβι.'
    ]
  },
  frasi: {
    words: [
      'عذرا | udhran | Извините | Sorry | Συγγνώμη',
      'لا أعرف. | la arif. | Я не знаю. | Ik weet het niet. | Δεν ξέρω.',
      'النجدة! | an-najda! | Помогите! | Help! | Βοήθεια!',
      'عيد ميلاد سعيد! | id milad said! | С днём рождения! | Gefeliciteerd! | Χρόνια πολλά!',
      'بالهناء والشفاء! | bil-hanaa wash-shifaa! | Приятного аппетита! | Eet smakelijk! | Καλή όρεξη!',
      'تشرفنا. | tasharrafna. | Очень приятно. | Leuk je te ontmoeten. | Χάρηκα.',
      'رائع! | rai! | Отлично! | Super! | Τέλεια!',
      'هل يمكنك أن تعيد من فضلك؟ | hal yumkinuka an tuid min fadlik? | Можешь повторить, пожалуйста? | Kun je dat herhalen, alsjeblieft? | Μπορείς να το επαναλάβεις, παρακαλώ;'
    ],
    sentences: [
      'أين الحمام؟ | ayna al-hammam? | Где туалет? | Waar is de wc? | Πού είναι η τουαλέτα;',
      'لا أفهم. | la afham. | Я не понимаю. | Ik begrijp het niet. | Δεν καταλαβαίνω.',
      'هيا نلعب معا! | hayya nalab maan! | Давай играть вместе! | Laten we samen spelen! | Ας παίξουμε μαζί!'
    ]
  }
};

/** Arabischer Text → lateinische Umschrift (für Kinder, die die Schrift noch nicht lesen). */
export const AR_LATIN = new Map<string, string>();

export function extraRow2(line: string): Record<ExtraLang2, string> {
  const [ar, arLat, ru, nl, el] = line.split('|').map((x) => x.trim());
  AR_LATIN.set(ar!, arLat!);
  return { ar: ar!, ru: ru!, nl: nl!, el: el! };
}

const RU: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
};
const EL: Record<string, string> = {
  α: 'a', ά: 'á', β: 'v', γ: 'g', δ: 'd', ε: 'e', έ: 'é', ζ: 'z', η: 'i', ή: 'í', θ: 'th', ι: 'i', ί: 'í', ϊ: 'i',
  κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', ό: 'ó', π: 'p', ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'y', ύ: 'ý',
  φ: 'f', χ: 'ch', ψ: 'ps', ω: 'o', ώ: 'ó'
};
const EL_PAIRS: [RegExp, string][] = [[/ου/g, 'ou'], [/ού/g, 'oú'], [/αι/g, 'e'], [/αί/g, 'é'], [/ει/g, 'i'], [/εί/g, 'í'], [/οι/g, 'i'], [/οί/g, 'í'], [/μπ/g, 'b'], [/ντ/g, 'nt'], [/γγ/g, 'ng'], [/τσ/g, 'ts']];

function mapChars(text: string, table: Record<string, string>): string {
  return [...text].map((ch) => {
    const low = ch.toLowerCase();
    const out = table[low];
    if (out === undefined) return ch;
    return ch !== low && out ? out[0]!.toUpperCase() + out.slice(1) : out;
  }).join('');
}

/** Lateinische Umschrift für Sprachen mit anderer Schrift, sonst null. */
export function romanize(text: string, lang: string): string | null {
  const l = lang.slice(0, 2);
  if (l === 'ar') return AR_LATIN.get(text) ?? null;
  if (l === 'ru') return mapChars(text, RU);
  if (l === 'el') {
    let s = text;
    for (const [re, rep] of EL_PAIRS) s = s.replace(re, rep);
    return mapChars(s, EL);
  }
  return null;
}
