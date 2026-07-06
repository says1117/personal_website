import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import TekPortal from '../components/TekPortal'
import { SupplyPod, TekPad } from '../components/ArkProps'
import './experience.css'

/* ============================================================
   Experience — ARK-inspired "ride" through the timeline.

   Art: licensed game assets in /public/ark —
   · Dusk parallax layers (sky/moon, mountains ×2, tree lines)
     from "Mountain Dusk / parallax mountain pack" by ansimuz
     (OpenGameArt, CC0)
   · Utahraptor run cycle (58-frame strip built from the render
     of "2D Raptor Running" — animation by kestrelm, artwork by
     Fred Wierum, CC-BY-SA 4.0, via OpenGameArt), rendered as a
     full silhouette (CSS brightness(0)) to sit in the dusk.
   Credits shown on the About page + README.

   Mechanic: a tall scroll wrapper pins a 100vh scene. Scroll
   progress p (0→1) is written as --p on .ark__scene and drives
   the parallax layer translations, the Day counter, the XP bar
   and the active tribe-log entry. The raptor's run cycle is
   DISTANCE-COUPLED: the sprite frame is computed from ground
   pixels traveled (one 58-frame cycle per STRIDE_PX), so the
   feet lock to the ground at any scroll speed — and run
   backward when you scroll back. The survivor rider bobs from
   the SAME frame index, so mount and rider can never drift.
   Supply-drop beacons land one per entry; the Tek Teleporter
   waits at the end and opens a destination portal (TekPortal)
   on arrival or click. Reduced motion → plain stacked log.

   EXTENDING THE JOURNEY: just add entries to LOG below (keep
   them oldest → newest). Everything re-spaces automatically —
   supply drops spread evenly along the ride, the XP ticks and
   segment boundaries recompute from LOG.length, and the Tek
   Teleporter always waits at the very end (its offset is the
   full GROUND_TRAVEL, independent of entry count).
   ============================================================ */

const LOG = [
  {
    day: 120,
    lvl: 21,
    tag: 'ENGRAM UNLOCKED',
    when: 'Earlier',
    role: 'Education / Foundations',
    org: 'Add your program',
    desc: 'Coursework, certifications, or the work that got you started.',
    gains: ['Python', 'CS fundamentals'],
  },
  {
    day: 940,
    lvl: 47,
    tag: 'TAMED: FRONTEND',
    when: '2024 — 2025',
    role: 'Frontend Developer',
    org: 'Add your role',
    desc: 'Describe the impact you had — features shipped, problems solved, scale handled.',
    gains: ['React', 'TypeScript'],
  },
  {
    day: 1780,
    lvl: 74,
    tag: 'BOSS FIGHT: SHIPPING',
    when: '2025 — Present',
    role: 'Software Engineer',
    org: 'Independent / Project work',
    desc: 'Building the ASL-to-TTS model and NextPlay. Owning everything from data and ML to frontend and deployment.',
    gains: ['ML', 'Full-stack', 'Deployment'],
  },
  {
    day: 2190,
    lvl: 99,
    tag: 'ASCENSION',
    when: 'Next',
    role: 'Next expedition',
    org: 'Your team?',
    desc: 'Open to software engineering roles — recruiting this survivor gets you ML + frontend range and a shipping habit.',
    gains: ['Contact: see About'],
  },
]

const DAY_START = 1
const DAY_END = LOG[LOG.length - 1].day

/* Supply-drop loot-tier colors — quality rises with experience. */
const DROP_COLORS = ['#7fdc7f', '#5aa8ff', '#c184ff', '#ffd257']

/* Drop-layer travel in px over p 0→1 (must match the CSS
   translate on .ark__drops). */
const GROUND_TRAVEL = 2400
/* Screen x (vw) where a drop lines up with the dino. */
const MEET_VW = 24

/* A drop for entry i reaches the meet point at the MIDDLE of
   that entry's scroll segment. */
const dropOffset = (i) => ((i + 0.5) / LOG.length) * GROUND_TRAVEL

/* --- Raptor sprite geometry (distance-coupled run cycle) ------- */
const FRAMES = 58 // frames in raptor-run.png
/* Ground px one full gait cycle covers — THE stride tunable.
   Smaller = franticker legs, larger = gliding. */
const STRIDE_PX = 280
/* Rider bob: amplitude (displayed px) + phase against the cycle. */
const BOB_PX = 6
const BOB_PHASE = Math.PI * 0.6


export default function Experience() {
  const wrapRef = useRef(null)
  const sceneRef = useRef(null)
  const dayRef = useRef(null)
  const dinoRef = useRef(null)
  const riderRef = useRef(null)
  const openedOnce = useRef(false)
  const [active, setActive] = useState(0)
  const [portalOpen, setPortalOpen] = useState(false)
  const [staticMode] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (staticMode) return
    const wrap = wrapRef.current
    const scene = sceneRef.current
    if (!wrap || !scene) return

    let raf = 0
    let idleTimer = 0

    const update = () => {
      const total = wrap.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, -wrap.getBoundingClientRect().top / total))
      scene.style.setProperty('--p', p.toFixed(4))

      /* Day counter — direct DOM write, no re-render */
      if (dayRef.current) {
        dayRef.current.textContent = String(
          Math.round(DAY_START + p * (DAY_END - DAY_START))
        )
      }

      /* Distance-coupled gait: sprite frame follows ground pixels
         traveled, so the feet lock to the ground at any scroll
         speed (and run backward when scrolling up). The dino is
         viewport-sized (CSS clamp), so the per-frame offset is
         its live clientWidth — background-size is 5800% (58 ×
         100%), making one frame exactly one element-width. */
      const frame = Math.floor(((p * GROUND_TRAVEL) / STRIDE_PX) * FRAMES) % FRAMES
      if (dinoRef.current) {
        const fw = dinoRef.current.clientWidth
        dinoRef.current.style.backgroundPositionX = `-${frame * fw}px`
      }
      /* Rider bob derives from the SAME frame index — locked. */
      if (riderRef.current) {
        const bob = Math.sin((frame / FRAMES) * Math.PI * 2 + BOB_PHASE) * BOB_PX
        riderRef.current.style.transform = `translateY(${bob.toFixed(1)}px)`
      }

      /* Run while the scroll is live; settle to idle after */
      scene.classList.add('is-running')
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => scene.classList.remove('is-running'), 200)

      /* Journey's end: power up the Tek Teleporter */
      scene.classList.toggle('is-arrived', p > 0.92)

      /* Auto-open the Tek Portal once, right at the pad */
      if (p > 0.985 && !openedOnce.current) {
        openedOnce.current = true
        setPortalOpen(true)
      }

      /* Active tribe-log segment (state changes only on crossing) */
      const idx = Math.min(LOG.length - 1, Math.floor(p * LOG.length))
      setActive((prev) => (prev === idx ? prev : idx))
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(idleTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [staticMode])

  const entry = LOG[active]

  /* ---------- Reduced-motion fallback: plain survivor log ---------- */
  if (staticMode) {
    return (
      <main className="ark ark--static shell">
        <Link to="/" className="ark__back">← Star map</Link>
        <header className="ark__head">
          <p className="ark__eyebrow">MOO · 03 · Survivor log</p>
          <h1 className="ark__title">Experience</h1>
        </header>
        {LOG.map((e) => (
          <article className="log-card" key={e.day}>
            <div className="log-card__day">DAY {e.day} · LVL {e.lvl}</div>
            <div className="log-card__tag">{e.tag}</div>
            <h2 className="log-card__role">{e.role}</h2>
            <div className="log-card__org">{e.org} · {e.when}</div>
            <p className="log-card__desc">{e.desc}</p>
          </article>
        ))}
      </main>
    )
  }

  /* ------------------------- The ride ------------------------- */
  return (
    <main className="ark">
      <div className="ark__ride" ref={wrapRef}>
        <div className="ark__scene" ref={sceneRef} style={{ '--p': 0 }}>
          {/* Dusk sky with moon + clouds (ansimuz, CC0) */}
          <div className="ark__sky" aria-hidden="true" />

          {/* Meteor shower — ambient streaks across the dusk sky */}
          <div className="ark__meteors" aria-hidden="true">
            <span style={{ left: '68%', top: '-4%', '--mdur': '7s', '--mdelay': '0s', '--mscale': 1 }} />
            <span style={{ left: '30%', top: '-8%', '--mdur': '11s', '--mdelay': '2.6s', '--mscale': 0.7 }} />
            <span style={{ left: '88%', top: '-2%', '--mdur': '9s', '--mdelay': '5.1s', '--mscale': 0.85 }} />
            <span style={{ left: '48%', top: '-6%', '--mdur': '13s', '--mdelay': '7.4s', '--mscale': 0.55 }} />
            <span style={{ left: '10%', top: '-3%', '--mdur': '10s', '--mdelay': '4s', '--mscale': 0.65 }} />
          </div>

          {/* Parallax landscape (far → near, all seamless repeat-x) */}
          <div className="ark__layer ark__layer--far" aria-hidden="true" />
          <div className="ark__layer ark__layer--mountains" aria-hidden="true" />

          {/* Obelisk — crosses by mid-ride */}
          <div className="ark__layer ark__layer--obelisk" aria-hidden="true">
            <div className="ark__beam" />
            <div className="ark__spire" />
          </div>

          <div className="ark__layer ark__layer--trees" aria-hidden="true" />

          {/* Ground band the dino runs on */}
          <div className="ark__ground" aria-hidden="true" />

          {/* Supply drops — one landmark per log entry, planted in the
              world (moves with the ground) and lit while its entry is
              active. Beam colors = rising loot tiers. */}
          <div className="ark__layer ark__drops" aria-hidden="true">
            {LOG.map((e, i) => (
              <div
                key={e.day}
                className={`drop${active === i ? ' is-active' : ''}`}
                style={{
                  left: `calc(${MEET_VW}vw + ${dropOffset(i)}px)`,
                  '--drop-color': DROP_COLORS[i % DROP_COLORS.length],
                }}
              >
                <span className="drop__beam" />
                {/* ARK-style supply pod (faceted SVG, tier ring via
                    the inherited --drop-color) */}
                <span className="drop__pod"><SupplyPod /></span>
                <span className="drop__label">DAY {e.day}</span>
              </div>
            ))}
          </div>

          {/* Tek Teleporter — journey's end, in its OWN layer (same
              travel as the ground) so it can be a real, focusable
              button that opens the Tek Portal. Pinned at the full
              GROUND_TRAVEL = always the final landmark no matter
              how many LOG entries exist. Powers up on .is-arrived. */}
          <div className="ark__layer ark__drops ark__tek-layer">
            <button
              type="button"
              className="tek"
              style={{ left: `calc(${MEET_VW}vw + ${GROUND_TRAVEL}px)` }}
              onClick={() => setPortalOpen(true)}
              aria-label="Open Tek Teleporter — choose a destination"
            >
              <span className="tek__column" />
              {/* ARK-style flat hex teleporter pad (faceted SVG) —
                  teal trim dormant-dim, ignites on .is-arrived */}
              <span className="tek__gate"><TekPad /></span>
              <span className="tek__label">TEK TELEPORTER · NEXT EXPEDITION</span>
            </button>
          </div>

          {/* The mount — sprite strip, silhouetted, frame driven by
              ground distance (see update()). The rider is a crouched
              survivor sprite (ansimuz, CC0) whose lean reads as a
              riding posture; it bobs in lockstep with the gait. */}
          <div className="ark__dino" ref={dinoRef} aria-hidden="true">
            <span className="ark__rider" ref={riderRef}>
              <img src="/ark/rider.png" alt="" />
            </span>
          </div>

          {/* Foreground pines pass IN FRONT of the dino for depth */}
          <div className="ark__layer ark__layer--fg" aria-hidden="true" />

          {/* Survivor HUD */}
          <div className="ark__hud">
            <div className="ark__hud-row">
              <Link to="/" className="ark__back">← Star map</Link>
              <div className="ark__readout">
                <span className="ark__chip">DAY <b ref={dayRef}>1</b></span>
                <span className="ark__chip ark__chip--lvl">LVL {entry.lvl}</span>
              </div>
            </div>
            <h1 className="ark__title">Experience</h1>
            <p className="ark__eyebrow">SURVIVOR LOG · STEVEN YODICE-SMITH</p>
            {/* XP bar — fills with the ride; one tick per entry */}
            <div className="ark__xp" role="progressbar" aria-label="Timeline progress">
              <div className="ark__xp-fill" />
              {LOG.map((_, i) => (
                <span
                  key={i}
                  className="ark__xp-tick"
                  style={{ left: `${((i + 1) / LOG.length) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Active tribe-log card (keyed → swap animation) */}
          <article className="log-card log-card--ride" key={active}>
            <div className="log-card__day">DAY {entry.day} · LVL {entry.lvl}</div>
            <div className="log-card__tag">{entry.tag}</div>
            <h2 className="log-card__role">{entry.role}</h2>
            <div className="log-card__org">{entry.org} · {entry.when}</div>
            <p className="log-card__desc">{entry.desc}</p>
            <ul className="log-card__gains">
              {entry.gains.map((g) => (
                <li key={g}>+ {g}</li>
              ))}
            </ul>
          </article>

          <p className="ark__hint">SCROLL TO RIDE</p>
        </div>
      </div>

      {/* Tek Portal — the teleporter's destination screen */}
      {portalOpen && <TekPortal onClose={() => setPortalOpen(false)} />}
    </main>
  )
}
