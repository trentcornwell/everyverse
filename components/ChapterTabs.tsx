"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CommentSection from "./CommentSection";
import SermonPanel from "./SermonPanel";
import type { Sermon, VerseComment } from "@/lib/types";
import type { Sermon as SyncedSermon } from "@/lib/sermons";

type Tab = "notes" | "sermons";

interface ChapterTabsProps {
  reference: string;
  studyNotes: VerseComment[];
  sermon?: Sermon;
  syncedSermons: SyncedSermon[];
}

export default function ChapterTabs({
  reference,
  studyNotes,
  sermon,
  syncedSermons,
}: ChapterTabsProps) {
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get("tab") === "sermons" ? "sermons" : "notes";
  const [tab, setTab] = useState<Tab>(initialTab);

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
          onClick={() => setTab("notes")}
          className={tabClass(tab === "notes")}
        >
          Study Notes
        </button>
        <button
          type="button"
          onClick={() => setTab("sermons")}
          className={tabClass(tab === "sermons")}
        >
          Sermons
        </button>
      </div>

      <div className="mt-6">
        {tab === "notes" ? (
          <CommentSection
            reference={reference}
            seedComments={studyNotes}
            title="Study Notes"
            formPlaceholder="Share a thought or question about this chapter..."
          />
        ) : (
          <SermonPanel
            reference={reference}
            sermon={sermon}
            syncedSermons={syncedSermons}
          />
        )}
      </div>
    </div>
  );
}
