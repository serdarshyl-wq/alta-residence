# ALTA

ALTA is a single-page luxury residence showcase site, built as an interactive marketing experience for three signature living concepts: **Maison Solène**, **Velour Grand**, and **Obsidian Atelier**. The site uses cinematic GSAP-driven transitions, scroll-triggered animations, and a full-screen room-detail overlay to convey a calm, design-forward brand feel.

## Core Stack

**Runtime & UI**
- **React 19** — component model and hooks
- **React DOM 19** — DOM rendering, including portals (mobile menu overlay)

**Animation**
- **GSAP 3** — all entry, slide, fade, and timeline-based transitions
- **GSAP ScrollTrigger** — scroll-linked reveals and the pinned Reservation section

**Styling**
- **Tailwind CSS 4** — utility-first layout/typography (via `@tailwindcss/vite`)
- **Custom CSS** — per-component CSS files under `src/css/` for component-specific styling
- **PostCSS** + **Autoprefixer** — vendor prefixing pipeline

**Build & Tooling**
- **Vite 8** — dev server, HMR, and production bundling
- **@vitejs/plugin-react** — React Fast Refresh and JSX transform
- **ESLint 9** — linting (with `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)

## Features

- **Hero** — fullscreen video intro with synchronized logo + navbar entry timeline driven off `videoReady`.
- **Our Livings** — desktop carousel (left/center/right slot positioning, custom slide easing) and mobile swipe slider for the three livings.
- **Home Details overlay** — full-screen detail view per living, opened from `Explore` or via the navbar links. Features:
  - Slide-in entry, slide-out close, and fade-out → reservation hand-off when the user clicks **BOOK A VISIT**.
  - Vertical "blinds" transition between rooms (Living Room / Bathroom / Bedroom / Kitchen) with an animated area counter.
  - Tab title syncs to `ALTA - {living name}` while open.
- **Reservation** — pinned section with parallax background image and a floating booking form. The Navbar's and Home Details' **Book a Visit** buttons smooth-scroll (or fade-cut) here.
- **About / Our Beliefs / Amenities / FAQ / Footer** — supporting content sections with their own scroll-triggered reveals.
