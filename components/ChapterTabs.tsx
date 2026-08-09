"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Sermon as SyncedSermon } from "@/lib/sermons";
import type { ChapterVerse } from "@/lib/kjv";
import { formatDuration } from "@/lib/sermon-format";
import TranslateWidget from "./TranslateWidget";

type Tab = "scripture" | "video" | "audio" | "outline";
const TAB_VALUES: Tab[] = ["scripture", "video", "audio", "outline"];

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
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab: Tab = TAB_VALUES.includes(requestedTab as Tab)
    ? (requestedTab as Tab)
    : "scripture";
  const [tab, setTab] = useState<Tab>(initialTab);

  const videos = syncedSermons.filter((s) => s.source === "youtube");
  const audios = syncedSermons.filter((s) => s.source === "sermonaudio");
  const outlines = syncedSermons.filter((s) => s.source === "logos");

  function tabClass(active: boolean) {
    return `border-b-2 px-1 pb-3 text-sm font-medium transition ${
      active
        ? "border-accent text-accent"
        : "border-transparent text-slate-500 hover:text-ink"
    }`;
  }

  return (
    <div>
      <div className="flex gap-6 border-b border-canvas-border">
        <button
          type="button"
          onClick={() => setTab("scripture")}
          className={tabClass(tab === "scripture")}
        >
          Scripture
        </button>
        <button
          type="button"
          onClick={() => setTab("video")}
          className={tabClass(tab === "video")}
        >
          Video
        </button>
        <button
          type="button"
          onClick={() => setTab("audio")}
          className={tabClass(tab === "audio")}
        >
          Audio
        </button>
        <button
          type="button"
          onClick={() => setTab("outline")}
          className={tabClass(tab === "outline")}
        >
          Outline
        </button>
      </div>

      <div className="mt-6">
        {tab === "scripture" &&
          (verses && verses.length > 0 ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                King James Version
              </p>
              <div className="mt-4 font-serif text-lg leading-relaxed text-ink">
                {verses.map((v) => (
                  <span key={v.verse} className={v.newParagraph ? "mt-4 block" : ""}>
                    <sup className="mr-1 font-sans text-xs font-semibold text-accent">
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
              {videos.map((s) => (
                <div key={s.id}>
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
              {audios.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-canvas-border bg-canvas-elevated p-5"
                >
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

        {tab === "outline" &&
          (outlines.length > 0 ? (
            <div className="flex flex-col gap-8">
              <TranslateWidget />
              {outlines.map((s) => (
                <div key={s.id}>
                  <p className="font-serif font-semibold text-ink">{s.title}</p>
                  <p className="text-xs text-slate-500">{formatDate(s.publishedAt)}</p>
                  {s.notesHtml ? (
                    <div
                      className="prose prose-sm prose-slate mt-3 max-w-none prose-a:text-accent"
                      dangerouslySetInnerHTML={{ __html: s.notesHtml }}
                    />
                  ) : (
                    s.description && (
                      <p className="mt-3 whitespace-pre-line text-sm text-slate-600">
                        {s.description}
                      </p>
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
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              No outline from Faithlife for {reference} yet.
            </p>
          ))}
      </div>
    </div>
  );
}
