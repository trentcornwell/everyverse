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

const BROADCASTER_ID = "20433"; // Vision Baptist Church (visionbaptist)
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

async function getAllSermons() {
  const results = [];
  let page = 1;

  while (true) {
    const url = `https://api.sermonaudio.com/v2/node/sermons?broadcasterID=${BROADCASTER_ID}&page=${page}&pageSize=${PAGE_SIZE}`;
    console.log(`Fetching: ${url}`);
    const data = await getJson(url);

    if (page === 1) {
      console.log(`First page response: totalCount=${data.totalCount}, results.length=${(data.results ?? []).length}`);
      if ((data.results ?? []).length === 0) {
        console.log("Full first-page response for debugging:", JSON.stringify(data, null, 2));
      }
    }

    results.push(...(data.results ?? []));

    const totalCount = data.totalCount ?? results.length;
    if (results.length >= totalCount || (data.results ?? []).length === 0) break;
    page += 1;
  }

  return results;
}

async function checkBroadcaster() {
  const url = `https://api.sermonaudio.com/v2/node/broadcasters/${BROADCASTER_ID}`;
  try {
    const data = await getJson(url);
    console.log(`Broadcaster ${BROADCASTER_ID} resolves to:`, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(`Could not resolve broadcaster ${BROADCASTER_ID}:`, err.message);
  }
}

function main() {
  if (!API_KEY) {
    console.error("Missing SERMONAUDIO_API_KEY environment variable.");
    process.exit(1);
  }

  return checkBroadcaster().then(() => getAllSermons()).then((results) => {
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
          broadcasterID: BROADCASTER_ID,
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
