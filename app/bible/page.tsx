import { getBibleTree } from "@/lib/study-notes";
import GraphView from "@/components/GraphView";
import BibleViewToggle from "@/components/BibleViewToggle";
import BibleBookSearch from "@/components/BibleBookSearch";

export const metadata = {
  title: "The Bible — EveryVerse.online",
  description:
    "Every book and chapter of the Bible, searchable and readable in full KJV text.",
};

export default function BiblePage() {
  const tree = getBibleTree();

  const listView = <BibleBookSearch tree={tree} />;
  const graphView = <GraphView tree={tree} />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="font-serif text-sm uppercase tracking-[0.2em] text-accent">
        Browse
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink sm:text-4xl">
        The whole Bible
      </h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Every book, every chapter &mdash; search for one below, or browse
        Old Testament first, then New. Every chapter is readable in full;
        bold chapter numbers also have a published study note or sermon.
      </p>

      <div className="mt-8">
        <BibleViewToggle listView={listView} graphView={graphView} />
      </div>
    </div>
  );
}
