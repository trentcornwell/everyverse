"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";
import type { VerseComment } from "@/lib/types";

interface CommentSectionProps {
  reference: string;
  seedComments: VerseComment[];
}

export default function CommentSection({
  reference,
  seedComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<VerseComment[]>(seedComments);

  function addComment(author: string, text: string) {
    const comment: VerseComment = {
      id: crypto.randomUUID(),
      author,
      text,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [comment, ...prev]);
  }

  return (
    <section className="mt-10">
      <h2 className="font-serif text-xl font-semibold">
        Commentary on {reference}{" "}
        <span className="text-ink-900/40">({comments.length})</span>
      </h2>

      <div className="mt-4">
        <CommentForm onSubmit={addComment} />
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {comments.length === 0 && (
          <li className="text-sm text-ink-900/50">
            No comments yet &mdash; be the first to share your thoughts.
          </li>
        )}
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="rounded-xl border border-ink-900/10 bg-white/70 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{comment.author}</span>
              <time
                className="text-xs text-ink-900/40"
                dateTime={comment.createdAt}
              >
                {new Date(comment.createdAt).toLocaleString()}
              </time>
            </div>
            <p className="mt-2 text-sm text-ink-900/80">{comment.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
