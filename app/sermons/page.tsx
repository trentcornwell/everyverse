import type { Metadata } from "next";
import { getSermonsGroupedByBook } from "@/lib/sermons";
import SermonArchive from "@/components/SermonArchive";

export const metadata: Metadata = {
  title: "Sermons — EveryVerse.online",
  description: "Every sermon from Vision Baptist Church, organized by book of the Bible.",
};

export default function SermonsPage() {
  const grouped = getSermonsGroupedByBook();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="font-serif text-sm uppercase tracking-[0.2em] text-gold">
        Vision Baptist Church
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink sm:text-4xl">
        Sermons
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Every sermon, organized by book of the Bible.
      </p>
      <div className="mt-8">
        <SermonArchive grouped={grouped} />
      </div>
    </div>
  );
}
