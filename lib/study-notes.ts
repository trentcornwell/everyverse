import "server-only";

// Reads chapter content (study notes + sermon info) from markdown files
// anywhere under content/study-notes/ (subfolders are fine — e.g. organized
// as Old Testament/Genesis/Chapter 6.md). This is the sync target for the
// Obsidian Git plugin: push notes here and the site picks them up on the
// next build. Frontmatter (book/chapter), not file location, is what
// actually determines where a note appears on the site. Only imported from
// Server Components — never import this file from a "use client" component,
// since it touches the filesystem.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import {
  BOOKS,
  CHAPTER_COUNT_BY_SLUG,
  OLD_TESTAMENT_COUNT,
  bookSlugToDisplayName,
  slugifyBook,
} from "./bible-data";
import type { Sermon, VerseComment } from "./types";
import { getChaptersWithSermons } from "./sermons";

const CONTENT_DIR = path.join(process.cwd(), "content", "study-notes");

interface NoteFrontmatter {
  book?: string;
  chapter?: number;
  author?: string;
  date?: string;
  sermonTitle?: string;
  sermonDescription?: string;
  sermonUrl?: string;
  sermonDate?: string;
}

export interface ChapterContent {
  studyNotes: VerseComment[];
  sermon?: Sermon;
}

type ContentMap = Record<string, Record<number, ChapterContent>>;

// Walks a directory tree manually (rather than fs.readdirSync's `recursive`
// option) so this keeps working on any Node version — `recursive` was only
// added in Node 20.1, and this needs to run wherever the site deploys.
function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function loadChapterContentMap(): ContentMap {
  const map: ContentMap = {};

  for (const filePath of walkMarkdownFiles(CONTENT_DIR)) {
    const filename = path.basename(filePath);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw) as unknown as {
      data: NoteFrontmatter;
      content: string;
    };

    if (!data.book || !data.chapter) {
      console.warn(`[study-notes] Skipping ${filename}: missing book/chapter frontmatter.`);
      continue;
    }

    const displayName = bookSlugToDisplayName(slugifyBook(data.book));
    if (!displayName) {
      console.warn(`[study-notes] Skipping ${filename}: unrecognized book "${data.book}".`);
      continue;
    }

    const slug = slugifyBook(displayName);
    const chapter = Number(data.chapter);
    const body = content.trim();

    // Stub files include a plain-text "write here" placeholder line so it's
    // visible in every Obsidian view mode (an HTML comment would be hidden
    // in Reading/Live Preview, same as in a browser). Strip it out before
    // deciding whether there's actually anything written yet — a stub
    // (frontmatter + that placeholder only, no sermon) shouldn't make the
    // chapter show up as having content in the sidebar.
    const STUB_PLACEHOLDER = /\*Write your study notes here\.\*/g;
    const bodyWithoutHints = body.replace(STUB_PLACEHOLDER, "").trim();
    if (!bodyWithoutHints && !data.sermonTitle) continue;

    map[slug] ??= {};
    map[slug][chapter] ??= { studyNotes: [] };

    if (bodyWithoutHints) {
      const stat = fs.statSync(filePath);
      // Unique per file location, not just filename, since two notes in
      // different book folders could otherwise share a filename.
      const id = path
        .relative(CONTENT_DIR, filePath)
        .replace(/\.md$/, "")
        .replace(/[\\/]/g, "-");

      map[slug][chapter].studyNotes.push({
        id,
        author: data.author ?? "Trent Cornwell",
        text: body,
        html: marked.parse(body, { async: false }),
        createdAt: data.date
          ? new Date(data.date).toISOString()
          : stat.mtime.toISOString(),
      });
    }

    if (data.sermonTitle) {
      map[slug][chapter].sermon = {
        title: data.sermonTitle,
        description: data.sermonDescription ?? "",
        url: data.sermonUrl,
        datePreached: data.sermonDate
          ? new Date(data.sermonDate).toISOString()
          : undefined,
      };
    }
  }

  return map;
}

function toExcerpt(raw: string, maxLen = 160): string {
  const plain = raw
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
    .replace(/[#*_>`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > maxLen ? `${plain.slice(0, maxLen).trim()}…` : plain;
}

export interface LatestChapterEntry {
  book: string;
  slug: string;
  chapter: number;
  date: string;
  title: string;
  excerpt: string;
  hasSermon: boolean;
}

// Powers the homepage's "latest teaching" cards: every chapter with a real
// study note or sermon, newest first, so the front page always reflects
// wherever the 20-year plan currently stands rather than a hardcoded verse.
export function getLatestStudyChapters(limit = 6): LatestChapterEntry[] {
  const map = loadChapterContentMap();
  const entries: LatestChapterEntry[] = [];

  for (const slug of Object.keys(map)) {
    const displayName = bookSlugToDisplayName(slug) ?? slug;
    for (const [chapterStr, content] of Object.entries(map[slug])) {
      const chapter = Number(chapterStr);
      const latestNoteDate = content.studyNotes.reduce(
        (max, note) => (note.createdAt > max ? note.createdAt : max),
        content.studyNotes[0]?.createdAt ?? ""
      );
      const date = content.sermon?.datePreached || latestNoteDate || new Date(0).toISOString();
      const excerptSource = content.studyNotes[0]?.text ?? content.sermon?.description ?? "";

      entries.push({
        book: displayName,
        slug,
        chapter,
        date,
        title: content.sermon?.title ?? `${displayName} ${chapter}`,
        excerpt: toExcerpt(excerptSource),
        hasSermon: Boolean(content.sermon),
      });
    }
  }

  entries.sort((a, b) => (a.date < b.date ? 1 : -1));
  return entries.slice(0, limit);
}

export function hasChapterContent(bookSlug: string, chapter: number): boolean {
  const map = loadChapterContentMap();
  return Boolean(map[bookSlug.toLowerCase()]?.[chapter]);
}

export function getChapterContent(
  bookSlug: string,
  chapter: number
): ChapterContent | undefined {
  const map = loadChapterContentMap();
  return map[bookSlug.toLowerCase()]?.[chapter];
}

export interface BibleTreeChapter {
  number: number;
  hasContent: boolean;
}

export interface BibleTreeBook {
  name: string;
  slug: string;
  chapters: BibleTreeChapter[];
}

export interface BibleTreeTestament {
  name: string;
  books: BibleTreeBook[];
}

// Builds the sidebar's Bible tree: every book, every chapter. A chapter only
// links anywhere once it has a matching file in content/study-notes/ or a
// synced sermon; until then it's listed but plain, so the tree reflects the
// whole 20-year plan up front without pretending unwritten chapters are
// ready to read.
export function getBibleTree(): BibleTreeTestament[] {
  const map = loadChapterContentMap();
  const sermonChapters = getChaptersWithSermons();

  const books: BibleTreeBook[] = BOOKS.map((name) => {
    const slug = slugifyBook(name);
    const chapterCount = CHAPTER_COUNT_BY_SLUG[slug] ?? 0;
    const chapters: BibleTreeChapter[] = Array.from(
      { length: chapterCount },
      (_, i) => ({
        number: i + 1,
        hasContent:
          Boolean(map[slug]?.[i + 1]) || sermonChapters.has(`${slug}:${i + 1}`),
      })
    );

    return { name, slug, chapters };
  });

  return [
    { name: "Old Testament", books: books.slice(0, OLD_TESTAMENT_COUNT) },
    { name: "New Testament", books: books.slice(OLD_TESTAMENT_COUNT) },
  ];
}
