# EveryVerse.online

A collaborative Bible commentary platform. **Every Verse, Every Nation.**

This is an early-stage build: structure and UI first, with a real database
and search to follow.

## Design

The UI takes visual cues from Obsidian: a dark, calm, low-chrome theme with a
single accent color, a collapsible left sidebar for navigation, and a
split-view reading layout (Scripture next to its commentary rather than
stacked below it).

- **App shell** (`components/AppShell.tsx`) &mdash; a persistent left sidebar
  plus a top bar wrapping every page.
- **Sidebar** (`components/Sidebar.tsx`) &mdash; a jump-to-verse search box and
  a collapsible Old/New Testament &rarr; book &rarr; chapter &rarr; verse
  tree. Books/chapters only expand into real links where sample verse data
  exists; everything else is listed but greyed out. Collapses into a
  slide-out drawer on mobile (toggled from the top bar's menu button).
- **Top bar** (`components/TopBar.tsx`) &mdash; shows the current book/chapter
  reference and a translation indicator (KJV only for now).

## What's here

- **Landing page** (`/`) &mdash; explains the "Every Verse, Every Nation"
  concept and links to a few featured verses.
- **Verse pages** (`/verse/[book]/[chapter]/[verse]`) &mdash; e.g.
  [`/verse/john/3/16`](http://localhost:3000/verse/john/3/16) &mdash; display
  the KJV text for a verse in a split view, with the comments/annotation
  section beside it (stacked on mobile).
- **Comment form** &mdash; visitors can add a comment under any verse. This is
  currently in-memory only (state resets on page refresh); no database is
  connected yet.
- **Search bar** in the sidebar &mdash; UI only for now. It can parse a simple
  reference like `John 3:16` and jump to that verse's page, but there's no
  full-text or topical search backend yet.

## Bible text

A small hand-picked set of well-known KJV verses lives in
[`lib/bible-data.ts`](lib/bible-data.ts) (Genesis 1:1&ndash;3, Psalm 23, John
3:16, Romans 8:28, etc.). Requesting a verse outside that sample set will show
a friendly "not in our sample dataset yet" message with links back to verses
that do work. This will be replaced by a full KJV dataset once the database
layer is added.

## Connecting Obsidian

Study notes and sermon info for each chapter come from markdown files in
[`content/study-notes/`](content/study-notes/) instead of a database. This
lets you write in Obsidian and publish by pushing to this repo &mdash; no
backend required yet.

**File format** &mdash; one file per chapter, named however you like (e.g.
`genesis-6.md`):

```markdown
---
book: Genesis
chapter: 6
author: Trent Cornwell
date: 2026-07-14
sermonTitle: When Wickedness Filled the Earth
sermonDescription: A short summary of the sermon.
sermonUrl: https://example.com/watch (optional, once you have one)
---
The body of the file is the study note itself, written in normal Markdown
(bold, links, lists, etc. all render on the site).
```

- `book` must match a real Bible book name (e.g. `Genesis`, `1 Corinthians`) or the file is skipped with a warning at build time.
- The `sermon*` fields are optional; leave them out if there's no sermon yet, or add just the fields you have.
- A chapter only becomes bold/clickable in the sidebar once a file like this exists for it &mdash; see [`lib/study-notes.ts`](lib/study-notes.ts).

**Recommended workflow with Obsidian:**

1. In your Obsidian vault, keep a dedicated folder for content you're okay publishing publicly (not your whole vault).
2. Install the community plugin **Obsidian Git**.
3. Point that plugin at this repository (or set it up to auto-commit/push a linked folder), so saving a note in Obsidian pushes the corresponding `.md` file into `content/study-notes/`.
4. Push to `main` as usual (auto or manual) &mdash; Vercel rebuilds the site with the new note.

This is deliberately git-based rather than live/real-time: it fits how the
site already deploys (push &rarr; rebuild), and doesn't require Obsidian to
stay running or reachable from the internet. Once a real database exists,
this can be swapped for something closer to real-time without changing the
file format.

## Getting started

Requires Node.js 18.18+ (Node 20+ recommended).

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint the project
```

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling, plus `@tailwindcss/typography` for rendering markdown notes
- `gray-matter` + `marked` to parse the markdown study notes; `server-only` to keep that filesystem code out of client bundles
- No database yet &mdash; verse text is in-memory sample data; study notes/sermons come from markdown files (see "Connecting Obsidian" above); visitor comments are client-side only

## Project structure

```
content/
  study-notes/*.md                    Chapter study notes + sermon info (synced from Obsidian)
app/
  layout.tsx                          Root layout (wraps everything in AppShell)
  page.tsx                            Landing page
  chapter/[book]/[chapter]/
    page.tsx                          Chapter page: Study Notes + Sermons tabs
  verse/[book]/[chapter]/[verse]/
    page.tsx                          Verse + commentary split-view page
components/
  AppShell.tsx                        Sidebar + top bar shell, owns mobile drawer state
  Sidebar.tsx, TopBar.tsx, SearchBar.tsx   Navigation UI
  VerseDisplay.tsx                    Renders the KJV verse text
  ChapterTabs.tsx, SermonPanel.tsx     Chapter page tabs
  CommentSection.tsx, CommentForm.tsx Comments/study notes UI (client-side additions only)
  SubmitInfoForm.tsx                  Mailto-based "submit info" form
  Footer.tsx
lib/
  bible-data.ts                       Book list, chapter counts, sample KJV verse text (safe for client)
  study-notes.ts                      Reads content/study-notes/*.md (server-only, uses fs)
  types.ts                            Shared TypeScript types
```

## Known limitations

`npm audit` will report some advisories against Next.js and the ESLint
toolchain. The Next.js ones are all tied to features this app doesn't use yet
(Image Optimization, Middleware, custom rewrites/i18n); the ESLint ones are a
dev-only lint dependency chain and never ship to production. Worth
re-checking before a production deploy, but not blocking for local dev.

## Roadmap

- [ ] Connect a real database for verses and comments
- [ ] Full KJV (and other translation) text coverage
- [ ] Wire up the search bar to real full-text/topical search
- [ ] User accounts/authentication for attributed comments
- [ ] Moderation tools for comments

### Deferred design ideas

The Obsidian-inspired design brief this UI is based on included several
features that are intentionally not built yet, since they need real data or a
backend to be meaningful:

- [ ] Graph view (global and per-chapter) linking chapters/themes
- [ ] Tags and wiki-style `[[links]]` between comments
- [ ] Reactions (helpful / insightful / question / amen) on comments
- [ ] Threaded/nested comment replies
- [ ] Backlinks panel ("referenced in these other commentaries...")
- [ ] Command palette (Cmd/Ctrl+K)
- [ ] Contributors/people directory, reputation-based moderation
- [ ] Personal vault mode (private notes, optional publish to the hive)
- [ ] Light / OLED pure-black theme variants (dark is the only theme for now)
