import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { bookSlugToDisplayName } from "@/lib/bible-data";
import { getChapterContent } from "@/lib/study-notes";
import { getSermonsForChapter } from "@/lib/sermons";
import ChapterTabs from "@/components/ChapterTabs";

interface ChapterPageProps {
  params: Promise<{
    book: string;
    chapter: string;
  }>;
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { book: bookParam, chapter: chapterParam } = await params;
  const book = bookSlugToDisplayName(bookParam) ?? bookParam;

  return {
    title: `${book} ${chapterParam} — EveryVerse.online`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { book: bookParam, chapter: chapterParam } = await params;
  const chapterNum = Number(chapterParam);
  const book = bookSlugToDisplayName(bookParam) ?? bookParam;
  const reference = `${book} ${chapterNum}`;
  const content = getChapterContent(bookParam, chapterNum);
  const syncedSermons = getSermonsForChapter(bookParam, chapterNum);
  const hasAnything = Boolean(content) || syncedSermons.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/bible" className="text-sm text-slate-500 hover:text-ink">
        &larr; Browse the Bible
      </Link>

      <div className="mt-6 border-b border-canvas-border pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Chapter Study
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {reference}
        </h1>
      </div>

      {hasAnything ? (
        <div className="mt-8">
          <Suspense fallback={null}>
            <ChapterTabs
              reference={reference}
              studyNotes={content?.studyNotes ?? []}
              sermon={content?.sermon}
              syncedSermons={syncedSermons}
            />
          </Suspense>
        </div>
      ) : (
        <div className="mt-8 rounded-lg bg-canvas-panel p-5 text-slate-600">
          <p>
            The study for {reference} hasn&rsquo;t been published yet. Check
            back soon.
          </p>
        </div>
      )}
    </div>
  );
}
