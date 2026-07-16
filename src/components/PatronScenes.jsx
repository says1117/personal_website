/* ============================================================
   PatronScenes — full illustrated recreations of the two patron
   reveal scenes (original vector art matching the reference
   compositions — deployable, no Valve assets).

   ArchmotherScene — the pale rotunda: domed ribs, arched
   niches, god-rays; the white crowned figure with outstretched
   arms; the luminous blue column descending to a small idol on
   the rotunda floor.

   HiddenKingScene — the sepia cathedral: pointed timber ribs,
   red drapes, hanging chains, crackling lightning; the towering
   antlered shadow with green burning eyes and the glowing
   clasped hands; below, the burning wooden effigy twisting on
   a ritual circle.

   Both use preserveAspectRatio="xMidYMax slice" so they crop
   like cover images (floor anchored, sides crop). Animated
   bits carry ams- and hks- classes driven from the page CSS.
   ============================================================ */

/* crown spikes for the Archmother, fanned around the head */
const AM_SPIKES = Array.from({ length: 7 }, (_, i) => {
  const a = ((-90 + (i - 3) * 22) * Math.PI) / 180
  const cx = 400
  const cy = 208
  const r1 = 30
  const r2 = i % 2 === 0 ? 110 : 78
  const w = 0.07
  return [
    `${(cx + Math.cos(a - w) * r1).toFixed(1)},${(cy + Math.sin(a - w) * r1).toFixed(1)}`,
    `${(cx + Math.cos(a) * r2).toFixed(1)},${(cy + Math.sin(a) * r2).toFixed(1)}`,
    `${(cx + Math.cos(a + w) * r1).toFixed(1)},${(cy + Math.sin(a + w) * r1).toFixed(1)}`,
  ].join(' ')
})

export function ArchmotherScene() {
  return (
    <svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="ams-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef4f9" />
          <stop offset="45%" stopColor="#c6d7e4" />
          <stop offset="100%" stopColor="#93aec3" />
        </linearGradient>
        <radialGradient id="ams-halo" cx="0.5" cy="0.42" r="0.55">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#dceefb" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#dceefb" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ams-beamg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f8ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#6fc4f2" stopOpacity="0.25" />
        </linearGradient>
        <filter id="ams-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* atmosphere */}
      <rect width="800" height="1000" fill="url(#ams-bg)" />
      <ellipse cx="400" cy="430" rx="360" ry="420" fill="url(#ams-halo)" />

      {/* dome ribs converging above */}
      <g stroke="#b7c9d8" strokeWidth="3" fill="none" opacity="0.6">
        <path d="M400 -20 L60 240 M400 -20 L200 200 M400 -20 L400 170 M400 -20 L600 200 M400 -20 L740 240" />
      </g>

      {/* rotunda wall: cornices + arched niches */}
      <g>
        <path d="M0 320 L800 320 M0 560 L800 560" stroke="#a5bccd" strokeWidth="4" fill="none" opacity="0.8" />
        {[24, 148, 528, 652].map((x) => (
          <path
            key={x}
            d={`M${x} 548 L${x} 420 Q${x + 62} 356 ${x + 124} 420 L${x + 124} 548 Z`}
            fill="#bfd2e0"
            stroke="#9db4c6"
            strokeWidth="3"
            opacity="0.85"
          />
        ))}
      </g>

      {/* god-rays */}
      <path className="ams-ray" d="M120 0 L300 0 L200 520 L60 520 Z" fill="#ffffff" opacity="0.12" />
      <path className="ams-ray" d="M500 0 L680 0 L740 520 L600 520 Z" fill="#ffffff" opacity="0.1" />

      {/* floor */}
      <ellipse cx="400" cy="940" rx="460" ry="120" fill="#adc2d3" />
      <ellipse cx="400" cy="940" rx="330" ry="84" fill="none" stroke="#cadcea" strokeWidth="4" opacity="0.9" />
      <ellipse cx="400" cy="940" rx="200" ry="52" fill="none" stroke="#cadcea" strokeWidth="3" opacity="0.7" />

      {/* THE BEAM — glow copy + core, descending to the idol */}
      <path className="ams-beam" d="M348 470 L286 930 L514 930 L452 470 Z" fill="url(#ams-beamg)" filter="url(#ams-blur)" />
      <path className="ams-beam" d="M368 470 L330 920 L470 920 L432 470 Z" fill="url(#ams-beamg)" />

      {/* the small idol at the beam's base */}
      <g>
        <path d="M362 902 L438 902 L444 920 L356 920 Z" fill="#8ea9be" />
        <path d="M392 830 Q400 824 408 830 L414 900 L386 900 Z" fill="#f2f7fb" />
        <circle cx="400" cy="824" r="9" fill="#f2f7fb" />
        <path d="M400 812 L396 800 M400 812 L404 800 M394 816 L386 806 M406 816 L414 806" stroke="#f2f7fb" strokeWidth="2.4" />
      </g>

      {/* ================= THE ARCHMOTHER ================= */}
      {/* crown */}
      {AM_SPIKES.map((pts, i) => (
        <polygon key={i} points={pts} fill="#f7fafc" opacity={i % 2 === 0 ? 1 : 0.88} />
      ))}
      {/* head + neck */}
      <ellipse cx="400" cy="210" rx="17" ry="23" fill="#f7fafc" />
      <path d="M391 230 L391 248 L409 248 L409 230 Z" fill="#e9f1f8" />

      {/* outstretched arms + hanging sleeves (mirrored) */}
      <g>
        <path d="M372 262 L128 214 L122 232 L368 284 Z" fill="#f7fafc" />
        <path d="M128 214 L100 208 L112 232 L126 230 Z" fill="#f7fafc" />
        <path d="M362 276 L226 474 L262 480 L376 300 Z" fill="#e9f1f8" />
        <path d="M366 288 L296 436 L338 352 Z" fill="#cfe0ec" />
      </g>
      <g transform="translate(800,0) scale(-1,1)">
        <path d="M372 262 L128 214 L122 232 L368 284 Z" fill="#f7fafc" />
        <path d="M128 214 L100 208 L112 232 L126 230 Z" fill="#f7fafc" />
        <path d="M362 276 L226 474 L262 480 L376 300 Z" fill="#e9f1f8" />
        <path d="M366 288 L296 436 L338 352 Z" fill="#cfe0ec" />
      </g>

      {/* robe column */}
      <path d="M370 252 Q400 240 430 252 L446 470 L462 880 L338 880 L354 470 Z" fill="#f7fafc" />
      <path d="M400 254 L400 876" stroke="#cfe0ec" strokeWidth="3" opacity="0.85" />
      <path d="M378 300 L364 872 M422 300 L436 872" stroke="#e2edf5" strokeWidth="3" fill="none" opacity="0.9" />
      <path d="M382 356 L400 378 L418 356 L400 340 Z" fill="#a9c8e0" />
      <path d="M338 880 L462 880 L468 898 L332 898 Z" fill="#e2edf5" />
    </svg>
  )
}

export function HiddenKingScene() {
  return (
    <svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="hks-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a5136" />
          <stop offset="45%" stopColor="#4a2e1c" />
          <stop offset="80%" stopColor="#2c1810" />
          <stop offset="100%" stopColor="#1a0d06" />
        </linearGradient>
        <radialGradient id="hks-haze" cx="0.5" cy="0.42" r="0.55">
          <stop offset="0%" stopColor="#d9975a" stopOpacity="0.85" />
          <stop offset="65%" stopColor="#a06336" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a06336" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hks-fireg" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffd056" />
          <stop offset="60%" stopColor="#f08c1c" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f08c1c" stopOpacity="0" />
        </radialGradient>
        <filter id="hks-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* atmosphere */}
      <rect width="800" height="1000" fill="url(#hks-bg)" />
      <ellipse cx="400" cy="420" rx="340" ry="430" fill="url(#hks-haze)" />

      {/* cathedral ribs (pointed arch) */}
      <g stroke="#1f1109" fill="none" opacity="0.9">
        <path d="M40 1000 C40 420 210 150 400 60 C590 150 760 420 760 1000" strokeWidth="16" />
        <path d="M120 1000 C120 470 260 220 400 130 C540 220 680 470 680 1000" strokeWidth="10" opacity="0.7" />
      </g>

      {/* hanging chains */}
      <g stroke="#150c06" strokeWidth="4" fill="none" opacity="0.8">
        <path d="M250 0 C252 90 262 150 286 208" strokeDasharray="10 6" />
        <path d="M552 0 C550 84 540 146 518 202" strokeDasharray="10 6" />
      </g>

      {/* side structures + lit windows */}
      <g fill="#241309">
        <path d="M0 620 L150 600 L150 1000 L0 1000 Z" />
        <path d="M800 620 L650 600 L650 1000 L800 1000 Z" />
        <path d="M0 590 L150 570 L150 600 L0 620 Z" fill="#31190c" />
        <path d="M800 590 L650 570 L650 600 L800 620 Z" fill="#31190c" />
      </g>
      <g fill="#ffb62e" opacity="0.75">
        <circle cx="52" cy="700" r="5" /><circle cx="96" cy="740" r="4" /><circle cx="60" cy="820" r="4" />
        <circle cx="748" cy="700" r="5" /><circle cx="704" cy="744" r="4" /><circle cx="740" cy="824" r="4" />
      </g>

      {/* red drapes */}
      <g fill="#a03024" opacity="0.9">
        <path d="M158 330 L214 322 L206 470 L196 440 L186 476 L172 444 L166 480 Z" />
        <path d="M586 322 L642 330 L634 480 L620 444 L610 476 L600 440 L594 470 Z" />
      </g>

      {/* lightning */}
      <g className="hks-bolt" stroke="#ffe98a" fill="none" strokeLinejoin="round">
        <path d="M396 0 L408 46 L390 74 L410 108 L398 150" strokeWidth="5" filter="url(#hks-blur)" />
        <path d="M396 0 L408 46 L390 74 L410 108 L398 150" strokeWidth="2.5" />
      </g>
      <path className="hks-bolt2" d="M0 566 L150 546 L260 566 L330 550 M800 566 L650 548 L540 566 L470 552"
        stroke="#ffdf7a" strokeWidth="3" fill="none" opacity="0.75" />

      {/* ================= THE HIDDEN KING ================= */}
      {/* branch antlers */}
      <g stroke="#16100a" fill="none" strokeLinecap="round">
        <path d="M392 176 C382 140 366 118 336 96" strokeWidth="13" />
        <path d="M336 96 L290 62 M336 96 L358 58 M352 118 L308 106" strokeWidth="8" />
        <path d="M408 176 C420 138 438 112 472 92" strokeWidth="13" />
        <path d="M472 92 L520 56 M472 92 L452 52 M452 116 L498 108" strokeWidth="8" />
        <path d="M400 170 C401 136 404 118 410 92 M410 92 L400 66 M410 92 L428 72" strokeWidth="7" />
      </g>

      {/* head + green burning eyes */}
      <path d="M378 172 Q400 160 422 172 L419 226 Q400 238 381 226 Z" fill="#16100a" />
      <circle className="hks-eye" cx="390" cy="198" r="5" fill="#b6ff5e" />
      <circle className="hks-eye" cx="410" cy="198" r="5" fill="#b6ff5e" />

      {/* shoulder mantle */}
      <path d="M150 330 L392 236 L408 236 L650 330 L610 388 L400 320 L190 388 Z" fill="#16100a" />

      {/* cloak with ragged hem + side tatters */}
      <path
        d="M190 372
           L166 560 L184 590 L160 700 L186 730 L172 860
           L226 812 L242 900 L292 840 L310 918 L354 856
           L400 934 L446 856 L490 918 L508 840 L558 900 L574 812
           L628 860 L614 730 L640 700 L616 590 L634 560 L610 372
           L400 300 Z"
        fill="#16100a"
      />
      <path d="M312 330 L292 840 L508 840 L488 330 L400 300 Z" fill="#0b0704" />

      {/* THE HANDS — glow underlay + clasped, long drooping fingers */}
      <ellipse className="hks-handglow" cx="400" cy="500" rx="120" ry="130" fill="url(#hks-fireg)" opacity="0.55" filter="url(#hks-blur)" />
      <g className="hks-hands">
        <path d="M482 396 L436 470 L406 494 L392 480 L442 414 Z" fill="#f7a733" />
        <path d="M416 482 Q402 560 376 610 Q386 616 394 608 Q416 556 432 490 Z" fill="#ffce56" />
        <path d="M404 488 Q384 566 352 618 Q362 625 370 616 Q398 566 420 494 Z" fill="#f7a733" />
        <path d="M392 490 L366 566 Q346 610 326 632 Q336 640 344 632 Q378 588 404 498 Z" fill="#ffce56" />
        <path d="M382 486 Q352 552 318 588 Q328 598 338 590 Q372 548 396 494 Z" fill="#e8891c" />
        <path d="M318 428 L364 498 L396 522 L410 508 L358 444 Z" fill="#e8891c" />
        <path d="M384 512 Q404 588 434 634 Q424 642 416 634 Q392 584 372 518 Z" fill="#ffce56" />
        <path d="M396 506 Q422 580 456 622 Q446 632 438 624 Q408 576 384 510 Z" fill="#f7a733" />
        <path d="M408 500 Q440 566 474 598 Q464 610 454 602 Q420 566 394 506 Z" fill="#e8891c" />
      </g>

      {/* ================= the burning effigy ================= */}
      {/* ritual circle */}
      <ellipse cx="400" cy="950" rx="250" ry="58" fill="#241208" />
      <ellipse cx="400" cy="948" rx="236" ry="52" fill="none" stroke="#c9772a" strokeWidth="3" opacity="0.65" strokeDasharray="16 10" />
      <ellipse cx="400" cy="948" rx="170" ry="38" fill="none" stroke="#c9772a" strokeWidth="2" opacity="0.45" />

      {/* fire glow inside the effigy */}
      <path className="hks-fire" d="M400 690 Q436 760 424 830 Q446 880 430 936 L370 936 Q354 878 376 828 Q362 758 400 690 Z"
        fill="url(#hks-fireg)" filter="url(#hks-blur)" />

      {/* twisting wooden strips */}
      <g fill="none" stroke="#3d2413" strokeLinecap="round">
        <path d="M400 686 C368 716 428 738 388 770 C352 800 444 822 396 856 C356 886 452 902 404 934" strokeWidth="13" />
        <path d="M402 692 C438 724 366 748 416 782 C452 812 356 836 410 868 C448 894 352 908 398 934" strokeWidth="11" />
        <path d="M386 720 C352 756 372 796 348 838 C332 872 360 908 344 934" strokeWidth="8" />
        <path d="M416 722 C452 760 430 800 456 842 C472 876 444 910 458 934" strokeWidth="8" />
        <path d="M374 934 L330 962 M428 934 L472 960 M400 934 L400 964" strokeWidth="7" />
      </g>
      {/* stray embers */}
      <g className="hks-fire" fill="#ffb62e">
        <circle cx="382" cy="668" r="4" /><circle cx="418" cy="648" r="3" /><circle cx="402" cy="622" r="2.5" />
      </g>
    </svg>
  )
}
