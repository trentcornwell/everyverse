import type { BibleTreeTestament } from "@/lib/study-notes";

interface GraphViewProps {
  tree: BibleTreeTestament[];
}

const SIZE = 800;
const CENTER = SIZE / 2;
const HUB_RADIUS = 90;
const BOOK_RADIUS = 260;
const CHAPTER_RADIUS = BOOK_RADIUS + 55;

// Angle 0 = east, increasing clockwise. Old Testament fans out to the west,
// New Testament to the east, each spanning 160° with a gap at top/bottom so
// the two halves read as distinct clusters.
const HUB_ANGLES: Record<string, number> = {
  "Old Testament": 180,
  "New Testament": 0,
};
const ARC_SPANS: Record<string, [number, number]> = {
  "Old Testament": [100, 260],
  "New Testament": [-80, 80],
};

function polar(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

export default function GraphView({ tree }: GraphViewProps) {
  const hubs = tree.map((testament) => {
    const angle = HUB_ANGLES[testament.name] ?? 90;
    return { name: testament.name, angle, ...polar(HUB_RADIUS, angle) };
  });

  const bookNodes = tree.flatMap((testament) => {
    const [start, end] = ARC_SPANS[testament.name] ?? [0, 360];
    const hub = hubs.find((h) => h.name === testament.name)!;
    const n = testament.books.length;

    return testament.books.map((book, i) => {
      const angle = n === 1 ? (start + end) / 2 : start + ((end - start) * i) / (n - 1);
      const pos = polar(BOOK_RADIUS, angle);
      const contentChapters = book.chapters.filter((c) => c.hasContent);
      const chapterNodes = contentChapters.map((c) => ({
        number: c.number,
        ...polar(CHAPTER_RADIUS, angle),
      }));

      return {
        name: book.name,
        slug: book.slug,
        x: pos.x,
        y: pos.y,
        hubX: hub.x,
        hubY: hub.y,
        hasContent: contentChapters.length > 0,
        chapters: chapterNodes,
      };
    });
  });

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto h-auto w-full max-w-2xl"
      role="img"
      aria-label="Graph of the whole Bible, organized by testament and book. Highlighted chapters have a published study note."
    >
      {hubs.map((hub) => (
        <line
          key={`edge-root-${hub.name}`}
          x1={CENTER}
          y1={CENTER}
          x2={hub.x}
          y2={hub.y}
          className="stroke-canvas-border"
          strokeWidth={1.5}
        />
      ))}

      {bookNodes.map((b) => (
        <line
          key={`edge-hub-${b.slug}`}
          x1={b.hubX}
          y1={b.hubY}
          x2={b.x}
          y2={b.y}
          className="stroke-canvas-border"
          strokeWidth={1}
        />
      ))}

      {bookNodes.flatMap((b) =>
        b.chapters.map((c) => (
          <line
            key={`edge-ch-${b.slug}-${c.number}`}
            x1={b.x}
            y1={b.y}
            x2={c.x}
            y2={c.y}
            className="stroke-accent"
            strokeWidth={1.5}
          />
        ))
      )}

      <circle cx={CENTER} cy={CENTER} r={12} className="fill-accent" />
      <text
        x={CENTER}
        y={CENTER - 20}
        textAnchor="middle"
        className="fill-slate-900 text-[13px] font-semibold"
      >
        EveryVerse
      </text>

      {hubs.map((hub) => (
        <g key={hub.name}>
          <circle cx={hub.x} cy={hub.y} r={7} className="fill-slate-600" />
          <title>{hub.name}</title>
          <text
            x={hub.x}
            y={hub.y - 12}
            textAnchor="middle"
            className="fill-slate-700 text-[11px] font-medium"
          >
            {hub.name}
          </text>
        </g>
      ))}

      {bookNodes.map((b) => (
        <g key={b.slug}>
          <circle
            cx={b.x}
            cy={b.y}
            r={b.hasContent ? 5 : 3.5}
            className={b.hasContent ? "fill-accent" : "fill-slate-300"}
          />
          <title>{b.name}</title>
        </g>
      ))}

      {bookNodes.flatMap((b) =>
        b.chapters.map((c) => (
          <a key={`${b.slug}-${c.number}`} href={`/chapter/${b.slug}/${c.number}`}>
            <circle
              cx={c.x}
              cy={c.y}
              r={6}
              className="fill-accent stroke-white transition hover:opacity-80"
              strokeWidth={1.5}
            />
            <text
              x={c.x}
              y={c.y + 16}
              textAnchor="middle"
              className="fill-accent pointer-events-none text-[11px] font-semibold"
            >
              {b.name} {c.number}
            </text>
          </a>
        ))
      )}
    </svg>
  );
}
