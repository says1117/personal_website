# DESIGN.md — "The Great Game" (About page)

Design system for the Deadlock *Old Gods, New Blood*–inspired About page.
Original art and interaction design; no game assets ship in this build.

The page is a **key-art split**: a poster-blue **Archmother** field on the left
and a poster-yellow **Hidden King** field on the right, divided by a hard
diagonal cut that chases the cursor. Both patrons render as full illustrated
vector scenes; a physics-driven soul orb and a cat (Calico) live on top.

---

## 1. Color palette

Two opposed "realm" ramps meet at a single shared warm accent. Defined as CSS
custom properties on `.og` in `src/pages/about-patrons.css`.

### Archmother — the cold ramp (order, glass, light)

| Token | Hex | Swatch | Role |
| --- | --- | --- | --- |
| `--og-blue` | `#1A7FD0` | 🟦 | Realm field base / mid |
| `--og-blue-deep` | `#0E5A9E` | 🟦 | Field floor, checker dark square |
| `--og-blue-ink` | `#082A4A` | 🟦 | Pledge button ground, content scrim base |
| `--og-white` | `#F2F8FD` | ⬜ | Figure, logotype, checker light square, body text |

### Hidden King — the warm ramp (shadow, brick, fire)

| Token | Hex | Swatch | Role |
| --- | --- | --- | --- |
| `--og-yellow` | `#F0A91B` | 🟧 | Realm field base / mid |
| `--og-yellow-deep` | `#D98E0E` | 🟧 | Field floor gradient |
| `--og-black` | `#141008` | ⬛ | Figure silhouette, checker dark square, HUD, page ground |
| `--og-orange` | `#F08C1C` | 🟧 | Checker light square, dashed borders, pledge active |
| `--og-bone` | `#E8D9B0` | 🟨 | King-side body text over dark scrims |

### Shared accent — the one color that crosses the divide

| Token | Hex | Swatch | Role |
| --- | --- | --- | --- |
| `--og-amber` | `#FFB62E` | 🟨 | Souls counter, dialogue rail, King eyes/hands glow, links |

**Rule:** amber is the *only* color allowed on both sides of the diagonal — it
is the "soul" currency thread that ties the two realms into one game. Nothing
else crosses: blue tokens never appear on the King's field, warm tokens never
on the Archmother's.

---

## 2. Color roles & pairings

- **Field gradients** — each realm is a two-stop diagonal of its ramp
  (`--og-blue → --og-blue-deep`, `--og-yellow → --og-yellow-deep`) so the
  poster split reads even before the scenes load.
- **Text on field** — never place body text directly on the bright fields.
  Content sits in a **scrim panel**: `rgba(10,34,58,0.62)` (Archmother) or
  `rgba(14,9,4,0.66)` (Hidden King), each with a 1px border in its ramp's
  light tone and a 4px backdrop blur. This keeps AA contrast over the busy
  illustrated scenes.
- **Glows** — cold glow `rgba(190,228,255,·)` for the Archmother; warm glow
  `rgba(247,167,51,·)` / amber for the Hidden King. Green `#B6FF5E` is reserved
  for the King's burning eyes and the soul orb only.

---

## 3. The checkerboard motif — colored, per realm

The checker is the connective UI texture, built with
`repeating-conic-gradient(...) / <size>`. Each realm uses **its own two-color
checker** (the user's "colored checkers for the black and orange theme"):

- **Archmother checker** — `--og-white` × `--og-blue-deep`
- **Hidden King checker** — `--og-black` × `--og-orange`

Appears as: the strip under each logotype (`.checker-strip--mother/-king`) and
a mini strip inside every dossier plaque (`.checker-mini`).

---

## 4. Typography

| Face | Usage | Voice |
| --- | --- | --- |
| **Cinzel** (700) | `ARCHMOTHER` logotype, her plaque titles | carved, imperial, ordered |
| **Rock Salt** | `Hidden King` logotype, his plaque titles | scrawled, gritty, hand-marked |
| **Special Elite** | King body copy, dialogue, HUD data | typewriter / dossier |
| **Georgia italic** | Archmother body copy, creed | formal doctrine |
| `--font-mono` | HUD chrome, speaker labels, back link | interface |

Loaded via Google Fonts in `index.html`. Sentence/voice also splits by patron:
the Archmother speaks in title-case doctrine; the Hidden King in lowercase
street-talk (the *same four facts*, re-voiced).

---

## 5. Layout & composition

- **Diagonal split** — the Hidden King layer is clipped
  `polygon(calc(var(--split)+10vw) 0, 100% 0, 100% 100%, calc(var(--split)-10vw) 100%)`.
  `--split` eases toward the cursor's x each frame (rAF); pledge buttons pin it
  to 90% / 10%. At rest it sits ~50/50 as pure key art.
- **Scenes** — `PatronScenes.jsx` draws each patron's full environment (her
  domed rotunda + descending light column + idol; his cathedral + drapes,
  chains, lightning, clasped hands, and the burning effigy) as one 800×1000 SVG
  per side, `preserveAspectRatio="xMidYMax slice"` so they cover like photos.
- **HUD band** — a neutral `--og-black` strip top and bottom bridges both
  realms (back link · title · Souls counter).
- **Responsive** — below 901px / coarse pointer / reduced-motion, the split and
  playground don't mount; realms stack vertically with the scene as a banner.

---

## 6. Interactions (game-UI feel)

- **Cursor-chased seam** — the diagonal follows the pointer with inertia.
- **Souls counter** — starts at 1,130 amber "souls"; play earns more.
- **Patron dialogue bar** — the two trade lines on a 5.2s loop with a typewriter
  `steps()` reveal.
- **Soul orb** (`SoulPlayground.jsx`) — a cracked-green, gilt-ringed sphere with
  real physics: falls, bounces, rolls; swat it (+2), or grab & throw it (+8).
- **Calico** — a lilac sphynx that chases and kicks the orb (+5) and **flees**
  when the cursor gets within ~190px.

---

## 7. Deploy note

All shipped art is original vector (`PatronScenes.jsx`, `Patrons.jsx`,
`SoulPlayground.jsx`) — safe for a public portfolio. The page can also
auto-detect exact reference screenshots dropped into `public/oldgods/`
(`archmother.jpg`, `hiddenking.jpg`, `soul.png`, `calico.png`) for a
private/local build; that folder is git-ignored so the copyrighted images
never deploy. Site credits state no Valve artwork is used.
