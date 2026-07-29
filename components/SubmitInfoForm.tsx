"use client";

import { useState } from "react";

const CONTACT_EMAIL = "Trent@VisionBaptist.com";

export default function SubmitInfoForm() {
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!info.trim()) return;

    const subject = `Info submission${name.trim() ? ` from ${name.trim()}` : ""}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(info.trim())}`;
    window.location.href = mailto;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-canvas-border bg-canvas-elevated p-5 text-left"
    >
      <h3 className="text-lg font-semibold text-slate-900">Submit info</h3>
      <p className="mt-1 text-sm text-slate-600">
        Know of a sermon link, correction, or anything else we should add?
        Let us know.
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="rounded-md border border-canvas-border bg-canvas px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <textarea
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          placeholder="What would you like to share?"
          rows={3}
          required
          className="rounded-md border border-canvas-border bg-canvas px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Opens your email app, addressed to {CONTACT_EMAIL}.
          </p>
          <button
            type="submit"
            className="shrink-0 rounded-md bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}
