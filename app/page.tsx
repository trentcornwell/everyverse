import Link from "next/link";
import { getAllSermons, getLogosAccountImageUrl, getFeaturedArticles } from "@/lib/sermons";
import { formatDuration } from "@/lib/sermon-format";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomePage() {
  const latestSermon = getAllSermons()[0];
  const accountImageUrl = getLogosAccountImageUrl();
  const articles = getFeaturedArticles(3);

  return (
    <>
      <section className="border-b border-canvas-border bg-canvas-panel">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center sm:py-20">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-accent">
            Practical Bible Commentary
          </p>
          <h1 className="mt-4 font-display text-4xl uppercase leading-tight tracking-wide text-ink sm:text-5xl">
            Join us on our journey
            <br className="hidden sm:block" /> through the whole Bible.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            On June 7, 2026, Vision Baptist Church started teaching through
            the Bible, book by book, beginning in Genesis. Our desire is to
            teach &ldquo;every verse&rdquo; to &ldquo;every nation.&rdquo;
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/verse/genesis/1/1"
              className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Start in Genesis 1:1
            </Link>
            <Link
              href="/bible"
              className="rounded-md border border-canvas-border px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              Browse the whole Bible
            </Link>
          </div>
        </div>
      </section>

      {latestSermon && (
        <section className="border-b border-canvas-border">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <p className="font-serif text-xs uppercase tracking-[0.2em] text-accent">
              Latest Sermon
            </p>
            <div className="mt-6 grid grid-cols-1 items-center gap-8 sm:grid-cols-3">
              <Link href={`/sermons/${latestSermon.id}`} className="group sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {formatDate(latestSermon.publishedAt)}
                  {latestSermon.chapter
                    ? ` · ${latestSermon.book} ${latestSermon.chapter}`
                    : ""}
                  {latestSermon.durationSeconds > 0 &&
                    ` · ${formatDuration(latestSermon.durationSeconds)}`}
                </p>
                <h2 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink group-hover:text-accent sm:text-4xl">
                  {latestSermon.title}
                </h2>
                <span className="mt-4 inline-block text-sm font-medium text-accent group-hover:text-accent-hover">
                  Watch or listen &rarr;
                </span>
              </Link>

              {accountImageUrl && (
                <img
                  src={accountImageUrl}
                  alt="Vision Baptist Church"
                  className="w-full rounded-lg border border-canvas-border object-cover sm:col-span-1"
                />
              )}
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-canvas-border bg-canvas-panel">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
            Read the Bible
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Start reading the King James Version right now, verse by verse.
          </p>
          <Link
            href="/verse/genesis/1/1"
            className="mt-6 inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            Read the KJV &rarr;
          </Link>
        </div>
      </section>

      <section className="border-b border-canvas-border">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
            Baptist Foundations
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Explore the doctrinal foundations of the Baptist faith.
          </p>
          <a
            href="https://baptistfoundations.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Visit BaptistFoundations.com &rarr;
          </a>
        </div>
      </section>

      {articles.length > 0 && (
        <section>
          <div className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
              Featured Articles
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {articles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/sermons/${article.id}`}
                    className="block h-full rounded-lg border border-canvas-border bg-canvas-elevated p-5 transition hover:border-accent/50"
                  >
                    <p className="line-clamp-2 font-serif font-semibold text-ink">
                      {article.title}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(article.publishedAt)}
                      {article.chapter ? ` · ${article.book} ${article.chapter}` : ""}
                    </p>
                    {article.notesText && (
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                        {article.notesText}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
