# SYNAPSE — Official Studio Website

The official homepage for **SYNAPSE**, an independent AI · Game · Software studio.
A dark, restrained, single-page marketing site built as a static React app, with
project pages for NEUROLINK and NOVA.

## Tech stack

- React 19 + Vite
- React Router (client-side routing for `/projects/:slug`)
- Framer Motion (scroll reveals, hero entrance, hover states)
- Plain CSS (no framework) — design tokens live in `src/styles/global.css`

No backend is required; this is a fully static site.

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
  components/        Reusable UI pieces
    Navigation.jsx    Fixed nav, scroll-aware background, mobile menu
    Hero.jsx          Hero section (title, tagline, CTAs)
    NeuralBackground.jsx  Subtle canvas particle/network animation
    Projects.jsx       "Projects" section, renders ProjectCard list
    ProjectCard.jsx     Individual project card (links to detail page)
    About.jsx           "About Synapse" section + keyword list
    Vision.jsx          "Build. Create. Connect." brand statement
    Contact.jsx         Contact CTA section
    Footer.jsx           Site footer
    ScrollManager.jsx    Scrolls to the right section on route/hash change
  pages/
    Home.jsx            Composes all homepage sections
    ProjectDetail.jsx    Renders a single project from src/data/projects.js
  data/
    projects.js         Single source of truth for project cards + detail pages
  styles/
    global.css           Design tokens (colors, type, spacing) + base styles
  App.jsx                Router setup
  main.jsx                Entry point
```

## Adding a new project

Add an entry to `src/data/projects.js` — a card on the Projects section and a
`/projects/<slug>` detail page are generated from it automatically. No other
files need to change.

## Notes

- The contact button uses a placeholder email address (`hello@synapse-studio.example`).
  Replace it in `src/components/Contact.jsx` once a real address exists.
- No company size, funding, team, or achievements are stated anywhere in the
  copy — only what SYNAPSE actually is today. Update copy in the relevant
  component as the studio grows.
- Colors, fonts, spacing, and easing all live as CSS custom properties in
  `src/styles/global.css`, so the whole visual identity can be adjusted from
  one place.

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
