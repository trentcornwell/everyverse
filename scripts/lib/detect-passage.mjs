// Shared by every sync script (YouTube, SermonAudio, ...): detects a Bible
// book/chapter mentioned in one or more pieces of text (title, description,
// a structured "bibleText" field, etc.).
//
// Keep BOOKS in sync with lib/bible-data.ts's BOOKS list. Duplicated here so
// these standalone scripts have no dependency on the TypeScript build.

const BOOKS = [
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
].sort((a, b) => b.length - a.length); // longest/most specific first (e.g. "1 John" before "John")

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Searches each text in order, returns the first book+chapter match found.
export function detectPassage(...texts) {
  for (const text of texts) {
    if (!text) continue;
    for (const book of BOOKS) {
      const re = new RegExp(`\\b${escapeRegex(book)}\\s+(\\d{1,3})\\b`, "i");
      const match = text.match(re);
      if (match) {
        return { book, chapter: Number(match[1]) };
      }
    }
  }
  return { book: undefined, chapter: undefined };
}
