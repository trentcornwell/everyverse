"use client";

import { useMemo, useState } from "react";

// Every language Google Translate supports. Each opens Google's own
// translation proxy for the current page in a new tab via window.open --
// no embedded script, nothing that can silently break.
const LANGUAGES = [
  { code: "af", label: "Afrikaans" },
  { code: "sq", label: "Albanian" },
  { code: "am", label: "Amharic" },
  { code: "ar", label: "Arabic" },
  { code: "hy", label: "Armenian" },
  { code: "as", label: "Assamese" },
  { code: "ay", label: "Aymara" },
  { code: "az", label: "Azerbaijani" },
  { code: "bm", label: "Bambara" },
  { code: "eu", label: "Basque" },
  { code: "be", label: "Belarusian" },
  { code: "bn", label: "Bengali" },
  { code: "bho", label: "Bhojpuri" },
  { code: "bs", label: "Bosnian" },
  { code: "bg", label: "Bulgarian" },
  { code: "ca", label: "Catalan" },
  { code: "ceb", label: "Cebuano" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "zh-TW", label: "Chinese (Traditional)" },
  { code: "co", label: "Corsican" },
  { code: "hr", label: "Croatian" },
  { code: "cs", label: "Czech" },
  { code: "da", label: "Danish" },
  { code: "dv", label: "Dhivehi" },
  { code: "doi", label: "Dogri" },
  { code: "nl", label: "Dutch" },
  { code: "en", label: "English" },
  { code: "eo", label: "Esperanto" },
  { code: "et", label: "Estonian" },
  { code: "ee", label: "Ewe" },
  { code: "fil", label: "Filipino" },
  { code: "fi", label: "Finnish" },
  { code: "fr", label: "French" },
  { code: "fy", label: "Frisian" },
  { code: "gl", label: "Galician" },
  { code: "ka", label: "Georgian" },
  { code: "de", label: "German" },
  { code: "el", label: "Greek" },
  { code: "gn", label: "Guarani" },
  { code: "gu", label: "Gujarati" },
  { code: "ht", label: "Haitian Creole" },
  { code: "ha", label: "Hausa" },
  { code: "haw", label: "Hawaiian" },
  { code: "he", label: "Hebrew" },
  { code: "hi", label: "Hindi" },
  { code: "hmn", label: "Hmong" },
  { code: "hu", label: "Hungarian" },
  { code: "is", label: "Icelandic" },
  { code: "ig", label: "Igbo" },
  { code: "ilo", label: "Ilocano" },
  { code: "id", label: "Indonesian" },
  { code: "ga", label: "Irish" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
  { code: "jv", label: "Javanese" },
  { code: "kn", label: "Kannada" },
  { code: "kk", label: "Kazakh" },
  { code: "km", label: "Khmer" },
  { code: "rw", label: "Kinyarwanda" },
  { code: "gom", label: "Konkani" },
  { code: "ko", label: "Korean" },
  { code: "kri", label: "Krio" },
  { code: "ku", label: "Kurdish" },
  { code: "ckb", label: "Kurdish (Sorani)" },
  { code: "ky", label: "Kyrgyz" },
  { code: "lo", label: "Lao" },
  { code: "la", label: "Latin" },
  { code: "lv", label: "Latvian" },
  { code: "ln", label: "Lingala" },
  { code: "lt", label: "Lithuanian" },
  { code: "lg", label: "Luganda" },
  { code: "lb", label: "Luxembourgish" },
  { code: "mk", label: "Macedonian" },
  { code: "mai", label: "Maithili" },
  { code: "mg", label: "Malagasy" },
  { code: "ms", label: "Malay" },
  { code: "ml", label: "Malayalam" },
  { code: "mt", label: "Maltese" },
  { code: "mi", label: "Maori" },
  { code: "mr", label: "Marathi" },
  { code: "mni-Mtei", label: "Meiteilon (Manipuri)" },
  { code: "lus", label: "Mizo" },
  { code: "mn", label: "Mongolian" },
  { code: "my", label: "Myanmar (Burmese)" },
  { code: "ne", label: "Nepali" },
  { code: "no", label: "Norwegian" },
  { code: "ny", label: "Nyanja (Chichewa)" },
  { code: "or", label: "Odia (Oriya)" },
  { code: "om", label: "Oromo" },
  { code: "ps", label: "Pashto" },
  { code: "fa", label: "Persian" },
  { code: "pl", label: "Polish" },
  { code: "pt", label: "Portuguese" },
  { code: "pa", label: "Punjabi" },
  { code: "qu", label: "Quechua" },
  { code: "ro", label: "Romanian" },
  { code: "ru", label: "Russian" },
  { code: "sm", label: "Samoan" },
  { code: "sa", label: "Sanskrit" },
  { code: "gd", label: "Scots Gaelic" },
  { code: "nso", label: "Sepedi" },
  { code: "sr", label: "Serbian" },
  { code: "st", label: "Sesotho" },
  { code: "sn", label: "Shona" },
  { code: "sd", label: "Sindhi" },
  { code: "si", label: "Sinhala" },
  { code: "sk", label: "Slovak" },
  { code: "sl", label: "Slovenian" },
  { code: "so", label: "Somali" },
  { code: "es", label: "Spanish" },
  { code: "su", label: "Sundanese" },
  { code: "sw", label: "Swahili" },
  { code: "sv", label: "Swedish" },
  { code: "tg", label: "Tajik" },
  { code: "ta", label: "Tamil" },
  { code: "tt", label: "Tatar" },
  { code: "te", label: "Telugu" },
  { code: "th", label: "Thai" },
  { code: "ti", label: "Tigrinya" },
  { code: "ts", label: "Tsonga" },
  { code: "tr", label: "Turkish" },
  { code: "tk", label: "Turkmen" },
  { code: "ak", label: "Twi" },
  { code: "uk", label: "Ukrainian" },
  { code: "ur", label: "Urdu" },
  { code: "ug", label: "Uyghur" },
  { code: "uz", label: "Uzbek" },
  { code: "vi", label: "Vietnamese" },
  { code: "cy", label: "Welsh" },
  { code: "xh", label: "Xhosa" },
  { code: "yi", label: "Yiddish" },
  { code: "yo", label: "Yoruba" },
  { code: "zu", label: "Zulu" },
];

export default function TranslateWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter((lang) => lang.label.toLowerCase().includes(q));
  }, [query]);

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
        <div className="w-56 border-t border-canvas-border pt-2">
          <label htmlFor="translate-language-search" className="sr-only">
            Search languages
          </label>
          <input
            id="translate-language-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search languages..."
            className="w-full rounded border border-canvas-border px-2 py-1 text-sm text-ink placeholder:text-slate-400 focus:border-accent focus:outline-none"
          />
          <ul className="mt-2 flex max-h-56 flex-col gap-1 overflow-y-auto">
            {filtered.map((lang) => (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => openTranslated(lang.code)}
                  className="w-full truncate text-left text-sm text-slate-600 hover:text-accent"
                >
                  {lang.label}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="text-sm text-slate-400">No matches.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
