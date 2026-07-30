import Link from "next/link";
import GraphView from "@/components/GraphView";
import { getBibleTree } from "@/lib/study-notes";
import { getAllSermons } from "@/lib/sermons";
import { formatDuration } from "@/lib/sermon-format";

export default function HomePage() {
  const tree = getBibleTree();
  const recentSermons = getAllSermons().slice(0, 4);

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
        <p className="font-serif text-sm uppercase tracking-[0.2em] text-accent">
          Practical Bible Commentary
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
          Free for everyone.
          <br className="hidden sm:block" /> For the next 20 years.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          On June 7, 2026, Vision Baptist Church started teaching through the
          Bible, book by book, beginning in Genesis. Trent Cornwell and
          friends are giving their lives to this work over the next twenty
          years, Lord willing. Everything taught here will be public and
          free for anyone to read. Join us in the journey.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/verse/genesis/1/1"
            className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            Start in Genesis 1:1
          </Link>
          <a
            href="#graph"
            className="rounded-md border border-canvas-border px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
          >
            Explore the graph
          </a>
        </div>
      </section>

      <section id="graph" className="border-t border-canvas-border bg-canvas-panel">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">
            The whole Bible, one chapter at a time
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            Every book of the Bible, organized by testament &mdash; Old on
            the left, New on the right. Most of it is still waiting to be
            taught. The highlighted chapter has a published study note;
            click it to read.
          </p>
          <div className="mt-8">
            <GraphView tree={tree} />
          </div>
        </div>
      </section>

      {recentSermons.length > 0 && (
        <section className="border-t border-canvas-border">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">
                Recent sermons
              </h2>
              <Link
                href="/sermons"
                className="text-sm font-medium text-accent hover:text-accent-hover"
              >
                View all &rarr;
              </Link>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {recentSermons.map((sermon) => (
                <li key={sermon.id}>
                  <Link
                    href={`/sermons/${sermon.id}`}
                    className="block rounded-lg border border-canvas-border bg-canvas-elevated p-5 transition hover:border-accent/50"
                  >
                    <p className="truncate font-medium text-slate-900">
                      {sermon.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(sermon.publishedAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
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
