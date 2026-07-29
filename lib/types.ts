export interface VerseComment {
  id: string;
  author: string;
  text: string;
  // Rendered HTML for notes authored in trusted markdown files (e.g. synced
  // from Obsidian). Never set for on-site visitor submissions, which are
  // always rendered as plain text to avoid injecting untrusted HTML.
  html?: string;
  createdAt: string;
}

export interface Sermon {
  title: string;
  description: string;
  url?: string;
}
