# SYNAPSE — Official Studio Website

The official homepage for **SYNAPSE**, an independent AI · Game · Software
studio. A dark, restrained, single-page marketing site with dedicated detail
pages for each project.

## About SYNAPSE

SYNAPSE is an independent technology studio building new digital experiences
across games, AI, and software. It is currently an early-stage, one-person
studio — the site intentionally states only what SYNAPSE actually is today
(no invented team size, funding, or track record).

## Purpose of this project

This repository is the source for SYNAPSE's public marketing site: an
introduction to the studio, a showcase of its in-progress projects, and a
contact point for collaboration or business inquiries. It's a fully static
site — no backend, no database, no build-time secrets.

## Tech stack

- React 19 + Vite
- React Router (client-side routing for `/projects/:slug`, plus a 404 page)
- Framer Motion (scroll reveals, hero entrance, hover states — respects
  `prefers-reduced-motion` via `MotionConfig`)
- Plain CSS (no framework) — design tokens live in `src/styles/global.css`
- oxlint for linting

## Featured projects

| Project | Category | Status | One-line intro |
|---|---|---|---|
| **NEUROLINK** | GAME | In Development | 사이버펑크 오픈월드 액션 RPG |
| **Dark Swarm** | GAME | Concept | 군집 지능을 테마로 한 신작 게임 |
| **NOVA** | AI | In Development | 자연스러운 상호작용을 목표로 하는 AI 어시스턴트 |

Each project has its own detail page (`/projects/<slug>`) generated from a
single data source — see [Adding a new project](#adding-a-new-project) below.

## Key features

- Responsive dark/minimal/premium design (desktop + mobile), Korean-first
  copy (~70–80% Korean, English kept for brand/project names, tech terms,
  and short category tags)
- Home page: Hero, Projects grid, About, Vision, Contact, Footer
- Project detail pages: one-line intro, full description, key features,
  tech stack (only shown once real tech is decided — no placeholders),
  development status, and a development-log section (empty-state until
  real entries are added — see `src/data/devlogs.js`)
- Custom 404 page for unknown routes and unknown project slugs
- SEO: title/description/keywords, canonical URL, Open Graph and
  Twitter/X card metadata, favicon/OG image using the official SYNAPSE logo
- Accessibility: keyboard-operable nav/links, meaningful alt text, ≥44px
  touch targets, WCAG AA color contrast, `prefers-reduced-motion` support,
  `word-break: keep-all` for correct Korean line-wrapping

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint      # oxlint
```

## Project structure

```
src/
  components/
    Navigation.jsx      Fixed nav, scroll-aware background, mobile menu
    Hero.jsx             Hero section (logo, tagline, CTAs)
    NeuralBackground.jsx Subtle canvas particle/network animation
    Projects.jsx         "Projects" section, renders ProjectCard list
    ProjectCard.jsx       Individual project card (links to detail page)
    About.jsx             "About Synapse" section + keyword list
    Vision.jsx             "Build. Create. Connect." brand statement
    Contact.jsx             Contact CTA section
    Footer.jsx               Site footer
    ScrollManager.jsx        Scrolls to the right section on route/hash change
  pages/
    Home.jsx              Composes all homepage sections
    ProjectDetail.jsx      Renders a single project from src/data/projects.js
    NotFound.jsx            404 page
  data/
    projects.js            Single source of truth for project cards + detail pages
    devlogs.js               Development-log entries (empty until real ones exist)
    site.js                   Site-wide config (contact email, canonical URL)
  styles/
    global.css               Design tokens (colors, type, spacing) + base styles
  App.jsx                    Router setup
  main.jsx                    Entry point
public/
  synapse-logo.png            Official logo (nav, hero, footer, favicon, OG image)
```

## Adding a new project

Add an entry to `src/data/projects.js` — a card on the Projects section and a
`/projects/<slug>` detail page are generated from it automatically. Leave
`tech` as an empty array until a real stack is decided (the detail page
hides that section when empty rather than showing a placeholder), and don't
add features, stats, or achievements that aren't real yet.

## Current development status

- The site itself is feature-complete for a v1 public launch: SEO metadata,
  404 handling, accessibility and performance passes are all in place.
- All three featured projects are early-stage; copy on the site reflects
  their real status (Concept vs. In Development) rather than a uniform
  "in progress" label.
- The contact button and email use the official SYNAPSE inbox, centralized
  in `src/data/site.js` (`CONTACT_EMAIL`) — change it there if it ever
  needs to swap; no other file needs to change.
- `src/data/devlogs.js` is intentionally empty; add real entries there as
  development happens.
- Canonical/Open Graph URLs in `index.html` use a placeholder domain
  (`synapse-studio.example`) — update them once the site has a real domain.

## Logo

`public/synapse-logo.png` is the official SYNAPSE mark, used as-is (same
proportions and colors) across the nav, hero, footer, and favicon:

- The original file had a solid black canvas. It's been re-exported with a
  real alpha channel (background made transparent based on pixel
  brightness) so it composites cleanly onto any dark background without a
  visible box — the mark itself, its colors, and its proportions are
  untouched.
- Every placement scales the same file proportionally via CSS (`width`/
  `height: auto` or `object-fit: contain`) — no cropped variants exist.
  The nav (40px) and footer (32px) show it as a compact mark next to the
  "SYNAPSE" text label; the hero shows it large (`clamp(220px, 40vw, 440px)`)
  as the page's primary visual; the favicon uses the full file directly.
- To swap in a different export of the logo later, replace
  `public/synapse-logo.png` (ideally already transparent) — no code changes
  needed unless the new file's aspect ratio differs significantly from the
  current square canvas.
