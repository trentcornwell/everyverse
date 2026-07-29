"use client";

import { usePathname } from "next/navigation";
import { bookSlugToDisplayName } from "@/lib/bible-data";

interface TopBarProps {
  onMenuClick: () => void;
}

function currentReference(pathname: string): string | null {
  const match = pathname.match(/^\/verse\/([^/]+)\/(\d+)\/(\d+)/);
  if (!match) return null;

  const [, slug, chapter, verse] = match;
  const book = bookSlugToDisplayName(slug) ?? slug;
  return `${book} ${chapter}:${verse}`;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const reference = currentReference(pathname);

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-canvas-border bg-canvas-panel/95 px-4 py-3 backdrop-blur lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
        className="rounded p-1.5 text-slate-600 hover:bg-canvas-elevated hover:text-slate-900 lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-5 w-5"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
        {reference ?? "Every Verse, Every Nation"}
      </p>

      <span
        className="shrink-0 rounded-full border border-canvas-border px-3 py-1 text-xs font-medium text-slate-600"
        title="Only the King James Version is available for now"
      >
        KJV
      </span>
    </header>
  );
}
