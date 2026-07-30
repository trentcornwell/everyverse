// Fetches every video from the Vision Baptist Church of South Forsyth YouTube
// channel and writes them to content/sermons/youtube.json, tagging each with
// a detected Bible book/chapter parsed from its title or description.
//
// Run by .github/workflows/sync-youtube-sermons.yml on a daily schedule.
// Requires a YOUTUBE_API_KEY environment variable (a Google Cloud API key
// with the YouTube Data API v3 enabled).

import fs from "fs";
import path from "path";

const CHANNEL_ID = "UCODWmDl_U6I_XQbSKwOZzyw"; // Vision Baptist Church of South Forsyth
const API_KEY = process.env.YOUTUBE_API_KEY;
const OUTPUT_PATH = path.join(process.cwd(), "content", "sermons", "youtube.json");

// Keep this in sync with lib/bible-data.ts's BOOKS list. Duplicated here so
// this script has no dependency on the TypeScript build.
const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
  "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation",
].sort((a, b) => b.length - a.length); // longest/most specific first (e.g. "1 John" before "John")

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectPassage(title, description) {
  for (const text of [title, description]) {
    for (const book of BOOKS) {
      const re = new RegExp(`\\b${escapeRegex(book)}\\s+(\\d{1,3})\\b`, "i");
      const match = text.match(re);
      if (match) {
        return { book, chapter: Number(match[1]) };
      }
    }
  }
  return { book: undefined, chapter: undefined };
}

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

  const sermons = videos.map((v) => {
    const { book, chapter } = detectPassage(v.title, v.description);
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
