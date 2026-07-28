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
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label htmlFor="verse-search" className="sr-only">
        Search verses
      </label>
      <div className="relative">
        <input
          id="verse-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. &quot;John 3:16&quot;"
          className="w-full rounded-full border border-ink-900/15 bg-white/80 px-4 py-2 pr-10 text-sm text-ink-900 placeholder:text-ink-900/40 focus:border-ink-900/40 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-900/50 hover:text-ink-900"
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
