"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SearchBar from "./SearchBar";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/bible", label: "Bible" },
  { href: "/sermons", label: "Sermons" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-canvas-border bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="font-display text-lg uppercase tracking-wide text-ink">
            EveryVerse
          </span>
          <span className="text-xs text-slate-500">.online</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                isActive(link.href)
                  ? "text-accent"
                  : "text-slate-700 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://baptistfoundations.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            Foundations
          </a>
        </nav>

        <div className="ml-auto hidden w-64 lg:block">
          <SearchBar />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="ml-auto rounded p-1.5 text-slate-600 hover:bg-canvas-panel hover:text-ink lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-5 w-5"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-canvas-border px-6 py-4 lg:hidden">
          <div className="mb-4">
            <SearchBar />
          </div>
          <nav className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium ${
                  isActive(link.href)
                    ? "text-accent"
                    : "text-slate-700 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://baptistfoundations.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              Foundations
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
