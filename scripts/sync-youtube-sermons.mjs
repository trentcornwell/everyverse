// Fetches every video from the Vision Baptist Church of South Forsyth YouTube
// channel and writes them to content/sermons/youtube.json, tagging each with
// a detected Bible book/chapter parsed from its title or description.
//
// Run by .github/workflows/sync-youtube-sermons.yml on a daily schedule.
// Requires a YOUTUBE_API_KEY environment variable (a Google Cloud API key
// with the YouTube Data API v3 enabled).

import fs from "fs";
import path from "path";
import { detectPassage } from "./lib/detect-passage.mjs";

const CHANNEL_ID = "UCODWmDl_U6I_XQbSKwOZzyw"; // Vision Baptist Church of South Forsyth
const API_KEY = process.env.YOUTUBE_API_KEY;
const OUTPUT_PATH = path.join(process.cwd(), "content", "sermons", "youtube.json");
// Hand-maintained book/chapter overrides for videos whose title/description
// has nothing for detectPassage() to find (generic titles like "Sunday AM -
// August 9, 2026" with an empty description). Not touched by this script or
// its GitHub Action -- applied after normal detection, keyed by video ID.
const OVERRIDES_PATH = path.join(process.cwd(), "content", "sermons", "youtube-overrides.json");

function parseIsoDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${url}`);
  }
  return res.json();
}

async function getUploadsPlaylistId() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;
  const data = await getJson(url);
  const playlistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) throw new Error("Could not resolve channel's uploads playlist.");
  return playlistId;
}

async function getAllPlaylistItems(playlistId) {
  const items = [];
  let pageToken = "";
  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${pageToken}&key=${API_KEY}`;
    const data = await getJson(url);
    items.push(...(data.items ?? []));
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);
  return items;
}

async function getDurations(videoIds) {
  const durations = new Map();
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batch.join(",")}&key=${API_KEY}`;
    const data = await getJson(url);
    for (const item of data.items ?? []) {
      durations.set(item.id, parseIsoDuration(item.contentDetails.duration));
    }
  }
  return durations;
}

async function main() {
  if (!API_KEY) {
    console.error("Missing YOUTUBE_API_KEY environment variable.");
    process.exit(1);
  }

  const playlistId = await getUploadsPlaylistId();
  const items = await getAllPlaylistItems(playlistId);

  const videos = items
    .filter((item) => item.snippet?.resourceId?.videoId)
    .map((item) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description ?? "",
      publishedAt: item.snippet.publishedAt,
    }));

  const durations = await getDurations(videos.map((v) => v.id));

  const overrides = fs.existsSync(OVERRIDES_PATH)
    ? JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8"))
    : {};

  const sermons = videos.map((v) => {
    const detected = detectPassage(v.title, v.description);
    const { book, chapter } = overrides[v.id] ?? detected;
    return {
      id: v.id,
      title: v.title,
      description: v.description,
      publishedAt: v.publishedAt,
      durationSeconds: durations.get(v.id) ?? 0,
      url: `https://www.youtube.com/watch?v=${v.id}`,
      book,
      chapter,
    };
  });

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(
      {
        source: "youtube",
        channelId: CHANNEL_ID,
        syncedAt: new Date().toISOString(),
        sermons,
      },
      null,
      2
    )
  );

  console.log(`Synced ${sermons.length} sermons from YouTube.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
