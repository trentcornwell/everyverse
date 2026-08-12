"use client";

import { useState } from "react";

// A small set of languages relevant to the site's "every nation" audience.
// Each opens Google's own translation proxy for the current page in a new
// tab -- no embedded script, nothing that can silently break. The previous
// embedded Google Translate widget kept failing in ways that couldn't be
// diagnosed without browser access, so this trades a fully in-page
// experience for something that just reliably works.
const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "zh-CN", label: "中文" },
  { code: "ko", label: "한국어" },
  { code: "vi", label: "Tiếng Việt" },
];

export default function TranslateWidget() {
  const [open, setOpen] = useState(false);

  function openTranslated(langCode: string) {
    const url = `https://translate.google.com/translate?sl=auto&tl=${langCode}&u=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="inline-flex w-fit flex-col items-start gap-2 self-start rounded-md border border-canvas-border bg-canvas-elevated px-3 py-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="h-4 w-4 shrink-0 text-accent"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 3.75 5.5 3.75 9s-1.25 6.5-3.75 9c-2.5-2.5-3.75-5.5-3.75-9S9.5 5.5 12 3z" />
        </svg>
        Translate
      </button>
      {open && (
        <ul className="flex flex-col gap-1.5 border-t border-canvas-border pt-2">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                onClick={() => openTranslated(lang.code)}
                className="text-sm text-slate-600 hover:text-accent"
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
