import type { Sermon } from "@/lib/types";

interface SermonPanelProps {
  reference: string;
  sermon?: Sermon;
}

export default function SermonPanel({ reference, sermon }: SermonPanelProps) {
  if (!sermon) {
    return (
      <div className="rounded-lg border border-canvas-border bg-canvas-panel p-5 text-sm text-slate-600">
        No sermon has been posted for {reference} yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-canvas-border bg-canvas-elevated p-5">
      <h3 className="text-lg font-semibold text-slate-900">
        {sermon.title}
      </h3>
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
  );
}
