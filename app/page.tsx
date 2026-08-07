import Link from "next/link";
import { getLatestStudyChapters } from "@/lib/study-notes";
import { getAllSermons } from "@/lib/sermons";
import { formatDuration } from "@/lib/sermon-format";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomePage() {
  const recentSermons = getAllSermons().slice(0, 3);
  const [featured, ...rest] = getLatestStudyChapters(7);

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

      {featured && (
        <section className="border-b border-canvas-border">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <p className="font-serif text-xs uppercase tracking-[0.2em] text-accent">
              Latest teaching
            </p>
            <div
              className={`mt-6 grid grid-cols-1 gap-10 ${
                rest.length > 0 ? "lg:grid-cols-3" : ""
              }`}
            >
              <Link
                href={`/chapter/${featured.slug}/${featured.chapter}`}
                className={`group ${rest.length > 0 ? "lg:col-span-2" : ""}`}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {featured.book} {featured.chapter} &middot; {formatDate(featured.date)}
                </p>
                <h2 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink group-hover:text-accent sm:text-4xl">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-slate-600">
                    {featured.excerpt}
                  </p>
                )}
                <span className="mt-4 inline-block text-sm font-medium text-accent group-hover:text-accent-hover">
                  Read the study &rarr;
                </span>
              </Link>

              {rest.length > 0 && (
                <ul className="flex flex-col gap-5 border-t border-canvas-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  {rest.slice(0, 5).map((entry) => (
                    <li key={`${entry.slug}-${entry.chapter}`}>
                      <Link
                        href={`/chapter/${entry.slug}/${entry.chapter}`}
                        className="group block"
                      >
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          {entry.book} {entry.chapter}
                        </p>
                        <p className="mt-1 font-serif text-sm font-semibold leading-snug text-ink group-hover:text-accent">
                          {entry.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {recentSermons.length > 0 && (
        <section className="bg-canvas-panel">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
                Recent sermons
              </h2>
              <Link
                href="/sermons"
                className="text-sm font-medium text-accent hover:text-accent-hover"
              >
                View all &rarr;
              </Link>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {recentSermons.map((sermon) => (
                <li key={sermon.id}>
                  <Link
                    href={`/sermons/${sermon.id}`}
                    className="block rounded-lg border border-canvas-border bg-canvas-elevated p-5 transition hover:border-accent/50"
                  >
                    <p className="line-clamp-2 font-serif font-semibold text-ink">
                      {sermon.title}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(sermon.publishedAt)}
                      {sermon.chapter ? ` · ${sermon.book} ${sermon.chapter}` : ""}
                      {" · "}
                      {formatDuration(sermon.durationSeconds)}
                    </p>
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
