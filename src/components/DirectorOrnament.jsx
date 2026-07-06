/* ============================================================
   DirectorOrnament — the faint "astrolabe" behind the star map:
   concentric orbital rings, a degree-tick bezel, and geometric
   rosettes. This is the signature Destiny "Director" framing.
   Purely decorative SVG; two rings counter-rotate for life.
   ============================================================ */

const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2
  const major = i % 6 === 0
  const r1 = major ? 82 : 85.5
  const r2 = 89
  return {
    x1: 100 + Math.cos(a) * r1,
    y1: 100 + Math.sin(a) * r1,
    x2: 100 + Math.cos(a) * r2,
    y2: 100 + Math.sin(a) * r2,
    major,
  }
})

// N-gon points as a "cx,cy L…" polygon path string
const poly = (n, r, rot = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot + (i / n) * Math.PI * 2
    return `${(100 + Math.cos(a) * r).toFixed(2)},${(100 + Math.sin(a) * r).toFixed(2)}`
  }).join(' ')

export default function DirectorOrnament() {
  return (
    <svg
      className="director__astro"
      viewBox="0 0 200 200"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Slow-rotating outer bezel: rings + degree ticks */}
      <g className="astro__spin astro__spin--cw">
        <circle cx="100" cy="100" r="96" className="astro__ring astro__ring--thin" />
        <circle cx="100" cy="100" r="89" className="astro__ring" />
        <circle cx="100" cy="100" r="80" className="astro__ring astro__ring--dash" />
        {TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            className={`astro__tick${t.major ? ' astro__tick--major' : ''}`}
          />
        ))}
      </g>

      {/* Counter-rotating inner rosette */}
      <g className="astro__spin astro__spin--ccw">
        <circle cx="100" cy="100" r="58" className="astro__ring astro__ring--dash" />
        <polygon points={poly(6, 58)} className="astro__poly" />
        <polygon points={poly(6, 58, Math.PI / 6)} className="astro__poly" />
        <circle cx="100" cy="100" r="40" className="astro__ring astro__ring--thin" />
      </g>

      {/* Static crosshair diameters */}
      <g className="astro__cross">
        <line x1="4" y1="100" x2="196" y2="100" />
        <line x1="100" y1="4" x2="100" y2="196" />
      </g>
    </svg>
  )
}
