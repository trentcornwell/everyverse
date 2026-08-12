import "server-only";

// Reads synced sermon data from content/sermons/*.json (one file per
// source: youtube.json, sermonaudio.json, logos.json). Each file is
// regenerated wholesale by its own scheduled GitHub Action (see
// .github/workflows/sync-*-sermons.yml and scripts/sync-*-sermons.mjs) —
// there's no database, matching how study notes work elsewhere in this
// project.

import fs from "fs";
import path from "path";
import { BOOKS, slugifyBook } from "./bible-data";

const SERMONS_DIR = path.join(process.cwd(), "content", "sermons");

export type SermonSource = "youtube" | "sermonaudio" | "logos";

export interface Sermon {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  durationSeconds: number;
  url: string;
  speaker?: string;
  book?: string;
  chapter?: number;
  // Sermon notes/manuscript, synced from Logos. Rendered as trusted HTML
  // (Trent's own authored content, piped through a known parser — same
  // trust model as study notes, never user-submitted).
  notesHtml?: string;
  notesText?: string;
  // Logos series cover art (e.g. the "Book of Genesis" series graphic),
  // when this sermon belongs to a series that has custom cover art.
  seriesCoverImageUrl?: string;
  // True for manually-preserved sermons whose original source page has
  // since been deleted upstream -- `url` is only kept for reference, it
  // 404s, so it shouldn't be rendered as a clickable link.
  sourceRemoved?: boolean;
  source: SermonSource;
}

interface SourceFile {
  sermons: Omit<Sermon, "source">[];
}

function loadSource(filename: string, source: SermonSource): Sermon[] {
  const filePath = path.join(SERMONS_DIR, filename);
  if (!fs.existsSync(filePath)) return [];

  const data: SourceFile = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return (data.sermons ?? []).map((s) => ({ ...s, source }));
}

// Sermons by these speakers are excluded from the whole site. Checked
// against the structured `speaker` field where a source provides one
// (SermonAudio), and as a text match in the title/description otherwise
// (YouTube has no structured speaker field, but guest speakers are
// typically named in the description).
const EXCLUDED_SPEAKERS = ["Austin Gardner", "William Gardner"];

function mentionsExcludedSpeaker(sermon: Omit<Sermon, "source">): boolean {
  const haystack = `${sermon.speaker ?? ""} ${sermon.title} ${sermon.description}`.toLowerCase();
  return EXCLUDED_SPEAKERS.some((name) => haystack.includes(name.toLowerCase()));
}

export function getAllSermons(): Sermon[] {
  const sermons = [
    ...loadSource("youtube.json", "youtube"),
    ...loadSource("sermonaudio.json", "sermonaudio"),
    ...loadSource("logos.json", "logos"),
  ].filter((s) => !mentionsExcludedSpeaker(s));

  return sermons.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export interface SermonGroup {
  book: string;
  sermons: Sermon[];
}

// Grouped in canonical Bible order, with anything that couldn't be matched
// to a book collected at the end.
export function getSermonsGroupedByBook(): SermonGroup[] {
  const all = getAllSermons();
  const byBook = new Map<string, Sermon[]>();
  const uncategorized: Sermon[] = [];

  for (const sermon of all) {
    if (sermon.book) {
      const list = byBook.get(sermon.book) ?? [];
      list.push(sermon);
      byBook.set(sermon.book, list);
    } else {
      uncategorized.push(sermon);
    }
  }

  const groups: SermonGroup[] = BOOKS.filter((book) => byBook.has(book)).map(
    (book) => ({ book, sermons: byBook.get(book)! })
  );

  if (uncategorized.length > 0) {
    groups.push({ book: "Uncategorized", sermons: uncategorized });
  }

  return groups;
}

export function getSermonById(id: string): Sermon | undefined {
  return getAllSermons().find((s) => s.id === id);
}

// How close together (in time) two synced entries need to be to count as
// the same real sermon -- e.g. a YouTube upload and its SermonAudio upload
// of the same Sunday message often land a day or two apart.
const SAME_SERMON_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
// How far back "sustained recent activity" is measured from, and how many
// distinct occurrences within that window count as "sustained."
const CURRENT_BOOK_LOOKBACK_MS = 60 * 24 * 60 * 60 * 1000;
const CURRENT_BOOK_MIN_OCCURRENCES = 2;

// The homepage's "latest sermon" is specifically the most recent message in
// whichever book is the *current* sequential book-by-book teaching -- not
// simply whatever sermon (from any service, on any topic) happens to have
// the newest detected passage. A single guest/topical sermon can reference
// a specific verse just as easily as the ongoing series does, so recency of
// a detected book/chapter alone isn't a reliable signal on its own.
//
// Instead: collapse same-book-and-chapter entries published within a few
// days of each other into one "occurrence" (multi-platform syncs of the
// same real sermon), then walk books newest-first and pick the first one
// with at least two distinct occurrences in the last ~60 days -- a real
// sequential series accumulates weekly, while a one-off only ever has one.
export function getLatestSundayMorningSermon(): Sermon | undefined {
  const withPassage = getAllSermons().filter((s) => s.book && s.chapter);
  if (withPassage.length === 0) return undefined;

  const byBookChapter = new Map<string, Sermon[]>();
  for (const s of withPassage) {
    const key = `${s.book}|${s.chapter}`;
    const list = byBookChapter.get(key) ?? [];
    list.push(s);
    byBookChapter.set(key, list);
  }

  const occurrences: Sermon[] = [];
  for (const list of byBookChapter.values()) {
    const ascending = [...list].sort(
      (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
    let clusterStart = -Infinity;
    for (const s of ascending) {
      const t = new Date(s.publishedAt).getTime();
      if (t - clusterStart > SAME_SERMON_WINDOW_MS) {
        occurrences.push(s);
        clusterStart = t;
      }
    }
  }

  const now = Date.now();
  const seenBooks = new Set<string>();
  for (const candidate of withPassage) {
    if (seenBooks.has(candidate.book!)) continue;
    seenBooks.add(candidate.book!);

    const recentOccurrences = occurrences.filter(
      (o) => o.book === candidate.book && now - new Date(o.publishedAt).getTime() <= CURRENT_BOOK_LOOKBACK_MS
    );
    if (recentOccurrences.length >= CURRENT_BOOK_MIN_OCCURRENCES) {
      // Prefer the Logos version of this same real-world sermon (same
      // book/chapter, published within the same few-day window as
      // `candidate`) when one exists -- a full outline makes for a far
      // better homepage write-up than a YouTube/SermonAudio entry's raw
      // description, and `candidate` could be either depending on which
      // platform happened to publish most recently.
      const sameOccurrence = withPassage.filter(
        (s) =>
          s.book === candidate.book &&
          s.chapter === candidate.chapter &&
          Math.abs(new Date(s.publishedAt).getTime() - new Date(candidate.publishedAt).getTime()) <=
            SAME_SERMON_WINDOW_MS
      );
      return sameOccurrence.find((s) => s.source === "logos") ?? candidate;
    }
  }

  // Nothing looks like a sustained series recently -- fall back to the
  // single most recent passage-tagged sermon rather than showing nothing.
  return withPassage[0];
}

// Fallback graphic when a sermon's series has no custom cover art: the
// church's account avatar on Faithlife/Logos.
export function getLogosAccountImageUrl(): string | undefined {
  const filePath = path.join(SERMONS_DIR, "logos.json");
  if (!fs.existsSync(filePath)) return undefined;
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return data.accountImageUrl;
  } catch {
    return undefined;
  }
}

// The graphic to show beside a sermon: its series' own cover art when
// available (e.g. the "Book of Genesis" series graphic), falling back to
// the church's general account avatar otherwise.
export function getSermonImageUrl(sermon: Sermon): string | undefined {
  return sermon.seriesCoverImageUrl ?? getLogosAccountImageUrl();
}

function truncate(text: string, maxLen = 220): string {
  const trimmed = text.trim();
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen).trim()}…` : trimmed;
}

// A short overview for the homepage's latest-sermon callout. Logos notes
// often lead with a one-line "BIG IDEA:" summary -- use that when present,
// otherwise fall back to the start of the notes (minus the "Text: ..."
// passage-reference line), or to the source's own description for sources
// without notes. Logos' own `description` is just a bare passage reference
// (e.g. "Genesis 6:1-5"), not a real summary, so it's skipped there.
export function getSermonOverview(sermon: Sermon): string | undefined {
  if (sermon.notesText) {
    const bigIdea = sermon.notesText.match(/BIG IDEA:\s*([\s\S]*?)(?:\n\n|$)/i);
    if (bigIdea?.[1]) return truncate(bigIdea[1].replace(/\s+/g, " "));

    const withoutReferenceLine = sermon.notesText.replace(/^Text:.*\n+/i, "").trim();
    if (withoutReferenceLine) return truncate(withoutReferenceLine.replace(/\s+/g, " "));
  }

  if (sermon.source !== "logos" && sermon.description) {
    return truncate(sermon.description);
  }

  return undefined;
}

export function getSermonsForChapter(bookSlug: string, chapter: number): Sermon[] {
  return getAllSermons().filter(
    (s) => s.book && s.chapter === chapter && slugifyBook(s.book) === bookSlug
  );
}

// Used by the sidebar's Bible tree to decide which chapters are
// bold/clickable — a chapter counts as "having content" if it has a sermon,
// even without a written study note yet. Keys are "bookSlug:chapter".
export function getChaptersWithSermons(): Set<string> {
  const keys = new Set<string>();
  for (const sermon of getAllSermons()) {
    if (sermon.book && sermon.chapter) {
      keys.add(`${slugifyBook(sermon.book)}:${sermon.chapter}`);
    }
  }
  return keys;
}
