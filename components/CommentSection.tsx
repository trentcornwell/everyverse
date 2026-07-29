"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";
import type { VerseComment } from "@/lib/types";

interface CommentSectionProps {
  reference: string;
  seedComments: VerseComment[];
  title?: string;
  formPlaceholder?: string;
}

export default function CommentSection({
  reference,
  seedComments,
  title = "Commentary",
  formPlaceholder,
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
    <section>
      <h2 className="text-xl font-semibold text-slate-900">
        {title} on {reference}{" "}
        <span className="text-slate-500">({comments.length})</span>
      </h2>

      <div className="mt-4">
        <CommentForm onSubmit={addComment} placeholder={formPlaceholder} />
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {comments.length === 0 && (
          <li className="text-sm text-slate-500">
            No comments yet &mdash; be the first to share your thoughts.
          </li>
        )}
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="rounded-lg border border-canvas-border bg-canvas-elevated p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-800">
                {comment.author}
              </span>
              <time
                className="text-xs text-slate-500"
                dateTime={comment.createdAt}
              >
                {new Date(comment.createdAt).toLocaleString()}
              </time>
            </div>
            <p className="mt-2 text-sm text-slate-600">{comment.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
