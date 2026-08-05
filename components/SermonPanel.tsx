import Link from "next/link";
import type { Sermon } from "@/lib/types";
import type { Sermon as SyncedSermon } from "@/lib/sermons";
import { formatDuration } from "@/lib/sermon-format";

interface SermonPanelProps {
  reference: string;
  sermon?: Sermon;
  syncedSermons: SyncedSermon[];
}

const SOURCE_LABELS: Record<string, string> = {
  youtube: "YouTube",
  sermonaudio: "SermonAudio",
  logos: "Logos",
};

export default function SermonPanel({
  reference,
  sermon,
  syncedSermons,
}: SermonPanelProps) {
  if (!sermon && syncedSermons.length === 0) {
    return (
      <div className="rounded-lg border border-canvas-border bg-canvas-panel p-5 text-sm text-slate-600">
        No sermon has been posted for {reference} yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sermon && (
        <div className="rounded-lg border border-canvas-border bg-canvas-elevated p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            {sermon.title}
          </h3>
          {sermon.datePreached && (
            <p className="mt-1 text-xs text-slate-500">
              Preached at Vision Baptist Church on{" "}
              {new Date(sermon.datePreached).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </p>
          )}
          <p className="mt-2 text-sm text-slate-600">{sermon.description}</p>
          {sermon.url ? (
            <a
              href={sermon.url}
              className="mt-4 inline-block rounded-md bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Watch or listen
            </a>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              Audio and video for this sermon are coming soon.
            </p>
          )}
        </div>
      )}

      {syncedSermons.length > 0 && (
        <div>
          {sermon && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recordings
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {syncedSermons.map((s) => (
              <li key={`${s.source}-${s.id}`}>
                <Link
                  href={`/sermons/${s.id}`}
                  className="flex flex-col gap-1 rounded-lg border border-canvas-border bg-canvas-elevated p-4 transition hover:border-accent/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {new Date(s.publishedAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {" · "}
                      {SOURCE_LABELS[s.source] ?? s.source}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-slate-500">
                    {s.source === "logos" ? "Notes" : formatDuration(s.durationSeconds)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
