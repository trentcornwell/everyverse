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

// The homepage's "latest sermon" is specifically the most recent Sunday
// morning message -- the sequential book-by-book teaching, not a Sunday
// night/Wednesday/topical one-off. There's no explicit service-type field
// from any source, but every sequential-teaching sermon has a detected
// book/chapter (it's literally "chapter N of Genesis"), while topical
// series (marriage, Lord's Supper, seminars, etc.) generally don't -- the
// same signal already used sitewide to decide what's part of the project.
export function getLatestSundayMorningSermon(): Sermon | undefined {
  return getAllSermons().find((s) => s.book && s.chapter);
}

// The one graphic Faithlife/Logos actually exposes: the church's account
// avatar, shared across every sermon (Logos doesn't provide per-sermon
// artwork). Used beside the homepage's latest-sermon callout.
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

// Logos sermon notes doubling as "articles" for the homepage — the closest
// thing this site has to written, publishable reading material outside of
// study notes.
export function getFeaturedArticles(limit = 3): Sermon[] {
  return getAllSermons()
    .filter((s) => s.source === "logos" && (s.notesHtml || s.notesText))
    .slice(0, limit);
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
