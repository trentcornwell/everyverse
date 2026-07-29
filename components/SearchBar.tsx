"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { slugifyBook } from "@/lib/bible-data";

// Parses input like "John 3:16" or "1 Corinthians 13:4" into a /verse route.
// Full-text and topical search will replace this parsing once the search
// backend is connected.
function parseReference(input: string) {
  const match = input.trim().match(/^(\d?\s?[A-Za-z ]+?)\s+(\d+):(\d+)$/);
  if (!match) return null;

  const [, book, chapter, verse] = match;
  return { book: slugifyBook(book), chapter, verse };
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = parseReference(query);
    if (ref) {
      router.push(`/verse/${ref.book}/${ref.chapter}/${ref.verse}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="verse-search" className="sr-only">
        Search verses
      </label>
      <div className="relative">
        <input
          id="verse-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jump to e.g. &quot;John 3:16&quot;"
          className="w-full rounded-md border border-canvas-border bg-canvas px-3 py-2 pr-9 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:text-slate-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </form>
  );
}
