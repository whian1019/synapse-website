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
- Framer Motion (scroll-scrubbed text and layout animation — respects
  `prefers-reduced-motion`)
- A small hand-written WebGL particle engine for the scroll-driven visuals
  (`src/motion/` — no 3D library, a single draw call of GL points)
- Plain CSS (no framework) — design tokens live in `src/styles/global.css`
- Self-hosted variable fonts via Fontsource (bundled by Vite, no third-party
  font requests): **Unbounded** for Latin display type, **Noto Sans KR** for
  all Korean text, **JetBrains Mono** for small technical labels
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

- **A scroll-driven "motion site".** The home page is one continuous
  sequence: a fixed WebGL particle stage sits behind the content and morphs
  from scene to scene as you scroll, scrubbed directly by the scrollbar
  (forwards and backwards). Each section is pinned to the screen while its
  copy animates in.
  - **Hero** — the real SYNAPSE logo assembles out of a cloud of particles,
    then flies through the camera
  - **Projects** — a warp starfield, then one full-screen scene per project
    whose visual reflects the project itself: a cyberpunk city corridor for
    NEUROLINK, a swarm that follows the cursor for Dark Swarm, a pulsing
    star for NOVA
  - **About** — a rolling terrain of light while the keywords light up in turn
  - **Vision** — "BUILD. CREATE. CONNECT." as three screen-wide lines over
    a network of connected nodes
  - **Contact** — everything gathers back into the logo
- **Kinetic typography throughout.** Three type voices — wide, heavy
  Unbounded for names and statements; Noto Sans KR set large and tight for
  Korean headlines; JetBrains Mono for readouts and labels — and each kind
  of text has its own scroll-scrubbed entrance:
  - project names *decode* into place, letter by letter, sized to span the
    full width of the page
  - Korean headlines rise line by line out of masks
  - "현실로." rises as an outline and is filled in as you keep scrolling
  - the About sentence lights up word by word as it's read, over a sliding
    band of the keywords in giant solid/outline type
  - "BUILD. CREATE. CONNECT." slides in from alternating sides
- A game-style HUD in the bottom corners shows scroll percentage and the
  current scene; the page's ambient glow shifts to each scene's color, and
  a soft light follows the cursor
- Project detail pages: the project's particle visual, one-line intro, full
  description, key features, tech stack (only shown once real tech is
  decided — no placeholders), development status, and a development-log
  section (empty-state until real entries are added — see
  `src/data/devlogs.js`)
- Responsive (desktop + mobile), Korean-first copy (~70–80% Korean, English
  kept for brand/project names, tech terms, and short category tags)
- Custom 404 page for unknown routes and unknown project slugs
- SEO: title/description/keywords, canonical URL, Open Graph and
  Twitter/X card metadata, favicon/OG image using the official SYNAPSE logo
- Accessibility: keyboard-operable nav/links, meaningful alt text, ≥44px
  touch targets, WCAG AA color contrast, `word-break: keep-all` for correct
  Korean line-wrapping. Under `prefers-reduced-motion` (or without WebGL)
  the particle stage is not started at all: the page becomes a normal,
  un-pinned layout with the static logo and all content visible
- Adaptive quality: the particle count is lower on small screens and steps
  down automatically if a device can't hold a smooth frame rate

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
  motion/                 The scroll-driven particle stage
    ParticleStage.jsx      Fixed WebGL canvas; morphs between scenes on scroll
    scenes.js              Per-scene look & motion settings (keyed by data-scene)
    shapes.js              Particle shape builders (logo, city, swarm, star, ...)
    stageStore.js          "Is the stage running?" flag shared with components
    useSceneProgress.js    Scroll progress for pinned scenes (+ useScrub helper)
    DecodeText.jsx         Title that "decodes" letter by letter as you scroll
    LineReveal.jsx         Headline lines rising out of masks (scroll or on load)
    ScrollRead.jsx         Paragraph that lights up word by word as you scroll
    FitText.jsx            Sizes a line of text to span its container's width
    SceneHud.jsx           Bottom-corner readout: scroll % and current scene
    CursorGlow.jsx         Soft light that trails the mouse
  components/
    Navigation.jsx         Fixed nav, scroll progress bar, mobile menu
    Hero.jsx               Opening scene (logo, tagline, CTAs)
    Projects.jsx           Projects intro scene + one ProjectScene per project
    ProjectScene.jsx       Full-screen pinned scene for a single project
    About.jsx              About scene + keyword list
    Vision.jsx             "Build. Create. Connect." brand statement
    Contact.jsx            Closing contact section
    Footer.jsx             Site footer (giant outlined wordmark)
    ScrollManager.jsx      Scrolls to the right section on route/hash change
  pages/
    Home.jsx               Mounts the stage and composes all home scenes
    ProjectDetail.jsx      Renders a single project from src/data/projects.js
    NotFound.jsx           404 page
  hooks/
    useScrollReveal.js     Scroll-linked reveal/parallax for ordinary sections
  data/
    projects.js            Single source of truth for project scenes + detail pages
    devlogs.js             Development-log entries (empty until real ones exist)
    site.js                Site-wide config (contact email, canonical URL)
  styles/
    global.css             Design tokens (colors, type, spacing) + scene layout
  App.jsx                  Router setup
  main.jsx                 Entry point (also imports the self-hosted fonts)
public/
  synapse-logo.png         Official logo (nav, hero, footer, favicon, OG image)
```

### How the scroll scenes work

- A section opts into a particle scene with `data-scene="<key>"`; the keys
  are defined in `src/motion/scenes.js`. As a section arrives, the stage
  morphs the previous section's scene into it.
- If the section contains an element marked `data-stage-anchor`, the visual
  is drawn exactly over that element's box — so where a visual sits is
  decided by ordinary CSS layout, on every screen size.
- A section with class `scene` is tall (`--scene-vh`), and its `scene__pin`
  child stays pinned for that height; `useSceneProgress` turns the scroll
  through it into 0..1 values that drive the copy animation.

## Adding a new project

Add an entry to `src/data/projects.js` — a scene on the home page and a
`/projects/<slug>` detail page are generated from it automatically. Leave
`tech` as an empty array until a real stack is decided (the detail page
hides that section when empty rather than showing a placeholder), and don't
add features, stats, or achievements that aren't real yet.

To give the new project its own particle visual, add a scene with the
project's slug as its key to `src/motion/scenes.js` (and, if it needs a new
shape, a builder in `src/motion/shapes.js`). Without one it falls back to a
plain particle cloud.

## Current development status

- The site itself is feature-complete for a v1 public launch: the
  scroll-driven motion design, SEO metadata, 404 handling and accessibility
  passes are all in place.
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
- On the home page the hero and contact logos are drawn by the particle
  stage, which samples this same file pixel by pixel (shape and colors
  unchanged); the plain image is shown instead under reduced motion.
- Every placement scales the same file proportionally via CSS (`width`/
  `height: auto` or `object-fit: contain`) — no cropped variants exist.
  The nav (40px) and footer (32px) show it as a compact mark next to the
  "SYNAPSE" text label; the hero shows it large (`clamp(210px, 36vw, 400px)`, capped at 44% of the viewport height)
  as the page's primary visual; the favicon uses the full file directly.
- To swap in a different export of the logo later, replace
  `public/synapse-logo.png` (ideally already transparent) — no code changes
  needed unless the new file's aspect ratio differs significantly from the
  current square canvas.
