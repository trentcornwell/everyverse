# EveryVerse.online

A collaborative Bible commentary platform. **Every Verse, Every Nation.**

This is an early-stage build: structure and UI first, with a real database
and search to follow.

## What's here

- **Landing page** (`/`) &mdash; explains the "Every Verse, Every Nation"
  concept and links to a few featured verses.
- **Verse pages** (`/verse/[book]/[chapter]/[verse]`) &mdash; e.g.
  [`/verse/john/3/16`](http://localhost:3000/verse/john/3/16) &mdash; display
  the KJV text for a verse along with a comments/annotation section below it.
- **Comment form** &mdash; visitors can add a comment under any verse. This is
  currently in-memory only (state resets on page refresh); no database is
  connected yet.
- **Search bar** in the header &mdash; UI only for now. It can parse a simple
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
  layout.tsx                          Root layout (Header + Footer)
  page.tsx                            Landing page
  verse/[book]/[chapter]/[verse]/
    page.tsx                          Verse + commentary page
components/
  Header.tsx, SearchBar.tsx           Site header + search UI
  VerseDisplay.tsx                    Renders the KJV verse text
  CommentSection.tsx, CommentForm.tsx Comments UI (client-side state only)
  Footer.tsx
lib/
  bible-data.ts                       Sample KJV verse data + lookup helpers
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
