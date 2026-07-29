import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { bookSlugToDisplayName, getChapterContent } from "@/lib/bible-data";
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

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
        &larr; Back to home
      </Link>

      <div className="mt-4 rounded-xl border border-canvas-border bg-canvas-elevated p-6 sm:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Chapter Study
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
          {reference}
        </h1>
      </div>

      {content ? (
        <div className="mt-8">
          <Suspense fallback={null}>
            <ChapterTabs
              reference={reference}
              studyNotes={content.studyNotes}
              sermon={content.sermon}
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
