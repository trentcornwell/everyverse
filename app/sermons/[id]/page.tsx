import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSermonById } from "@/lib/sermons";
import { formatDuration } from "@/lib/sermon-format";
import { slugifyBook } from "@/lib/bible-data";

interface SermonPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: SermonPageProps): Promise<Metadata> {
  const { id } = await params;
  const sermon = getSermonById(id);

  return {
    title: sermon ? `${sermon.title} — EveryVerse.online` : "Sermon — EveryVerse.online",
  };
}

export default async function SermonPage({ params }: SermonPageProps) {
  const { id } = await params;
  const sermon = getSermonById(id);

  if (!sermon) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link href="/sermons" className="text-sm text-slate-500 hover:text-slate-900">
        &larr; Back to sermons
      </Link>

      <div className="mt-4 overflow-hidden rounded-xl border border-canvas-border bg-canvas-elevated">
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${sermon.id}`}
            title={sermon.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="font-serif text-2xl font-semibold text-slate-900">
            {sermon.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {new Date(sermon.publishedAt).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            {" · "}
            {formatDuration(sermon.durationSeconds)}
            {" · YouTube"}
          </p>

          {sermon.book && sermon.chapter && (
            <Link
              href={`/chapter/${slugifyBook(sermon.book)}/${sermon.chapter}`}
              className="mt-4 inline-block rounded-full border border-canvas-border px-3 py-1 text-xs font-medium text-accent hover:border-accent/50"
            >
              Read the study notes for {sermon.book} {sermon.chapter} &rarr;
            </Link>
          )}

          {sermon.description && (
            <p className="mt-6 whitespace-pre-line text-sm text-slate-600">
              {sermon.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
