import "server-only";

// Full 1769 King James Version text (public domain), from the `es-kjv`
// package -- keyed "Book Chapter:Verse", e.g. "Genesis 6:1". This is a large
// (~4.7MB) static dataset, so it's kept out of lib/bible-data.ts (which is
// imported by client components) and marked server-only so it can never end
// up in a client bundle.
import { verses } from "es-kjv";
import { bookSlugToDisplayName } from "./bible-data";

// The one place this dataset's book names disagree with this site's own
// (lib/bible-data.ts BOOKS) naming.
const KJV_BOOK_NAME_OVERRIDES: Record<string, string> = {
  "Song of Solomon": "Solomon's Song",
};

export interface ChapterVerse {
  verse: number;
  html: string;
  newParagraph: boolean;
}

// Source text marks a new paragraph with a leading "# ", and translator-
// supplied (not in the original languages) words with [brackets] -- both are
// standard KJV print conventions, rendered here as italics.
function formatVerse(raw: string): { html: string; newParagraph: boolean } {
  const newParagraph = raw.startsWith("#");
  const withoutMarker = newParagraph ? raw.replace(/^#\s*/, "") : raw;
  const html = withoutMarker.replace(/\[([^\]]+)\]/g, "<em>$1</em>");
  return { html, newParagraph };
}

export function getChapterVerses(bookSlug: string, chapter: number): ChapterVerse[] | null {
  const displayName = bookSlugToDisplayName(bookSlug);
  if (!displayName) return null;

  const kjvBookName = KJV_BOOK_NAME_OVERRIDES[displayName] ?? displayName;
  const result: ChapterVerse[] = [];

  for (let v = 1; ; v++) {
    const raw = verses[`${kjvBookName} ${chapter}:${v}`];
    if (raw === undefined) break;
    const { html, newParagraph } = formatVerse(raw);
    result.push({ verse: v, html, newParagraph });
  }

  return result.length > 0 ? result : null;
}
