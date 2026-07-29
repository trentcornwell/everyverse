"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getBibleTree } from "@/lib/bible-data";
import SearchBar from "./SearchBar";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`h-3.5 w-3.5 shrink-0 transition-transform ${
        expanded ? "rotate-90" : ""
      }`}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function BookNode({
  book,
  pathname,
}: {
  book: ReturnType<typeof getBibleTree>[number]["books"][number];
  pathname: string;
}) {
  const hasContent = book.chapters.length > 0;
  const [expanded, setExpanded] = useState(false);

  if (!hasContent) {
    return (
      <li>
        <span className="flex cursor-default items-center gap-1.5 rounded px-2 py-1 text-sm text-slate-500">
          {book.name}
        </span>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm text-slate-200 hover:bg-canvas-elevated"
      >
        <ChevronIcon expanded={expanded} />
        {book.name}
      </button>
      {expanded && (
        <ul className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-canvas-border pl-3">
          {book.chapters.map((chapter) => (
            <ChapterNode
              key={chapter.chapter}
              slug={book.slug}
              chapter={chapter.chapter}
              verses={chapter.verses}
              pathname={pathname}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function ChapterNode({
  slug,
  chapter,
  verses,
  pathname,
}: {
  slug: string;
  chapter: number;
  verses: number[];
  pathname: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm text-slate-300 hover:bg-canvas-elevated"
      >
        <ChevronIcon expanded={expanded} />
        Chapter {chapter}
      </button>
      {expanded && (
        <ul className="ml-4 mt-0.5 flex flex-wrap gap-1 border-l border-canvas-border py-1 pl-3">
          {verses.map((verse) => {
            const href = `/verse/${slug}/${chapter}/${verse}`;
            const active = pathname === href;
            return (
              <li key={verse}>
                <Link
                  href={href}
                  className={`inline-block rounded px-2 py-0.5 text-xs ${
                    active
                      ? "bg-accent/20 text-accent"
                      : "text-slate-400 hover:bg-canvas-elevated hover:text-slate-200"
                  }`}
                >
                  v{verse}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const tree = getBibleTree();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-canvas-border bg-canvas-panel transition-transform lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-canvas-border p-4">
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg font-semibold text-slate-100">
              EveryVerse
            </span>
            <span className="text-xs text-slate-500">.online</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded p-1 text-slate-400 hover:bg-canvas-elevated hover:text-slate-200 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="border-b border-canvas-border p-3">
          <SearchBar />
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {tree.map((testament) => (
            <div key={testament.name} className="mb-4">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {testament.name}
              </p>
              <ul className="mt-1 flex flex-col gap-0.5">
                {testament.books.map((book) => (
                  <BookNode key={book.slug} book={book} pathname={pathname} />
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
