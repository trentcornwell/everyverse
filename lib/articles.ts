import "server-only";

// Reads Trent's synced Substack posts from content/articles/substack.json,
// regenerated wholesale by a scheduled GitHub Action (see
// .github/workflows/sync-substack-articles.yml and
// scripts/sync-substack-articles.mjs) -- same no-database pattern as
// sermons and study notes elsewhere in this project.

import fs from "fs";
import path from "path";

const ARTICLES_PATH = path.join(process.cwd(), "content", "articles", "substack.json");

export interface Article {
  title: string;
  excerpt: string;
  url: string;
  publishedAt: string;
  author?: string;
  imageUrl?: string;
}

function loadArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf8"));
    return data.articles ?? [];
  } catch {
    return [];
  }
}

// The homepage's "Featured Article" -- the most recent Substack post(s).
export function getFeaturedArticles(limit = 1): Article[] {
  return loadArticles()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}
