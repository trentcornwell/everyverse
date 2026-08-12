"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Sermon as SyncedSermon } from "@/lib/sermons";
import type { ChapterVerse } from "@/lib/kjv";
import { formatDuration } from "@/lib/sermon-format";
import TranslateWidget from "./TranslateWidget";

interface ChapterTabsProps {
  reference: string;
  syncedSermons: SyncedSermon[];
  verses: ChapterVerse[] | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ChapterTabs({ reference, syncedSermons, verses }: ChapterTabsProps) {
  const videos = syncedSermons.filter((s) => s.source === "youtube");
  const audios = syncedSermons.filter((s) => s.source === "sermonaudio");
  const outlines = syncedSermons.filter((s) => s.source === "logos");

  // A chapter with more than one outline (e.g. two different weeks both
  // touching the same chapter) gets its own tab per outline -- "Outline 1",
  // "Outline 2" -- rather than stacking them under one tab like Video/Audio
  // do, since an outline is long-form reading material best viewed one at a
  // time.
  const outlineTabValues = outlines.length > 1 ? outlines.map((_, i) => `outline-${i}`) : ["outline"];
  const tabValues = ["scripture", "video", "audio", ...outlineTabValues];

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const resolvedRequestedTab =
    requestedTab === "outline" && outlines.length > 1 ? "outline-0" : requestedTab;
  const initialTab = tabValues.includes(resolvedRequestedTab ?? "")
    ? (resolvedRequestedTab as string)
    : "scripture";
  const [tab, setTab] = useState(initialTab);

  // Keeps the URL in sync with the active tab -- lets a specific tab (e.g.
  // "Outline 2" of a given chapter) be bookmarked, shared, or reloaded
  // directly instead of always landing back on Scripture. Uses the History
  // API directly (not next/navigation's router) so it's a pure client-side
  // address-bar update: no server round-trip per tab click, and no
  // dependency on how Next's router treats a searchParams-only change on a
  // page that doesn't itself read searchParams.
  function selectTab(value: string) {
    setTab(value);
    window.history.replaceState(null, "", `${pathname}?tab=${value}`);
  }

  function tabClass(active: boolean) {
    return `border-b-2 px-1 pb-3 text-sm font-medium transition ${
      active
        ? "border-accent text-accent"
        : "border-transparent text-slate-500 hover:text-ink"
    }`;
  }

  function outline(s: SyncedSermon) {
    return (
      <div>
        <p className="font-serif font-semibold text-ink">{s.title}</p>
        <p className="text-xs text-slate-500">{formatDate(s.publishedAt)}</p>
        {s.notesHtml ? (
          <div
            className="prose prose-sm prose-slate mt-3 max-w-none prose-a:text-accent"
            dangerouslySetInnerHTML={{ __html: s.notesHtml }}
          />
        ) : (
          s.description && (
            <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{s.description}</p>
          )
        )}
        {!s.sourceRemoved && (
          <a
            href={s.url}
            className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent-hover"
          >
            View on Logos Sermons &rarr;
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-6 border-b border-canvas-border">
        <button
          type="button"
          onClick={() => selectTab("scripture")}
          className={tabClass(tab === "scripture")}
        >
          Scripture
        </button>
        <button
          type="button"
          onClick={() => selectTab("video")}
          className={tabClass(tab === "video")}
        >
          Video
        </button>
        <button
          type="button"
          onClick={() => selectTab("audio")}
          className={tabClass(tab === "audio")}
        >
          Audio
        </button>
        {outlineTabValues.map((tabValue, i) => (
          <button
            key={tabValue}
            type="button"
            onClick={() => selectTab(tabValue)}
            className={tabClass(tab === tabValue)}
          >
            {outlines.length > 1 ? `Outline ${i + 1}` : "Outline"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "scripture" &&
          (verses && verses.length > 0 ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                King James Version
              </p>
              <div className="mt-4 font-serif text-lg leading-relaxed text-ink">
                {verses.map((v) => (
                  <span key={v.verse} className={v.newParagraph ? "mt-4 block" : ""}>
                    <sup className="mr-1 font-sans text-xs font-semibold text-gold">
                      {v.verse}
                    </sup>
                    <span dangerouslySetInnerHTML={{ __html: `${v.html} ` }} />
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Scripture text isn&rsquo;t available for {reference}.
            </p>
          ))}

        {tab === "video" &&
          (videos.length > 0 ? (
            <div className="flex flex-col gap-8">
              {videos.map((s, i) => (
                <div key={s.id}>
                  {videos.length > 1 && (
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gold">
                      Video {i + 1}
                    </p>
                  )}
                  <div className="aspect-video w-full overflow-hidden rounded-lg border border-canvas-border">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube.com/embed/${s.id}`}
                      title={s.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="mt-3 font-serif font-semibold text-ink">{s.title}</p>
                  <p className="text-xs text-slate-500">{formatDate(s.publishedAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No video for {reference} yet.</p>
          ))}

        {tab === "audio" &&
          (audios.length > 0 ? (
            <div className="flex flex-col gap-4">
              {audios.map((s, i) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-canvas-border bg-canvas-elevated p-5"
                >
                  {audios.length > 1 && (
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gold">
                      Audio {i + 1}
                    </p>
                  )}
                  <p className="font-serif font-semibold text-ink">{s.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(s.publishedAt)} &middot; {formatDuration(s.durationSeconds)}
                  </p>
                  <a
                    href={s.url}
                    className="mt-4 inline-block rounded-md bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
                  >
                    Listen on SermonAudio &rarr;
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No audio for {reference} yet.</p>
          ))}

        {outlines.length === 0 && tab === "outline" && (
          <p className="text-sm text-slate-600">
            No outline from Faithlife for {reference} yet.
          </p>
        )}

        {outlines.length > 0 && (
          <div hidden={!tab.startsWith("outline")} className="mb-4">
            <TranslateWidget />
          </div>
        )}

        {outlines.map((s, i) => {
          const tabValue = outlines.length > 1 ? `outline-${i}` : "outline";
          if (tab !== tabValue) return null;
          return <div key={s.id}>{outline(s)}</div>;
        })}
      </div>
    </div>
  );
}
