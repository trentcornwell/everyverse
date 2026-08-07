"use client";

import { useState } from "react";

interface CommentFormProps {
  onSubmit: (author: string, text: string) => void;
  placeholder?: string;
}

export default function CommentForm({
  onSubmit,
  placeholder = "Share what this verse means to you...",
}: CommentFormProps) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    onSubmit(author.trim() || "Anonymous", text.trim());
    setText("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-canvas-border bg-canvas-elevated p-5"
    >
      <h3 className="text-lg font-semibold text-ink">
        Add your thoughts
      </h3>
      <div className="mt-4 flex flex-col gap-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          className="rounded-md border border-canvas-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={3}
          required
          className="rounded-md border border-canvas-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Comments aren&rsquo;t saved yet &mdash; persistent storage is
            coming soon.
          </p>
          <button
            type="submit"
            className="shrink-0 rounded-md bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            Post comment
          </button>
        </div>
      </div>
    </form>
  );
}
