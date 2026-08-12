// Fetches sermon notes from Vision Baptist Church's public Logos Sermons
// profile (sermons.logos.com/profile/vbcsermons) and writes them to
// content/sermons/logos.json, tagging each with a Bible book/chapter parsed
// from the page's own structured "passages" field.
//
// Run by .github/workflows/sync-logos-sermons.yml on a daily schedule.
// No API key needed -- the profile page is public. Requires no secrets.
//
// How this works: the page embeds a `__INITIAL_STATE__` JSON blob with
// everything React needs to render. The account-level flat sermon list
// errors out server-side for reasons we don't control, but each *series*
// page loads cleanly with full sermon data, so this enumerates series from
// the account page and fetches each one individually.
//
// Known gap: sermons not assigned to any series ("No Series" in the site's
// own UI, ~109 of them as of this writing) aren't reachable this way, since
// there's no working endpoint that lists them. Only series-organized
// sermons are synced for now.

import fs from "fs";
import path from "path";
import { detectPassage } from "./lib/detect-passage.mjs";
import { blocksToHtml, blocksToPlainText } from "./lib/parse-logos-blocks.mjs";

const ACCOUNT_SLUG = "vbcsermons";
const OUTPUT_PATH = path.join(process.cwd(), "content", "sermons", "logos.json");
// Sermons that were removed from Faithlife itself (so this sync can no
// longer find them) but should stay on the site anyway. This file is
// hand-edited, not touched by this script or its GitHub Action -- entries
// here only apply as a fallback when Faithlife doesn't already have that
// sermon ID.
const MANUAL_PATH = path.join(process.cwd(), "content", "sermons", "logos-manual.json");

async function fetchState(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${url}`);
  }
  const html = await res.text();

  const marker = "__INITIAL_STATE__ = ";
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) {
    throw new Error(`Could not find __INITIAL_STATE__ in ${url}`);
  }
  const jsonStart = startIdx + marker.length;

  // Brace-match to find the true end of the JSON object literal, respecting
  // string literals so braces inside strings don't confuse the count.
  let depth = 0;
  let inString = false;
  let escaped = false;
  let endIdx = -1;
  for (let i = jsonStart; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
  if (endIdx === -1) {
    throw new Error(`Could not find end of __INITIAL_STATE__ JSON in ${url}`);
  }

  return JSON.parse(html.slice(jsonStart, endIdx));
}

async function getProfileState() {
  return fetchState(`https://sermons.logos.com/profile/${ACCOUNT_SLUG}`);
}

function getAccountImageUrl(profileState) {
  const avatarUrl = profileState.accounts?.[ACCOUNT_SLUG]?.account?.avatarUrl;
  if (!avatarUrl) return undefined;
  // The profile embeds this as a protocol-relative URL (starts with "//").
  return avatarUrl.startsWith("//") ? `https:${avatarUrl}` : avatarUrl;
}

function getSeriesIds(profileState) {
  const seriesIds = profileState.accountSeries?.[ACCOUNT_SLUG]?.seriesIds ?? [];
  console.log(`Found ${seriesIds.length} series (first page) for ${ACCOUNT_SLUG}.`);
  return seriesIds;
}

async function getSeriesData(seriesId) {
  const state = await fetchState(`https://sermons.logos.com/series/${seriesId}`);
  const sermons = Object.values(state.sermons ?? {})
    .map((entry) => entry.sermon)
    .filter(Boolean);
  const cover = state.series?.[seriesId]?.series?.cover;
  const coverImageUrl = cover?.small?.url ?? cover?.url;
  console.log(`Series ${seriesId}: ${sermons.length} sermons.`);
  return { sermons, coverImageUrl };
}

// detectPassage() picks whichever book name is longest among any match
// found in a given string, not the first one in reading order -- fine for a
// short title or passage field, but wrong for a whole multi-thousand-word
// outline that naturally cites other books in cross-references and
// illustrations (grabbed "Leviticus 1:3", quoted mid-sermon, over the real
// "Genesis 6:5-9" opening line). So pull out just the "Text: ..." line
// outlines conventionally open with, and only fall back to that short
// snippet -- never the full notes.
function extractTextLine(notesText) {
  const match = (notesText ?? "").match(/^Text:\s*(.+)$/m);
  return match ? match[1] : "";
}

function mapSermon(raw, seriesCoverImageUrl) {
  const passageText = raw.passages?.[0]?.text ?? "";
  const blocks = raw.sermonText?.sermonEditor?.blocks ?? [];
  const notesHtml = blocksToHtml(blocks);
  const notesText = blocksToPlainText(blocks);
  const { book, chapter } = detectPassage(passageText, raw.title, extractTextLine(notesText));

  return {
    id: String(raw.sermonId),
    title: raw.title || "Untitled sermon",
    description: passageText,
    publishedAt: raw.dateSubmitted || raw.dateModified || new Date().toISOString(),
    durationSeconds: 0,
    url: `https://sermons.logos.com/sermons/${raw.slug}`,
    speaker: raw.speaker?.speakerName,
    notesHtml: notesHtml || undefined,
    notesText: notesText || undefined,
    seriesCoverImageUrl,
    book,
    chapter,
  };
}

async function main() {
  const profileState = await getProfileState();
  const accountImageUrl = getAccountImageUrl(profileState);
  const seriesIds = getSeriesIds(profileState);
  const bySermonId = new Map();

  for (const seriesId of seriesIds) {
    try {
      const { sermons, coverImageUrl } = await getSeriesData(seriesId);
      for (const raw of sermons) {
        bySermonId.set(String(raw.sermonId), mapSermon(raw, coverImageUrl));
      }
    } catch (err) {
      console.warn(`Skipping series ${seriesId}:`, err.message);
    }
  }

  if (fs.existsSync(MANUAL_PATH)) {
    const manual = JSON.parse(fs.readFileSync(MANUAL_PATH, "utf8"));
    for (const raw of manual.sermons ?? []) {
      if (!bySermonId.has(String(raw.id))) {
        bySermonId.set(String(raw.id), raw);
      }
    }
    console.log(`Merged ${manual.sermons?.length ?? 0} manually-preserved sermon(s).`);
  }

  const sermons = Array.from(bySermonId.values());

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(
      {
        source: "logos",
        account: ACCOUNT_SLUG,
        accountImageUrl,
        syncedAt: new Date().toISOString(),
        sermons,
      },
      null,
      2
    )
  );

  console.log(`Synced ${sermons.length} sermons from Logos.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
