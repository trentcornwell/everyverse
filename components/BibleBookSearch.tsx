"use client";

import Link from "next/link";
import { useState } from "react";
import type { BibleTreeTestament } from "@/lib/study-notes";

interface BibleBookSearchProps {
  tree: BibleTreeTestament[];
}

export default function BibleBookSearch({ tree }: BibleBookSearchProps) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const isSearching = normalized.length > 0;

  const filteredTestaments = tree
    .map((testament) => ({
      ...testament,
      books: isSearching
        ? testament.books.filter((b) => b.name.toLowerCase().includes(normalized))
        : testament.books,
    }))
    .filter((testament) => testament.books.length > 0);

  return (
    <div>
      <label htmlFor="bible-book-search" className="sr-only">
        Search for a book of the Bible
      </label>
      <input
        id="bible-book-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a book of the Bible..."
        className="w-full rounded-md border border-canvas-border bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />

      {filteredTestaments.length === 0 ? (
        <p className="mt-8 text-sm text-slate-600">
          No books match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        filteredTestaments.map((testament) => (
          <section key={testament.name} className="mt-8">
            <h2 className="font-display text-xl uppercase tracking-wide text-ink">
              {testament.name}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {testament.books.map((book) => (
                <details
                  key={book.slug}
                  open={isSearching}
                  className="rounded-lg border border-canvas-border bg-canvas-elevated p-4"
                >
                  <summary className="cursor-pointer select-none font-serif font-semibold text-ink">
                    {book.name}
                  </summary>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {book.chapters.map((chapter) => (
                      <Link
                        key={chapter.number}
                        href={`/chapter/${book.slug}/${chapter.number}`}
                        className={`inline-block rounded px-2 py-0.5 text-xs hover:bg-canvas-panel hover:text-accent ${
                          chapter.hasContent
                            ? "font-bold text-ink"
                            : "font-normal text-slate-400"
                        }`}
                      >
                        {chapter.number}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
