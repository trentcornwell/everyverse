import "server-only";

// Reads chapter content (study notes + sermon info) from markdown files in
// content/study-notes/. This is the sync target for the Obsidian Git plugin:
// push a folder of notes here, one file per chapter, and the site picks
// them up on the next build. Only imported from Server Components — never
// import this file from a "use client" component, since it touches the
// filesystem.

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

const CONTENT_DIR = path.join(process.cwd(), "content", "study-notes");

interface NoteFrontmatter {
  book?: string;
  chapter?: number;
  author?: string;
  date?: string;
  sermonTitle?: string;
  sermonDescription?: string;
  sermonUrl?: string;
}

export interface ChapterContent {
  studyNotes: VerseComment[];
  sermon?: Sermon;
}

type ContentMap = Record<string, Record<number, ChapterContent>>;

function loadChapterContentMap(): ContentMap {
  const map: ContentMap = {};

  if (!fs.existsSync(CONTENT_DIR)) return map;

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  for (const filename of files) {
    const filePath = path.join(CONTENT_DIR, filename);
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

    map[slug] ??= {};
    map[slug][chapter] ??= { studyNotes: [] };

    if (body) {
      const stat = fs.statSync(filePath);
      map[slug][chapter].studyNotes.push({
        id: filename.replace(/\.md$/, ""),
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
      };
    }
  }

  return map;
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
// links anywhere once it has a matching file in content/study-notes/; until
// then it's listed but plain, so the tree reflects the whole 20-year plan up
// front without pretending unwritten chapters are ready to read.
export function getBibleTree(): BibleTreeTestament[] {
  const map = loadChapterContentMap();

  const books: BibleTreeBook[] = BOOKS.map((name) => {
    const slug = slugifyBook(name);
    const chapterCount = CHAPTER_COUNT_BY_SLUG[slug] ?? 0;
    const chapters: BibleTreeChapter[] = Array.from(
      { length: chapterCount },
      (_, i) => ({
        number: i + 1,
        hasContent: Boolean(map[slug]?.[i + 1]),
      })
    );

    return { name, slug, chapters };
  });

  return [
    { name: "Old Testament", books: books.slice(0, OLD_TESTAMENT_COUNT) },
    { name: "New Testament", books: books.slice(OLD_TESTAMENT_COUNT) },
  ];
}
