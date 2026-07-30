"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SermonGroup } from "@/lib/sermons";
import { formatDuration } from "@/lib/sermon-format";

interface SermonArchiveProps {
  grouped: SermonGroup[];
}

export default function SermonArchive({ grouped }: SermonArchiveProps) {
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState("All books");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return grouped
      .filter((g) => selectedBook === "All books" || g.book === selectedBook)
      .map((g) => ({
        ...g,
        sermons: g.sermons.filter(
          (s) =>
            !q ||
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.sermons.length > 0);
  }, [grouped, query, selectedBook]);

  if (grouped.length === 0) {
    return (
      <div className="mt-8 rounded-lg bg-canvas-panel p-5 text-sm text-slate-600">
        No sermons have synced yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, passage, or topic..."
          className="w-full rounded-md border border-canvas-border bg-canvas px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:flex-1"
        />
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="rounded-md border border-canvas-border bg-canvas px-3 py-2 text-sm text-slate-900 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option>All books</option>
          {grouped.map((g) => (
            <option key={g.book}>{g.book}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">
          No sermons match that search.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-10">
        {filtered.map((group) => (
          <section key={group.book}>
            <h2 className="text-lg font-semibold text-slate-900">
              {group.book}
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {group.sermons.map((sermon) => (
                <li key={sermon.id}>
                  <Link
                    href={`/sermons/${sermon.id}`}
                    className="flex flex-col gap-1 rounded-lg border border-canvas-border bg-canvas-elevated p-4 transition hover:border-accent/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {sermon.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {new Date(sermon.publishedAt).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {sermon.chapter ? ` · ${sermon.book} ${sermon.chapter}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-slate-500">
                      {formatDuration(sermon.durationSeconds)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
