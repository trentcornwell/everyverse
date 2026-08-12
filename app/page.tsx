import Link from "next/link";
import {
  getLatestSundayMorningSermon,
  getSermonImageUrl,
  getSermonOverview,
} from "@/lib/sermons";
import { getFeaturedArticles } from "@/lib/articles";
import { formatDuration, getSermonHref } from "@/lib/sermon-format";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomePage() {
  const latestSermon = getLatestSundayMorningSermon();
  const sermonImageUrl = latestSermon ? getSermonImageUrl(latestSermon) : undefined;
  const sermonOverview = latestSermon ? getSermonOverview(latestSermon) : undefined;
  const [article] = getFeaturedArticles(1);

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
              href="/bible"
              className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-hover"
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
              <Link href={getSermonHref(latestSermon)} className="group sm:col-span-2">
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
                {sermonOverview && (
                  <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-slate-600">
                    {sermonOverview}
                  </p>
                )}
                <span className="mt-4 inline-block text-sm font-medium text-accent group-hover:text-accent-hover">
                  Watch or listen &rarr;
                </span>
              </Link>

              {sermonImageUrl && (
                <img
                  src={sermonImageUrl}
                  alt={latestSermon.book ? `${latestSermon.book} series artwork` : "Vision Baptist Church"}
                  className="w-full rounded-lg border border-canvas-border object-cover sm:col-span-1"
                />
              )}
            </div>
          </div>
        </section>
      )}

      <section className="bg-canvas-panel">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <h2 className="font-display text-xl uppercase tracking-wide text-ink">
                Read the Bible
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                No single event has the potential to change your life as
                reading the Bible does. Start today! Search for any book,
                then click any chapter to start reading.
              </p>
              <Link
                href="/bible"
                className="mt-5 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover"
              >
                Read the Bible &rarr;
              </Link>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="font-display text-xl uppercase tracking-wide text-ink">
                Be a disciple, make a disciple
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Foundations is a bible-centered discipleship curriculum that
                can be used on your own, with a partner, or a small group.
                Use the materials, share the materials, go at your own pace,
                no login required.
              </p>
              <a
                href="https://baptistfoundations.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-md bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
              >
                Visit BaptistFoundations.com &rarr;
              </a>
            </div>

            {article && (
              <div>
                <h2 className="font-display text-xl uppercase tracking-wide text-ink">
                  Featured Article
                </h2>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block rounded-lg border border-canvas-border bg-canvas-elevated p-4 transition hover:border-accent/50"
                >
                  <p className="line-clamp-2 font-serif font-semibold text-ink">
                    {article.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(article.publishedAt)}
                  </p>
                  {article.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                      {article.excerpt}
                    </p>
                  )}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
