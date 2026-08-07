import Link from "next/link";
import { getBibleTree } from "@/lib/study-notes";

export const metadata = {
  title: "The Bible — EveryVerse.online",
  description:
    "Every book and chapter of the Bible. Chapters with a published study note or sermon are linked; the rest are listed as part of the 20-year plan.",
};

export default function BiblePage() {
  const tree = getBibleTree();

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="font-serif text-sm uppercase tracking-[0.2em] text-accent">
        Browse
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink sm:text-4xl">
        The whole Bible
      </h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Every book, every chapter &mdash; Old Testament first, then New.
        Bold chapter numbers have a published study note or sermon; the
        rest are listed so the whole twenty-year plan is visible up front.
      </p>

      {tree.map((testament) => (
        <section key={testament.name} className="mt-10">
          <h2 className="font-display text-xl uppercase tracking-wide text-ink">
            {testament.name}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {testament.books.map((book) => (
              <details
                key={book.slug}
                className="rounded-lg border border-canvas-border bg-canvas-elevated p-4"
              >
                <summary className="cursor-pointer select-none font-serif font-semibold text-ink">
                  {book.name}
                </summary>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {book.chapters.map((chapter) =>
                    chapter.hasContent ? (
                      <Link
                        key={chapter.number}
                        href={`/chapter/${book.slug}/${chapter.number}`}
                        className="inline-block rounded px-2 py-0.5 text-xs font-bold text-ink hover:bg-canvas-panel hover:text-accent"
                      >
                        {chapter.number}
                      </Link>
                    ) : (
                      <span
                        key={chapter.number}
                        className="inline-block cursor-default rounded px-2 py-0.5 text-xs font-normal text-slate-400"
                      >
                        {chapter.number}
                      </span>
                    )
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
