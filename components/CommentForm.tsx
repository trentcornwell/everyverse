"use client";

import { useState } from "react";

interface CommentFormProps {
  onSubmit: (author: string, text: string) => void;
}

export default function CommentForm({ onSubmit }: CommentFormProps) {
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
      className="rounded-xl border border-ink-900/10 bg-white/70 p-5"
    >
      <h3 className="font-serif text-lg font-semibold">Add your thoughts</h3>
      <div className="mt-4 flex flex-col gap-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          className="rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm focus:border-ink-900/40 focus:outline-none"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share what this verse means to you..."
          rows={3}
          required
          className="rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm focus:border-ink-900/40 focus:outline-none"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-900/40">
            Comments aren&rsquo;t saved yet &mdash; persistent storage is
            coming soon.
          </p>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ink-900 px-5 py-2 text-sm font-medium text-parchment-50 transition hover:bg-ink-900/90"
          >
            Post comment
          </button>
        </div>
      </div>
    </form>
  );
}
