// Pure formatting helpers with no filesystem access, safe to import from
// client components. Keep data-loading (which needs fs) in lib/sermons.ts.

import { slugifyBook } from "./bible-data";
import type { Sermon } from "./sermons";

// Where a sermon link should point: its chapter page (deep-linked to the
// tab matching its source) when it has a detected book/chapter, since
// that's the primary way to reach sermons on this site now. Falls back to
// the standalone /sermons/[id] page only for sermons with no chapter to
// route to (special events, Q&As, etc. -- no passage was detected).
export function getSermonHref(sermon: Sermon): string {
  if (sermon.book && sermon.chapter) {
    const tab = sermon.source === "youtube" ? "video" : sermon.source === "sermonaudio" ? "audio" : "outline";
    return `/chapter/${slugifyBook(sermon.book)}/${sermon.chapter}?tab=${tab}`;
  }
  return `/sermons/${sermon.id}`;
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
