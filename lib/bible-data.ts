// Sample KJV verse data.
// This is a small hand-picked set of well-known verses so the /verse route has
// something real to render. It will be replaced by a full KJV dataset backed
// by a database once that's wired up.

export const BOOKS: string[] = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
  "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation",
];

type ChapterMap = Record<number, Record<number, string>>;

const KJV_SAMPLE: Record<string, ChapterMap> = {
  genesis: {
    1: {
      1: "In the beginning God created the heaven and the earth.",
      2: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
      3: "And God said, Let there be light: and there was light.",
    },
  },
  psalms: {
    23: {
      1: "The LORD is my shepherd; I shall not want.",
      2: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      3: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      4: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
      5: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
      6: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.",
    },
    119: {
      105: "Thy word is a lamp unto my feet, and a light unto my path.",
    },
  },
  proverbs: {
    3: {
      5: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
      6: "In all thy ways acknowledge him, and he shall direct thy paths.",
    },
  },
  isaiah: {
    40: {
      31: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    },
  },
  jeremiah: {
    29: {
      11: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    },
  },
  matthew: {
    28: {
      19: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:",
      20: "Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.",
    },
  },
  john: {
    1: {
      1: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    },
    3: {
      16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    },
  },
  romans: {
    8: {
      28: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    },
    12: {
      2: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.",
    },
  },
  "1-corinthians": {
    13: {
      4: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,",
      5: "Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;",
      6: "Rejoiceth not in iniquity, but rejoiceth in the truth;",
      7: "Beareth all things, believeth all things, hopeth all things, endureth all things.",
    },
  },
  galatians: {
    5: {
      22: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith,",
      23: "Meekness, temperance: against such there is no law.",
    },
  },
  ephesians: {
    2: {
      8: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:",
      9: "Not of works, lest any man should boast.",
    },
  },
  philippians: {
    4: {
      6: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
      7: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
      13: "I can do all things through Christ which strengtheneth me.",
    },
  },
  "2-timothy": {
    3: {
      16: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness:",
    },
  },
  hebrews: {
    11: {
      1: "Now faith is the substance of things hoped for, the evidence of things not seen.",
    },
  },
  james: {
    1: {
      2: "My brethren, count it all joy when ye fall into divers temptations;",
      3: "Knowing this, that the trying of your faith worketh patience.",
    },
  },
  "1-peter": {
    5: {
      7: "Casting all your care upon him; for he careth for you.",
    },
  },
  revelation: {
    21: {
      4: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
    },
  },
};

export function slugifyBook(book: string): string {
  return book
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function bookSlugToDisplayName(slug: string): string | undefined {
  const normalized = slug.trim().toLowerCase();
  return BOOKS.find((b) => slugifyBook(b) === normalized);
}

export interface VerseLookupResult {
  found: boolean;
  book: string;
  chapter: number;
  verse: number;
  text: string | null;
}

export function getVerseText(
  bookSlug: string,
  chapter: number,
  verse: number
): VerseLookupResult {
  const displayName = bookSlugToDisplayName(bookSlug);
  const chapters = KJV_SAMPLE[bookSlug.toLowerCase()];
  const text = chapters?.[chapter]?.[verse];

  return {
    found: Boolean(displayName && text),
    book: displayName ?? bookSlug,
    chapter,
    verse,
    text: text ?? null,
  };
}

// A short list of verses to feature as examples (e.g. on the landing page).
export const FEATURED_VERSES = [
  { book: "John", chapter: 3, verse: 16 },
  { book: "Psalms", chapter: 23, verse: 1 },
  { book: "Philippians", chapter: 4, verse: 13 },
  { book: "Romans", chapter: 8, verse: 28 },
];
