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
      <h1 className="text-3xl font-semibold text-slate-900">Sermons</h1>
      <p className="mt-2 text-slate-600">
        Every sermon, organized by book of the Bible.
      </p>
      <SermonArchive grouped={grouped} />
    </div>
  );
}
