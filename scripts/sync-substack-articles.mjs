// Fetches Trent's Substack RSS feed and writes it to
// content/articles/substack.json for the homepage's Featured Article.
//
// Run by .github/workflows/sync-substack-articles.yml on a daily schedule.
// The feed is public -- no API key or auth needed.

import fs from "fs";
import path from "path";

const FEED_URL = "https://trentoncornwell.substack.com/feed";
const OUTPUT_PATH = path.join(process.cwd(), "content", "articles", "substack.json");

function extractCdataOrText(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return plain ? plain[1].trim() : "";
}

function parseFeedItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml))) {
    const block = match[1];
    const title = extractCdataOrText(block, "title");
    const excerpt = extractCdataOrText(block, "description");
    const url = extractCdataOrText(block, "link");
    const pubDate = extractCdataOrText(block, "pubDate");
    const author = extractCdataOrText(block, "dc:creator");
    const imageMatch = block.match(/<enclosure url="([^"]+)"/);

    if (!title || !url) continue;

    items.push({
      title,
      excerpt,
      url,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      author: author || undefined,
      imageUrl: imageMatch ? imageMatch[1] : undefined,
    });
  }
  return items;
}

async function main() {
  const res = await fetch(FEED_URL);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${FEED_URL}`);
  }
  const xml = await res.text();
  const articles = parseFeedItems(xml).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(
      {
        source: "substack",
        feedUrl: FEED_URL,
        syncedAt: new Date().toISOString(),
        articles,
      },
      null,
      2
    )
  );

  console.log(`Synced ${articles.length} articles from Substack.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
