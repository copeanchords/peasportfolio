# Project Brief: Spotify-Style Resume/Portfolio Site (for Claude Code)

Fill in the bracketed sections, then hand this whole file to Claude Code (e.g. "build this project" or paste it into your first message in a repo) to scaffold a real, deployable multi-page site.

---

## Overview

Build a personal resume/portfolio website that's a faithful visual parody of the **Spotify desktop app**, with real page navigation and URLs (not a single static file). My career = the artist's discography; my side projects = albums/playlists; my actual listening stats = my "artist" stats.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS, deployable to Vercel. Use React Router + Vite instead if you have a reason to prefer it — your call, just keep routing real (actual URLs per page, not client-side view-swapping in one file).

## Site structure / pages

- `/` — Home: artist header/hero, About, Education timeline, Experience ("Popular" section)
- `/playlists/[category]` — one page per side-project category (e.g. `/playlists/side-projects`, `/playlists/open-source`, `/playlists/client-work`) — each a track-list-style page
- `/project/[slug]` — individual project "release" page (like a Spotify album page) for each project, work or side
- `/search` — a Spotify-style search page that filters across all projects, skills, and tools
- Persistent app shell on every page: left sidebar (Home/Search/Your Library nav + playlist links), sticky bottom "now playing" bar (decorative)

## Data architecture

Keep content in structured data files, not hardcoded in components, so it's easy for me to edit later:
- `data/profile.ts` — name, tagline, bio, contact links, resume PDF link, real Spotify stats
- `data/experience.ts` — work history entries
- `data/education.ts` — education entries
- `data/skills.ts` — tools + skills lists (for sidebar playlists)
- `data/projects.ts` — every project (work + side), each with a `category` field used to group into playlist pages

## Design system

- Dark theme: page background `#121212`, sidebar `#000000`, card/row `#181818` → `#282828` on hover
- Accent: Spotify green `#1DB954`
- Bold tight sans-serif (system-ui/Helvetica stack), oversized hero name, uppercase small-caps eyebrow labels ("PLAYLIST", "ALBUM")
- Rounded pill buttons, circular avatar/play buttons, subtle hover shadows
- Fully responsive; sidebar collapses to a bottom tab bar on mobile like the real Spotify app

## Real Spotify stats (replacing the fake "monthly listeners")

I want my actual listening/profile stats on the hero section instead of a made-up number, e.g.: top genres, top artists, minutes listened, or — if I release music — my real monthly listener count.

Two ways to get this data, pick based on what I give you:
1. **Static, pasted by me** — I'll paste real numbers below (from Spotify Wrapped, stats.fm, or Spotify for Artists) and you hardcode them into `data/profile.ts`.
2. **Live via Spotify Web API** — if I want it to update automatically, set up an API route using the Client Credentials or Authorization Code flow. This needs a Spotify Developer app (client ID/secret), which I'll register and provide as env vars — don't invent placeholder keys, just scaffold the integration and tell me exactly what to add to `.env.local`.

My real stats: [PASTE YOUR ACTUAL SPOTIFY STATS HERE, e.g. top artists/genres, minutes listened this year, monthly listeners if applicable — or tell Claude Code you want the live API option instead]

## Content sections

**Hero:** [YOUR NAME] / [YOUR TAGLINE OR TITLE] / profile photo / Download Résumé button (link: [RESUME PDF LINK]) / contact chips (Email, LinkedIn, Website): [YOUR CONTACT INFO]

**About:** [PASTE YOUR BIO, 2-4 sentences] + one big stat callout (e.g. "X+ Years Experience")

**Education (timeline):** [SCHOOL — DEGREE — DATES], repeat for each

**Experience ("Popular" tracks):** for each job — [TITLE — COMPANY — DATES] then bullet achievements:
- [Achievement]
- [Achievement]

**Tools / Skills (sidebar playlists):** Tools: [LIST]. Skills: [LIST]

## Side projects (this is the big one — I have a lot of them)

Organize into playlist categories rather than one long grid. Suggested categories — adjust to fit what I actually have: `Side Projects`, `Open Source`, `Client Work`, `Hackathons/Experiments`. For each project give:
[PROJECT NAME — CATEGORY — YEAR — 2-3 sentence description — link if public — real metrics only if I provide them (stars, users, downloads); otherwise leave it off]
(repeat for every project — list as many as I have, don't trim the list for brevity)

## Rules for Claude Code

- Don't fabricate any numbers, client names, or stats I haven't given you — ask me if something's missing.
- Scaffold the repo, get it running locally, and tell me the exact commands to deploy to Vercel.
- If you set up the live Spotify API route, stub it clearly and tell me precisely what credentials/redirect URIs to configure — don't guess at my client ID.

## My info

[PASTE YOUR FULL RESUME TEXT + FULL LIST OF SIDE PROJECTS HERE. Attach a PDF/DOCX resume too if you have one.]

---
