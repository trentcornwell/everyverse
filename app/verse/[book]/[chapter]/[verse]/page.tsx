import type { Metadata } from "next";
import Link from "next/link";
import { getVerseText } from "@/lib/bible-data";
import VerseDisplay from "@/components/VerseDisplay";
import CommentSection from "@/components/CommentSection";
import type { VerseComment } from "@/lib/types";

interface VersePageProps {
  params: Promise<{
    book: string;
    chapter: string;
    verse: string;
  }>;
}

function seedComments(reference: string): VerseComment[] {
  return [
    {
      id: "seed-1",
      author: "Amara, Lagos",
      text: `"${reference}" has carried me through some of the hardest seasons of my life. Reading it alongside believers from other countries has given me a fuller picture of what it means.`,
      createdAt: "2026-06-02T09:15:00.000Z",
    },
    {
      id: "seed-2",
      author: "Wei, Taipei",
      text: "The original language behind this passage adds a layer of meaning that's easy to miss in translation. Would love to hear how others read it.",
      createdAt: "2026-06-10T14:42:00.000Z",
    },
  ];
}

export async function generateMetadata({
  params,
}: VersePageProps): Promise<Metadata> {
  const { book: bookParam, chapter: chapterParam, verse: verseParam } =
    await params;
  const chapter = Number(chapterParam);
  const verse = Number(verseParam);
  const { book } = getVerseText(bookParam, chapter, verse);

  return {
    title: `${book} ${chapter}:${verse} (KJV) — EveryVerse.online`,
  };
}

export default async function VersePage({ params }: VersePageProps) {
  const { book: bookParam, chapter: chapterParam, verse: verseParam } =
    await params;
  const chapter = Number(chapterParam);
  const verse = Number(verseParam);
  const result = getVerseText(bookParam, chapter, verse);
  const reference = `${result.book} ${chapter}:${verse}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link href="/" className="text-sm text-slate-500 hover:text-ink">
        &larr; Back to home
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <VerseDisplay
            book={result.book}
            chapter={chapter}
            verse={verse}
            text={result.text}
            found={result.found}
          />
        </div>

        <div className="lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <CommentSection
            reference={reference}
            seedComments={seedComments(reference)}
          />
        </div>
      </div>
    </div>
  );
}
