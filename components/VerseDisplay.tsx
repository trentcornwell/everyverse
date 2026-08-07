import Link from "next/link";
import { slugifyBook, FEATURED_VERSES } from "@/lib/bible-data";

interface VerseDisplayProps {
  book: string;
  chapter: number;
  verse: number;
  text: string | null;
  found: boolean;
}

export default function VerseDisplay({
  book,
  chapter,
  verse,
  text,
  found,
}: VerseDisplayProps) {
  return (
    <div className="rounded-xl border border-canvas-border bg-canvas-elevated p-6 sm:p-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
        King James Version
      </p>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">
        {book} {chapter}:{verse}
      </h1>

      {found && text ? (
        <p className="mt-6 font-serif text-xl leading-relaxed text-slate-800 sm:text-2xl">
          {text}
        </p>
      ) : (
        <div className="mt-6 rounded-lg bg-canvas-panel p-5 text-slate-600">
          <p>
            This verse isn&rsquo;t in our sample dataset yet &mdash; the full
            KJV text will be connected once the database is wired up.
          </p>
          <p className="mt-3 text-sm">Try one of these instead:</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {FEATURED_VERSES.map((v) => (
              <li key={`${v.book}-${v.chapter}-${v.verse}`}>
                <Link
                  href={`/verse/${slugifyBook(v.book)}/${v.chapter}/${v.verse}`}
                  className="rounded-full border border-canvas-border bg-canvas px-3 py-1 text-slate-700 hover:border-accent/50 hover:text-ink"
                >
                  {v.book} {v.chapter}:{v.verse}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
