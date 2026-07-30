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
`Chapter 6.md`), anywhere under `content/study-notes/` &mdash; subfolders are
fine and encouraged. The vault (and this repo) organize notes as:

```
content/study-notes/
  Old Testament/
    Genesis/
      Chapter 6.md
    Exodus/
      .gitkeep        (empty book folders keep a placeholder so git tracks them)
    ...
  New Testament/
    Matthew/
    ...
```

Folder location is just for your own organization in Obsidian &mdash; it's
the frontmatter, not the file path, that actually tells the site which
chapter a note belongs to:

```markdown
---
book: Genesis
chapter: 6
author: Trent Cornwell
date: 2026-07-14
sermonTitle: When Wickedness Filled the Earth
sermonDescription: A short summary of the sermon.
sermonDate: 2026-06-07 (the date it was preached at Vision Baptist Church)
sermonUrl: https://example.com/watch (optional, once you have one)
---
The body of the file is the study note itself, written in normal Markdown
(bold, links, lists, etc. all render on the site).
```

- `book` must match a real Bible book name (e.g. `Genesis`, `1 Corinthians`) or the file is skipped with a warning at build time.
- The `sermon*` fields are optional; leave them out if there's no sermon yet, or add just the fields you have.
- A chapter only becomes bold/clickable in the sidebar once a file like this exists for it &mdash; see [`lib/study-notes.ts`](lib/study-notes.ts), which walks `content/study-notes/` recursively.

### Bridging the EveryVerseOBS vault

Notes are written in a dedicated Obsidian vault (**EveryVerseOBS**), which is
its own git repo &mdash; separate from this site's repo. A small GitHub
Action in the vault repo mirrors its notes into this repo's
`content/study-notes/` folder on every push, which then triggers Vercel's
normal rebuild. This is deliberately git-based rather than live/real-time: it
fits how the site already deploys (push &rarr; rebuild), and doesn't require
Obsidian to stay running or reachable from the internet.

```
EveryVerseOBS vault (Obsidian, own git repo)
  study-notes/*.md  ──push──▶  GitHub Action  ──push──▶  everyverse repo
                                                          content/study-notes/*.md
                                                          └─▶ Vercel rebuild
```

**One-time setup (all manual &mdash; none of this can be scripted from this
repo, since it lives in a different repo and your GitHub account):**

1. **Create the vault folder structure.** Inside the EveryVerseOBS vault,
   make a top-level folder named `study-notes/`. Notes that should be public
   go here, using the same frontmatter format documented above. Anything
   else in the vault stays private to you &mdash; the sync only ever touches
   this one folder.
2. **Turn the vault into a git repo.** In a terminal, `cd` into the vault
   folder, then:
   ```bash
   git init
   git add .
   git commit -m "Initial vault commit"
   ```
   Create a new **EveryVerseOBS** repository on GitHub (public or private,
   your call &mdash; only the `study-notes/` folder ever leaves it), then:
   ```bash
   git remote add origin https://github.com/trentcornwell/EveryVerseOBS.git
   git push -u origin main
   ```
3. **Install Obsidian Git.** In Obsidian: Settings &rarr; Community plugins
   &rarr; Browse &rarr; search "Obsidian Git" &rarr; Install &rarr; Enable.
   It will detect the vault is already a git repo. Configure auto-commit /
   auto-push on an interval (or trigger it manually from the command
   palette) so saving a note eventually pushes it.
4. **Create a fine-grained GitHub token** so the Action can push to
   `everyverse`: GitHub &rarr; Settings &rarr; Developer settings &rarr;
   Personal access tokens &rarr; Fine-grained tokens &rarr; New token,
   scoped to only the `everyverse` repository, with **Contents: Read and
   write** permission.
5. **Add that token as a secret** in the **EveryVerseOBS** repo: Settings
   &rarr; Secrets and variables &rarr; Actions &rarr; New repository secret,
   named `EVERYVERSE_PUSH_TOKEN`.
6. **Add the sync workflow** to the EveryVerseOBS repo at
   `.github/workflows/sync-to-everyverse.yml`:

   ```yaml
   name: Sync study notes to EveryVerse site

   on:
     push:
       branches: [main]
       paths:
         - "study-notes/**"

   jobs:
     sync:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout EveryVerseOBS
           uses: actions/checkout@v4
           with:
             path: vault

         - name: Checkout everyverse site
           uses: actions/checkout@v4
           with:
             repository: trentcornwell/everyverse
             token: ${{ secrets.EVERYVERSE_PUSH_TOKEN }}
             path: site

         - name: Copy study notes
           run: |
             rm -rf site/content/study-notes
             mkdir -p site/content/study-notes
             cp -r vault/study-notes/* site/content/study-notes/

         - name: Commit and push if changed
           run: |
             cd site
             git config user.name "EveryVerseOBS sync"
             git config user.email "actions@users.noreply.github.com"
             git add content/study-notes
             if git diff --cached --quiet; then
               echo "No changes to sync."
               exit 0
             fi
             git commit -m "Sync study notes from EveryVerseOBS"
             git push
   ```

Once this is in place, the flow is just: write a note in Obsidian &rarr; it
gets committed/pushed by Obsidian Git &rarr; the Action mirrors it here
&rarr; Vercel rebuilds. Once a real database exists, this whole bridge can
be replaced with something closer to real-time without changing the note
format itself.

**Troubleshooting the token/secret** &mdash; three separate things all have
to line up, and it's easy to get exactly one of them wrong:

| Symptom in the Action's failed step | Cause |
| --- | --- |
| `Error: Input required and not supplied: token` | The `EVERYVERSE_PUSH_TOKEN` secret doesn't exist (or is misnamed/mistyped) in the **EveryVerseOBS** repo's secrets &mdash; check `github.com/trentcornwell/EveryVerseOBS/settings/secrets/actions`. |
| `Checkout everyverse site` fails, but `Checkout EveryVerseOBS` succeeded | The secret was added to the wrong repo (`everyverse` instead of `EveryVerseOBS`) &mdash; secrets aren't shared between repos. |
| `remote: Permission ... denied ... / fatal: ... 403` on `Commit and push if changed` | The token authenticates, but its **repository access** doesn't include `everyverse` (it needs write access to the repo it pushes *into*, not just the vault repo it's stored in) &mdash; check the token's "Repositories" tab at `github.com/settings/personal-access-tokens`. |

The checkout step can succeed even with a token that has no real access to
`everyverse`, since that repo is public and readable by anyone &mdash; it's
only the push that actually proves the token's write permission is correct.

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
