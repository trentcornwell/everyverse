import Link from "next/link";
import { FEATURED_VERSES, slugifyBook } from "@/lib/bible-data";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
        <p className="font-serif text-sm uppercase tracking-[0.2em] text-ink-900/50">
          Every Verse, Every Nation
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          One collaborative commentary,
          <br className="hidden sm:block" /> written verse by verse, by
          everyone.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-900/70">
          EveryVerse is a place for readers everywhere &mdash; scholars,
          pastors, and everyday believers &mdash; to gather around a single
          verse of scripture, share what they see in it, and learn from how
          others across the world read it too.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/verse/john/3/16"
            className="rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-parchment-50 transition hover:bg-ink-900/90"
          >
            Read John 3:16
          </Link>
          <a
            href="#how-it-works"
            className="rounded-full border border-ink-900/20 px-6 py-3 text-sm font-medium text-ink-900 transition hover:border-ink-900/40"
          >
            How it works
          </a>
        </div>
      </section>

      <section className="border-t border-ink-900/10 bg-parchment-100/60">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="font-serif text-2xl font-semibold">
            Jump into a passage
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_VERSES.map(({ book, chapter, verse }) => (
              <Link
                key={`${book}-${chapter}-${verse}`}
                href={`/verse/${slugifyBook(book)}/${chapter}/${verse}`}
                className="rounded-xl border border-ink-900/10 bg-white/70 p-5 transition hover:border-ink-900/30 hover:shadow-sm"
              >
                <p className="font-serif text-lg font-semibold">
                  {book} {chapter}:{verse}
                </p>
                <p className="mt-1 text-sm text-ink-900/50">
                  Read &amp; discuss &rarr;
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-serif text-2xl font-semibold">How it works</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="font-serif text-3xl text-ink-900/30">01</div>
            <h3 className="mt-2 font-semibold">Find a verse</h3>
            <p className="mt-1 text-sm text-ink-900/70">
              Search for any passage or browse featured verses to see the
              King James text laid out clearly, on its own page.
            </p>
          </div>
          <div>
            <div className="font-serif text-3xl text-ink-900/30">02</div>
            <h3 className="mt-2 font-semibold">Read the commentary</h3>
            <p className="mt-1 text-sm text-ink-900/70">
              See what others &mdash; from every background and nation &mdash;
              have written beneath the verse.
            </p>
          </div>
          <div>
            <div className="font-serif text-3xl text-ink-900/30">03</div>
            <h3 className="mt-2 font-semibold">Add your voice</h3>
            <p className="mt-1 text-sm text-ink-900/70">
              Leave your own reflection or insight so the next reader &mdash;
              wherever they are in the world &mdash; benefits from it too.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
