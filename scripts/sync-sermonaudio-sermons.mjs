// Fetches every sermon for Vision Baptist Church's SermonAudio broadcaster
// account and writes them to content/sermons/sermonaudio.json, tagging each
// with a Bible book/chapter parsed from the API's own "bibleText" field.
//
// Run by .github/workflows/sync-sermonaudio-sermons.yml on a daily schedule.
// Requires a SERMONAUDIO_API_KEY environment variable (from the broadcaster
// account's Dashboard -> Settings).

import fs from "fs";
import path from "path";
import { detectPassage } from "./lib/detect-passage.mjs";

// The numeric ID we were given (20433) turned out not to resolve via the
// API. The broadcaster's public slug does work (sermonaudio.com/broadcasters/
// visionbaptist/), and SermonAudio's speaker endpoint accepts either a
// numeric ID or a name/slug ("speaker_id_or_name") -- broadcasters likely
// work the same way, so resolve the slug to its real numeric ID first
// rather than guessing a number.
const BROADCASTER_SLUG = "visionbaptist";
const API_KEY = process.env.SERMONAUDIO_API_KEY;
const OUTPUT_PATH = path.join(process.cwd(), "content", "sermons", "sermonaudio.json");
const PAGE_SIZE = 100;

async function getJson(url) {
  const res = await fetch(url, {
    headers: { "X-Api-Key": API_KEY },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}): ${url}\n${body}`);
  }
  return res.json();
}

async function getAllSermons(broadcasterId) {
  const results = [];
  let page = 1;

  while (true) {
    const url = `https://api.sermonaudio.com/v2/node/sermons?broadcasterID=${broadcasterId}&page=${page}&pageSize=${PAGE_SIZE}`;
    console.log(`Fetching: ${url}`);
    const data = await getJson(url);

    if (page === 1) {
      console.log(`First page response: totalCount=${data.totalCount}, results.length=${(data.results ?? []).length}`);
      if ((data.results ?? []).length === 0) {
        console.log("Full first-page response for debugging:", JSON.stringify(data, null, 2));
      } else {
        // The API docs didn't reveal the exact "media" object shape, so log
        // one full real sermon once to see it directly.
        console.log("Sample sermon (first result) for field discovery:", JSON.stringify(data.results[0], null, 2));
      }
    }

    results.push(...(data.results ?? []));

    const totalCount = data.totalCount ?? results.length;
    if (results.length >= totalCount || (data.results ?? []).length === 0) break;
    page += 1;
  }

  return results;
}

// Resolves the broadcaster slug to its real numeric ID. Falls back to using
// the slug itself against /v2/node/sermons if resolution fails, in case
// that endpoint also accepts a slug directly.
async function resolveBroadcasterId() {
  const url = `https://api.sermonaudio.com/v2/node/broadcasters/${BROADCASTER_SLUG}`;
  try {
    const data = await getJson(url);
    console.log(`Broadcaster "${BROADCASTER_SLUG}" resolves to:`, JSON.stringify(data, null, 2));
    const id = data.broadcasterID ?? data.id ?? data.nodeID;
    if (id) return String(id);
    console.log("No obvious numeric ID field found in that response; falling back to the slug itself.");
    return BROADCASTER_SLUG;
  } catch (err) {
    console.log(`Could not resolve broadcaster "${BROADCASTER_SLUG}":`, err.message);
    console.log("Falling back to using the slug itself as broadcasterID.");
    return BROADCASTER_SLUG;
  }
}

function main() {
  if (!API_KEY) {
    console.error("Missing SERMONAUDIO_API_KEY environment variable.");
    process.exit(1);
  }

  let resolvedBroadcasterId;
  return resolveBroadcasterId()
    .then((broadcasterId) => {
      resolvedBroadcasterId = broadcasterId;
      return getAllSermons(broadcasterId);
    })
    .then((results) => {
    const sermons = results.map((s) => {
      const { book, chapter } = detectPassage(s.bibleText, s.displayTitle, s.fullTitle);
      const durationSeconds = s.videoDurationSeconds || s.audioDurationSeconds || 0;

      return {
        id: String(s.sermonID),
        title: s.displayTitle || s.fullTitle || "Untitled sermon",
        description: s.bibleText || "",
        publishedAt: s.preachDate || s.publishDate || new Date().toISOString(),
        durationSeconds,
        url: `https://www.sermonaudio.com/sermoninfo.asp?SID=${s.sermonID}`,
        speaker: s.speaker?.displayName,
        book,
        chapter,
      };
    });

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify(
        {
          source: "sermonaudio",
          broadcasterID: resolvedBroadcasterId,
          syncedAt: new Date().toISOString(),
          sermons,
        },
        null,
        2
      )
    );

    console.log(`Synced ${sermons.length} sermons from SermonAudio.`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
