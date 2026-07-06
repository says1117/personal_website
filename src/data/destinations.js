/* ============================================================
   destinations.js — SINGLE SOURCE OF TRUTH.

   Drives BOTH the constellation nodes on the landing "Director"
   HUD AND the routes / nav. Add a destination = add one object.

   x / y  → node center as % of the Director stage
   code   → monospace HUD designation (flavor)
   primary→ the central hub node (drawn larger)

   WebGL art (PlanetGL): texture (CC BY 4.0 map), atmosphere
   (Fresnel rim colour), tint (stylised colour grade on the
   surface), emissive (dark-side lift), sun (per-node key-light
   direction), rimPower (falloff sharpness — higher = thinner
   rim), rimStrength (rim brightness). `planet` stays for the
   SVG fallback (PlanetArt) when WebGL is unavailable.
   ============================================================ */

export const DESTINATIONS = [
  {
    id: 'dashboard',
    section: 'Dashboard',
    code: 'TWR · 00',
    route: '/dashboard',
    blurb: 'Command overview',
    x: 50,
    y: 50,
    primary: true,
    planet: 'pale',
    size: 150,
    depth: 10, // parallax depth (px of travel at full pointer offset)
    texture: '/textures/mercury.jpg',
    atmosphere: '#f5deaa', // gold "Traveler light"
    tint: '#efe6d2',
    emissive: '#2a2012',
    spin: 0.05,
    sun: [3.2, 1.4, 2.4],
    rimPower: 3.4,
    rimStrength: 1.15,
  },
  {
    id: 'about',
    section: 'About',
    code: 'EUR · 01',
    route: '/about',
    blurb: 'Profile & approach',
    x: 24,
    y: 31,
    planet: 'ice',
    size: 150,
    depth: 26,
    texture: '/textures/europa.jpg',
    atmosphere: '#bfe4ff', // cold blue
    tint: '#cfe2f2',
    emissive: '#0e1c2c',
    spin: 0.06,
    sun: [2.6, 2.0, 2.6],
    rimPower: 3.0,
    rimStrength: 1.5,
  },
  {
    id: 'projects',
    section: 'Projects',
    code: 'NSS · 02',
    route: '/projects',
    blurb: 'Selected work',
    x: 27,
    y: 73,
    planet: 'rock',
    size: 110,
    depth: 34,
    texture: '/textures/mars.jpg',
    atmosphere: '#7fd3a0', // emerald (Nessus nod)
    tint: '#e8a878',
    emissive: '#2a1208',
    spin: 0.07,
    sun: [3.6, 0.9, 2.0], // low sun → long, high-contrast terminator
    rimPower: 2.3, // thicker atmosphere band
    rimStrength: 1.6,
  },
  {
    id: 'experience',
    section: 'Experience',
    code: 'MOO · 03',
    route: '/experience',
    blurb: 'Track record',
    x: 75,
    y: 38,
    planet: 'moon',
    size: 96,
    depth: 20,
    texture: '/textures/moon.jpg',
    atmosphere: '#cdd6e6', // cool steel
    tint: '#eceef2',
    emissive: '#191c22',
    spin: 0.05,
    sun: [3.0, 2.2, 1.8],
    rimPower: 4.2, // airless body → razor-thin rim
    rimStrength: 0.85,
  },
]

/* Connector lines: each satellite links back to the primary hub. */
export const HUB = DESTINATIONS.find((d) => d.primary)
export const SATELLITES = DESTINATIONS.filter((d) => !d.primary)

export const NAV_ITEMS = DESTINATIONS.map(({ section, route }) => ({
  section,
  route,
}))

export const getDestination = (id) => DESTINATIONS.find((d) => d.id === id)
