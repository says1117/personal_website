/* ============================================================
   ArkProps — faceted SVG props matching ARK's designs (original
   recreations of the silhouettes; no game assets).

   SupplyPod — the supply-drop capsule: an elongated hexagonal
   bipyramid with a centre ridge (light from upper-right), a
   glowing ring band at the waist in the loot-tier colour
   (fill: var(--drop-color), inherited from the .drop wrapper),
   and a small antenna.

   TekPad — the Tek Teleporter: a flat foreshortened hexagonal
   platform with extruded thickness, concentric teal hex rings,
   a centre emitter, and three wedge pylons with lit tips.
   Glow elements carry classes so experience.css can dim them
   while dormant and ignite them on .is-arrived.
   ============================================================ */

export function SupplyPod() {
  return (
    <svg viewBox="0 0 60 104" aria-hidden="true">
      {/* floor glow */}
      <ellipse cx="30" cy="100" rx="20" ry="4" fill="var(--drop-color)" opacity="0.25" />

      {/* antenna */}
      <rect x="29" y="0" width="2" height="8" fill="#8f8779" />

      {/* upper cap facets (apex 30,6 → shoulders) */}
      <path d="M30 6 L12 32 L30 36 Z" fill="#7a7264" />
      <path d="M30 6 L48 32 L30 36 Z" fill="#d6cfc0" />

      {/* mid body panels */}
      <path d="M12 32 L10 56 L30 60 L30 36 Z" fill="#97907f" />
      <path d="M48 32 L50 56 L30 60 L30 36 Z" fill="#c2baa9" />

      {/* glowing tier ring band at the waist */}
      <path d="M10 56 L30 60 L30 68 L10 63 Z" fill="var(--drop-color)" opacity="0.75" />
      <path d="M50 56 L30 60 L30 68 L50 63 Z" fill="var(--drop-color)" />

      {/* lower body panels */}
      <path d="M10 63 L16 84 L30 96 L30 68 Z" fill="#6b6457" />
      <path d="M50 63 L44 84 L30 96 L30 68 Z" fill="#a29a89" />

      {/* panel seams */}
      <path d="M12 32 L48 32" stroke="#4d463c" strokeWidth="1" opacity="0.5" />
      <path d="M16 84 L44 84" stroke="#3d372f" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

export function TekPad() {
  return (
    <svg viewBox="0 0 240 104" aria-hidden="true">
      <defs>
        <linearGradient id="tekpad-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#414854" />
          <stop offset="100%" stopColor="#22262d" />
        </linearGradient>
      </defs>

      {/* under-glow */}
      <ellipse className="tekpad__underglow" cx="120" cy="96" rx="100" ry="6" fill="#35e0d0" opacity="0.12" />

      {/* back pylon (behind the deck) */}
      <path d="M112 40 L128 40 L125 12 L115 12 Z" fill="#2b3038" />
      <rect className="tekpad__tip" x="115" y="8" width="10" height="5" fill="#35e0d0" opacity="0.4" />

      {/* extruded side / thickness */}
      <path
        d="M20 58 L70 76 L170 76 L220 58 L220 72 L170 90 L70 90 L20 72 Z"
        fill="#12151a"
      />
      {/* front bevel edge */}
      <path d="M20 58 L70 76 L170 76 L220 58 L220 62 L170 80 L70 80 L20 62 Z" fill="#1c2027" />

      {/* deck top face — foreshortened hexagon */}
      <path
        d="M20 58 L70 40 L170 40 L220 58 L170 76 L70 76 Z"
        fill="url(#tekpad-top)"
      />

      {/* edge glow along the deck rim */}
      <path
        className="tekpad__edge"
        d="M20 58 L70 40 L170 40 L220 58 L170 76 L70 76 Z"
        fill="none"
        stroke="#35e0d0"
        strokeWidth="1.6"
        opacity="0.35"
      />

      {/* concentric hex rings */}
      <path
        className="tekpad__ring"
        d="M50 58 L84 45 L156 45 L190 58 L156 71 L84 71 Z"
        fill="none"
        stroke="#35e0d0"
        strokeWidth="1.4"
        opacity="0.3"
      />
      <path
        className="tekpad__ring"
        d="M80 58 L98 51 L142 51 L160 58 L142 65 L98 65 Z"
        fill="none"
        stroke="#35e0d0"
        strokeWidth="1.2"
        opacity="0.25"
      />

      {/* centre emitter */}
      <ellipse className="tekpad__core" cx="120" cy="58" rx="22" ry="8" fill="#35e0d0" opacity="0.25" />

      {/* side pylons with lit tips */}
      <path d="M12 60 L30 60 L26 30 L16 30 Z" fill="#343a44" />
      <rect className="tekpad__tip" x="16" y="25" width="10" height="6" fill="#35e0d0" opacity="0.4" />
      <path d="M210 60 L228 60 L224 30 L214 30 Z" fill="#343a44" />
      <rect className="tekpad__tip" x="214" y="25" width="10" height="6" fill="#35e0d0" opacity="0.4" />
    </svg>
  )
}
