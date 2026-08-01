import "server-only";

// Reads synced sermon data from content/sermons/*.json (one file per
// source: youtube.json, sermonaudio.json). Each file is regenerated
// wholesale by its own scheduled GitHub Action (see
// .github/workflows/sync-*-sermons.yml and scripts/sync-*-sermons.mjs) —
// there's no database, matching how study notes work elsewhere in this
// project.

import fs from "fs";
import path from "path";
import { BOOKS, slugifyBook } from "./bible-data";

const SERMONS_DIR = path.join(process.cwd(), "content", "sermons");

export type SermonSource = "youtube" | "sermonaudio";

export interface Sermon {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  durationSeconds: number;
  url: string;
  book?: string;
  chapter?: number;
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

export function getAllSermons(): Sermon[] {
  const sermons = [
    ...loadSource("youtube.json", "youtube"),
    ...loadSource("sermonaudio.json", "sermonaudio"),
  ];
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
