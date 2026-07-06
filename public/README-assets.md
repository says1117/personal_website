# Assets

## `cosmos.jpg` — landing backdrop (optional)

The landing map auto-detects this file:

- **If `public/cosmos.jpg` exists**, it becomes the backdrop image and the
  four planets turn into invisible click-hotspots over it (the orbit ring +
  label appear on hover/focus, so they don't cover the image's own labels).
- **If it's missing**, the star map is fully rendered in-app instead
  (lit planets, starfield, Earth, sigils) — no image required.

Use a **16:9** crop — the hotspot positions in `src/data/destinations.js`
(the `x`/`y` percentages) are tuned to that composition. If your planets sit
slightly off the hotspots, nudge those `x`/`y` values.

> Note: if you use third-party game artwork, keep it to private/personal use —
> don't ship copyrighted art on a public site.

## `transitions/<id>.webm` — masking videos (optional)

Per-destination "fly to orbit" clips used to mask the route change. Names map
to `destination.id` in `src/data/destinations.js` (e.g. `about.webm`,
`projects.webm`). See the marked placeholder block in
`src/components/TransitionOverlay.jsx`.
