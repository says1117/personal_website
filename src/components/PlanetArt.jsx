/* ============================================================
   PlanetArt — original, high-fidelity planet rendering (SVG).

   Built in the Destiny "Director" spirit (NOT the reference art):
     · procedural surface via feTurbulence (real fractal detail)
     · dramatic single-source lighting + hard terminator shadow
     · Fresnel limb-light on the sunlit edge
     · a thin atmospheric halo ring in the planet's colour
     · the textured surface slow-translates inside a circular
       clip to read as planetary rotation

   viewBox 0 0 100 100, sphere = circle(50,50,r48).
   Props: type 'ice'|'rock'|'pale'|'moon', uid (unique id).
   ============================================================ */

const CFG = {
  ice: {
    bf: '0.05 0.07', oct: 4, seed: 7,
    hi: '#eaf3fb', mid: '#9cb8d4', lo: '#2c4866', edge: '#0c1826',
    rim: '#bfe4ff', halo: 'rgba(150,205,255,0.55)', blend: 'soft-light', tex: 0.7,
    patch: ['rgba(60,110,160,0.0)', 'rgba(70,120,170,0.0)'],
  },
  rock: {
    bf: '0.06 0.05', oct: 5, seed: 22,
    hi: '#f1c89a', mid: '#bd6939', lo: '#4e2b15', edge: '#150904',
    rim: '#ffb877', halo: 'rgba(220,130,70,0.5)', blend: 'soft-light', tex: 0.72,
    patch: ['rgba(110,176,115,0.45)', 'rgba(95,150,90,0.35)'],
  },
  pale: {
    bf: '0.035 0.05', oct: 5, seed: 3,
    hi: '#f7f1e4', mid: '#ccc0a7', lo: '#5e5540', edge: '#221d14',
    rim: '#ffe6b0', halo: 'rgba(245,222,170,0.5)', blend: 'soft-light', tex: 0.6,
    patch: ['rgba(120,108,82,0.3)', 'rgba(150,138,108,0.25)'],
  },
  moon: {
    bf: '0.08 0.08', oct: 4, seed: 41,
    hi: '#eef0f4', mid: '#a6acb8', lo: '#494f5b', edge: '#171a21',
    rim: '#cdd6e6', halo: 'rgba(200,212,232,0.45)', blend: 'overlay', tex: 0.6,
    patch: ['rgba(70,76,88,0.4)', 'rgba(60,66,78,0.35)'],
  },
}

export default function PlanetArt({ type = 'pale', uid }) {
  const c = CFG[type]
  const i = (s) => `${s}-${type}-${uid}`
  const body = i('body')
  const term = i('term')
  const rim = i('rim')
  const halo = i('halo')
  const surf = i('surf')
  const clip = i('clip')

  return (
    <svg className="planet-art__svg" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        {/* Body: lit from upper-right, falling to a deep dark edge */}
        <radialGradient id={body} cx="0.68" cy="0.28" r="0.95">
          <stop offset="0%" stopColor={c.hi} />
          <stop offset="38%" stopColor={c.mid} />
          <stop offset="74%" stopColor={c.lo} />
          <stop offset="100%" stopColor={c.edge} />
        </radialGradient>

        {/* Terminator: most of the sphere falls into shadow */}
        <radialGradient id={term} cx="0.70" cy="0.26" r="0.92">
          <stop offset="46%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.84)" />
        </radialGradient>

        {/* Fresnel limb-light ring, biased to the sunlit edge */}
        <radialGradient id={rim} cx="0.70" cy="0.26" r="0.92">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="84%" stopColor="rgba(255,255,255,0)" />
          <stop offset="93%" stopColor={c.rim} stopOpacity="0.55" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Atmospheric halo, thin colour ring at the limb */}
        <radialGradient id={halo} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="90%" stopColor="rgba(0,0,0,0)" />
          <stop offset="96%" stopColor={c.halo} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Procedural surface texture */}
        <filter id={surf} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency={c.bf}
            numOctaves={c.oct} seed={c.seed} stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g">
            <feFuncR type="gamma" amplitude="1.1" exponent="1.6" offset="0" />
            <feFuncG type="gamma" amplitude="1.1" exponent="1.6" offset="0" />
            <feFuncB type="gamma" amplitude="1.1" exponent="1.6" offset="0" />
          </feComponentTransfer>
        </filter>

        <clipPath id={clip}><circle cx="50" cy="50" r="48" /></clipPath>
      </defs>

      {/* Atmospheric halo (drawn first, slightly larger feel) */}
      <circle cx="50" cy="50" r="50" fill={`url(#${halo})`} />

      <g clipPath={`url(#${clip})`}>
        {/* Base colour */}
        <circle cx="50" cy="50" r="48" fill={`url(#${body})`} />

        {/* Static colour patches (continents / maria / ice fields) */}
        <g opacity="0.9">
          <ellipse cx="36" cy="40" rx="20" ry="13" fill={c.patch[0]} />
          <ellipse cx="64" cy="62" rx="16" ry="11" fill={c.patch[1]} />
          <ellipse cx="58" cy="30" rx="10" ry="7" fill={c.patch[0]} />
        </g>

        {/* Procedural surface, slow-translated for rotation */}
        <g className="planet-art__spin" style={{ mixBlendMode: c.blend, opacity: c.tex }}>
          <rect x="-100" y="0" width="300" height="100" fill="#808080" filter={`url(#${surf})`} />
        </g>

        {/* Lighting overlays */}
        <circle cx="50" cy="50" r="48" fill={`url(#${term})`} />
        <circle cx="50" cy="50" r="48" fill={`url(#${rim})`} />
      </g>

      {/* Crisp outer edge */}
      <circle cx="50" cy="50" r="48" fill="none" stroke={c.edge} strokeOpacity="0.6" strokeWidth="0.6" />
    </svg>
  )
}
