import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-ink-900/10 bg-parchment-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-serif text-xl font-semibold tracking-tight">
            EveryVerse
          </span>
          <span className="hidden text-sm text-ink-900/50 sm:inline">
            .online
          </span>
        </Link>
        <SearchBar />
      </div>
    </header>
  );
}
