// Shared by the sync scripts: detects which service a sermon was preached
// at (Sunday AM, Sunday PM, Wednesday, Sunday School) from freeform text.
//
// The church's YouTube descriptions consistently open with one of these
// tags (e.g. "Sunday AM 8-9-26 Pastor Trent Cornwell", "Back to School
// Sunday Sunday AM 8-2-26 ..."), so this looks for the tag anywhere in the
// text rather than requiring it at the very start.
export function detectServiceType(...texts) {
  const haystack = texts.filter(Boolean).join(" ");
  if (/\bSunday\s+AM\b/i.test(haystack)) return "Sunday AM";
  if (/\bSunday\s+PM\b/i.test(haystack)) return "Sunday PM";
  if (/\bSunday\s+School\b/i.test(haystack)) return "Sunday School";
  if (/\bWednesday\b/i.test(haystack)) return "Wednesday";
  return undefined;
}

// Normalizes SermonAudio's own `eventType`/`displayEventType` values (e.g.
// "sunday_am", "Sunday - AM Service") down to the same small vocabulary as
// detectServiceType(), so both sources agree on what "Sunday AM" means.
export function normalizeSermonAudioEventType(eventType, displayEventType) {
  const haystack = `${eventType ?? ""} ${displayEventType ?? ""}`;
  if (/sunday.*\bam\b|\bam\b.*sunday/i.test(haystack)) return "Sunday AM";
  if (/sunday.*\bpm\b|\bpm\b.*sunday/i.test(haystack)) return "Sunday PM";
  if (/sunday.*school/i.test(haystack)) return "Sunday School";
  if (/wednesday|midweek/i.test(haystack)) return "Wednesday";
  return undefined;
}
