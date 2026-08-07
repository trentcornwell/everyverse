"use client";

import { useState } from "react";

type View = "list" | "graph";

interface BibleViewToggleProps {
  listView: React.ReactNode;
  graphView: React.ReactNode;
}

export default function BibleViewToggle({
  listView,
  graphView,
}: BibleViewToggleProps) {
  const [view, setView] = useState<View>("list");

  function tabClass(active: boolean) {
    return `rounded-md px-4 py-1.5 text-sm font-medium transition ${
      active
        ? "bg-accent text-white"
        : "border border-canvas-border text-slate-700 hover:border-slate-400"
    }`;
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setView("list")}
          className={tabClass(view === "list")}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => setView("graph")}
          className={tabClass(view === "graph")}
        >
          Graph
        </button>
      </div>

      <div className="mt-6" hidden={view !== "list"}>
        {listView}
      </div>
      <div className="mt-6" hidden={view !== "graph"}>
        {graphView}
      </div>
    </div>
  );
}
