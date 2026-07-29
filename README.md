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
- [Tailwind CSS](https://tailwindcss.com/) for styling
- No database yet &mdash; verse text and comments are in-memory sample data

## Project structure

```
app/
  layout.tsx                          Root layout (wraps everything in AppShell)
  page.tsx                            Landing page
  verse/[book]/[chapter]/[verse]/
    page.tsx                          Verse + commentary split-view page
components/
  AppShell.tsx                        Sidebar + top bar shell, owns mobile drawer state
  Sidebar.tsx, TopBar.tsx, SearchBar.tsx   Navigation UI
  VerseDisplay.tsx                    Renders the KJV verse text
  CommentSection.tsx, CommentForm.tsx Comments UI (client-side state only)
  Footer.tsx
lib/
  bible-data.ts                       Sample KJV verse data, lookup + Bible tree helpers
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
