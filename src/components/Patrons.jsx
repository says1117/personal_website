/* ============================================================
   Patrons — original line-art representations of the Deadlock
   Old Gods patron models (no Valve assets; drawn from scratch).

   Both figures use the SAME unified palette via CSS variables
   (--bone lines, --ink fills, --amber accents) per the design
   system — no per-patron colours.

   Archmother — the monumental statue: spiked Liberty halo,
   serene head, fluted robe falling in deco pleats to a stepped
   pedestal, hands clasped around a glowing orb.

   HiddenKing — the crowned shadow: jagged crown, hollow cowl
   with burning eyes, a massive cloak fraying into triangular
   shadow shards, one skeletal hand presenting a checker piece.

   Eye/halo groups carry classes so the page's rAF can nudge
   them toward the cursor (--gx/--gy in [-1, 1]).
   ============================================================ */

/* Halo spikes generated around the head centre */
const SPIKES = Array.from({ length: 9 }, (_, i) => {
  const a = ((-90 + (i - 4) * 17) * Math.PI) / 180
  const cx = 110
  const cy = 66
  const r1 = 30
  const r2 = i % 2 === 0 ? 66 : 52
  const w = 0.09
  return [
    `${(cx + Math.cos(a - w) * r1).toFixed(1)},${(cy + Math.sin(a - w) * r1).toFixed(1)}`,
    `${(cx + Math.cos(a) * r2).toFixed(1)},${(cy + Math.sin(a) * r2).toFixed(1)}`,
    `${(cx + Math.cos(a + w) * r1).toFixed(1)},${(cy + Math.sin(a + w) * r1).toFixed(1)}`,
  ].join(' ')
})

export function Archmother() {
  return (
    <svg viewBox="0 0 220 360" aria-hidden="true">
      {/* halo — tracks the cursor slightly */}
      <g className="patron__gaze">
        {SPIKES.map((pts, i) => (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="var(--dl-bone)"
            strokeWidth="1.4"
            opacity={i % 2 === 0 ? 0.9 : 0.55}
          />
        ))}
        {/* halo ring */}
        <circle cx="110" cy="66" r="30" fill="none" stroke="var(--dl-bone)" strokeWidth="1.4" opacity="0.7" />
      </g>

      {/* head + neck */}
      <ellipse cx="110" cy="66" rx="17" ry="21" fill="var(--dl-ink)" stroke="var(--dl-bone)" strokeWidth="1.6" />
      <path d="M102 84 L102 96 L118 96 L118 84" fill="var(--dl-ink)" stroke="var(--dl-bone)" strokeWidth="1.4" />
      {/* serene closed eyes */}
      <path d="M101 64 Q105 67 109 64" fill="none" stroke="var(--dl-bone)" strokeWidth="1.3" />
      <path d="M112 64 Q116 67 120 64" fill="none" stroke="var(--dl-bone)" strokeWidth="1.3" />

      {/* shoulders + robe silhouette */}
      <path
        d="M110 96
           C82 100 66 116 60 142
           L48 296 L40 322 L180 322 L172 296 L160 142
           C154 116 138 100 110 96 Z"
        fill="var(--dl-ink)"
        stroke="var(--dl-bone)"
        strokeWidth="1.8"
      />

      {/* deco pleats — fluting */}
      {[76, 88, 100, 120, 132, 144].map((x) => (
        <path
          key={x}
          d={`M${x} ${x < 110 ? 150 : 150} L${x < 110 ? x - 6 : x + 6} 318`}
          stroke="var(--dl-bone)"
          strokeWidth="1"
          opacity="0.4"
          fill="none"
        />
      ))}

      {/* clasped hands + the orb (amber) */}
      <circle className="patron__light" cx="110" cy="150" r="12" fill="var(--dl-amber)" opacity="0.9" />
      <circle cx="110" cy="150" r="17" fill="none" stroke="var(--dl-bone)" strokeWidth="1.2" opacity="0.7" />
      <path d="M92 158 Q110 172 128 158" fill="none" stroke="var(--dl-bone)" strokeWidth="1.6" />
      <path d="M94 150 Q102 160 110 162 M126 150 Q118 160 110 162" fill="none" stroke="var(--dl-bone)" strokeWidth="1.2" opacity="0.8" />

      {/* stepped pedestal */}
      <path d="M36 322 L184 322 L184 334 L36 334 Z" fill="var(--dl-ink)" stroke="var(--dl-bone)" strokeWidth="1.6" />
      <path d="M24 334 L196 334 L196 348 L24 348 Z" fill="var(--dl-ink)" stroke="var(--dl-bone)" strokeWidth="1.6" />
      {/* pedestal checker course */}
      {Array.from({ length: 10 }, (_, i) => (
        <rect
          key={i}
          x={40 + i * 14}
          y={i % 2 === 0 ? 324 : 328}
          width="7"
          height="4"
          fill="var(--dl-bone)"
          opacity="0.5"
        />
      ))}
    </svg>
  )
}

export function HiddenKing() {
  return (
    <svg viewBox="0 0 300 340" aria-hidden="true">
      {/* the cloak mass — sweeps down-right, fraying into shards */}
      <path
        d="M150 66
           C112 74 92 96 84 128
           C74 168 60 208 34 246
           L60 240 L48 274 L78 262 L70 296 L104 278 L100 318 L136 292
           L150 340 L300 340 L300 180
           C262 150 224 118 206 96
           C192 80 172 70 150 66 Z"
        fill="var(--dl-ink)"
        stroke="var(--dl-bone)"
        strokeWidth="1.8"
      />

      {/* inner cowl hollow */}
      <path
        d="M150 76 C128 82 116 96 112 116 C124 132 176 132 188 116 C184 96 172 82 150 76 Z"
        fill="#080806"
        stroke="var(--dl-bone)"
        strokeWidth="1.2"
        opacity="0.9"
      />

      {/* burning eyes — track the cursor */}
      <g className="patron__gaze patron__gaze--eyes">
        <polygon className="patron__light" points="132,106 140,102 138,112" fill="var(--dl-amber)" />
        <polygon className="patron__light" points="168,106 160,102 162,112" fill="var(--dl-amber)" />
      </g>

      {/* jagged crown */}
      <path
        d="M118 70 L122 34 L134 58 L144 24 L154 56 L166 28 L172 58 L184 38 L184 72
           C172 62 128 62 118 70 Z"
        fill="var(--dl-ink)"
        stroke="var(--dl-bone)"
        strokeWidth="1.8"
      />
      {/* crown jewel */}
      <polygon className="patron__light" points="150,40 156,50 150,60 144,50" fill="var(--dl-amber)" opacity="0.85" />

      {/* skeletal hand presenting a checker piece */}
      <path
        d="M96 196 Q76 200 66 214 M66 214 L54 216 M66 214 L58 224 M66 214 L64 228 M66 214 L72 228"
        fill="none"
        stroke="var(--dl-bone)"
        strokeWidth="1.6"
      />
      {/* the piece: a small checkered square + pawn */}
      <g>
        <rect x="40" y="228" width="24" height="24" fill="none" stroke="var(--dl-bone)" strokeWidth="1.2" />
        <rect x="40" y="228" width="12" height="12" fill="var(--dl-bone)" opacity="0.6" />
        <rect x="52" y="240" width="12" height="12" fill="var(--dl-bone)" opacity="0.6" />
        <circle className="patron__light" cx="52" cy="226" r="5" fill="var(--dl-amber)" opacity="0.9" />
      </g>

      {/* shadow tendrils bleeding off the cloak */}
      <path d="M210 130 L238 118 L226 142 Z" fill="var(--dl-ink)" stroke="var(--dl-bone)" strokeWidth="1" opacity="0.7" />
      <path d="M238 168 L266 152 L256 182 Z" fill="var(--dl-ink)" stroke="var(--dl-bone)" strokeWidth="1" opacity="0.55" />
      <path d="M256 210 L284 198 L276 226 Z" fill="var(--dl-ink)" stroke="var(--dl-bone)" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}
