import Link from "next/link";
import { FEATURED_VERSES, slugifyBook } from "@/lib/bible-data";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
        <p className="font-serif text-sm uppercase tracking-[0.2em] text-accent">
          Every Verse, Every Nation
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
          One collaborative commentary,
          <br className="hidden sm:block" /> written verse by verse, by
          everyone.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          On June 7, 2026, Vision Baptist Church began a journey through the
          Bible, starting in the book of Genesis. Pastor Trent Cornwell and
          the pastoral staff desire to provide practical commentary and
          sermons on every chapter of Scripture here over the next twenty
          years, Lord willing.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/verse/genesis/1/1"
            className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            Start in Genesis 1:1
          </Link>
          <a
            href="#how-it-works"
            className="rounded-md border border-canvas-border px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
          >
            How it works
          </a>
        </div>
      </section>

      <section className="border-t border-canvas-border bg-canvas-panel">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-2xl font-semibold text-slate-900">
            Jump into a passage
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_VERSES.map(({ book, chapter, verse }) => (
              <Link
                key={`${book}-${chapter}-${verse}`}
                href={`/verse/${slugifyBook(book)}/${chapter}/${verse}`}
                className="rounded-lg border border-canvas-border bg-canvas-elevated p-5 transition hover:border-accent/50"
              >
                <p className="font-serif text-lg font-semibold text-slate-900">
                  {book} {chapter}:{verse}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Read &amp; discuss &rarr;
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-slate-900">
          How it works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="text-3xl font-serif text-accent/60">01</div>
            <h3 className="mt-2 font-semibold text-slate-900">
              Find a verse
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Browse the Bible tree in the sidebar or search for any passage
              to see the King James text laid out clearly, on its own page.
            </p>
          </div>
          <div>
            <div className="text-3xl font-serif text-accent/60">02</div>
            <h3 className="mt-2 font-semibold text-slate-900">
              Read the commentary
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              See what others &mdash; from every background and nation &mdash;
              have written beneath the verse.
            </p>
          </div>
          <div>
            <div className="text-3xl font-serif text-accent/60">03</div>
            <h3 className="mt-2 font-semibold text-slate-900">
              Add your voice
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Leave your own reflection or insight so the next reader &mdash;
              wherever they are in the world &mdash; benefits from it too.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
