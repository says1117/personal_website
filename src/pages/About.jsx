import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Archmother, HiddenKing } from '../components/Patrons'
import './about-patrons.css'

/* ============================================================
   About — "THE GREAT GAME" (Deadlock Old Gods, New Blood-
   inspired; original art & design, no Valve assets).

   Design system (user constraints):
   · UNIFIED palette — one deep gritty set (--dl-*) shared by
     BOTH patrons: ink-olive, coal, olive, bone, burnt amber.
   · CHECKERBOARD motif — dividers, the wedge border, card
     hover reveals, the pedestal course, HUD strip.
   · TRIANGLE layout — the Hidden King rises from a checker-
     edged triangular panel anchored bottom-right; the
     Archmother stands monumental top-left. The page reads
     along the diagonal between them.
   · Game-UI interactables — patron eyes/halo track the cursor
     (--gx/--gy via rAF), a SOULS counter that pays out as you
     explore, and a letterboxed patron dialogue bar.

   Reduced motion / coarse pointers: gaze + dialogue interval
   are skipped; layout is fully responsive (the wedge becomes a
   flowing section on small screens via CSS).
   ============================================================ */

const EMAIL = 'saysschool4321@gmail.com'

/* The dossier: formal doctrine, each with the King's scrawled
   annotation beneath — two voices, one palette. */
const FACTS = [
  {
    id: 'craft',
    k: 'The Craft',
    v: 'Begin from the citizen’s need. Raise a sharp first structure, then refine it under real light. Details are load-bearing.',
    note: 'ship the rough cut. keep what survives.',
  },
  {
    id: 'instruments',
    k: 'Instruments',
    v: 'React and TypeScript at the facade. Python in the engine rooms below. Whatever steel the structure demands.',
    note: 'whatever gets the job done clean.',
  },
  {
    id: 'works',
    k: 'Civic Works',
    v: 'Accessible tools as public infrastructure — an ASL-to-speech instrument; NextPlay, a disciplined kanban.',
    note: 'tools for people the city forgot.',
  },
  {
    id: 'contact',
    k: 'Correspondence',
    v: null, // rendered as the mail link
    note: 'leave word. i hear everything in the cracks.',
  },
]

const DIALOGUE = [
  { who: 'THE ARCHMOTHER', line: 'Order is a kindness. Precision, a devotion.' },
  { who: 'THE HIDDEN KING', line: 'ship it rough. polish is for tombstones.' },
  { who: 'THE ARCHMOTHER', line: 'Every structure begins as a citizen’s need.' },
  { who: 'THE HIDDEN KING', line: 'the city keeps what survives. so do i.' },
  { who: 'THE ARCHMOTHER', line: 'He builds in glass and steel. I guide the hand.' },
  { who: 'THE HIDDEN KING', line: 'he builds in the cracks too. those are mine.' },
]

export default function About() {
  const rootRef = useRef(null)
  const [souls, setSouls] = useState(1130)
  const [line, setLine] = useState(0)
  const earned = useRef(new Set())

  /* Patron gaze — eased cursor vector on --gx/--gy (−1…1) */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const frame = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      root.style.setProperty('--gx', cx.toFixed(3))
      root.style.setProperty('--gy', cy.toFixed(3))
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  /* Patron dialogue rotation */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setLine((l) => (l + 1) % DIALOGUE.length), 5200)
    return () => clearInterval(id)
  }, [])

  /* Souls pay out once per discovery */
  const earn = (id, amount) => {
    if (earned.current.has(id)) return
    earned.current.add(id)
    setSouls((s) => s + amount)
  }

  return (
    <main className="patrons" ref={rootRef}>
      {/* --- Match HUD --- */}
      <div className="patrons__hud">
        <Link to="/" className="patrons__back">← Star map</Link>
        <span className="patrons__hudtitle">The Great Game · About</span>
        <span className="patrons__souls" title="Souls earned this visit">
          <span className="patrons__soul-orb" aria-hidden="true" />
          {souls.toLocaleString()}
        </span>
      </div>
      <div className="checker-strip checker-strip--hud" aria-hidden="true" />

      <section className="patrons__stage">
        {/* The Archmother — monumental, top-left */}
        <div
          className="patrons__mother"
          aria-hidden="true"
          onMouseEnter={() => earn('mother', 60)}
        >
          <Archmother />
          <p className="patrons__figure-label">The Archmother</p>
        </div>

        <header className="patrons__head">
          <p className="patrons__eyebrow">Old Gods · New Blood</p>
          <h1 className="patrons__title">Steven<br />Yodice-Smith</h1>
          <div className="checker-strip" aria-hidden="true" />
          <p className="patrons__sub">
            Two patrons watch the work. Neither is ever fully satisfied.
            The work improves.
          </p>
        </header>

        {/* The dossier */}
        <div className="patrons__dossier">
          {FACTS.map((f, i) => (
            <article
              className="dcard"
              key={f.id}
              onMouseEnter={() => earn(f.id, 40 + i * 10)}
            >
              <header className="dcard__head">
                <span className="dcard__num">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="dcard__k">{f.k}</h2>
              </header>
              {f.id === 'contact' ? (
                <p className="dcard__v">
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </p>
              ) : (
                <p className="dcard__v">{f.v}</p>
              )}
              <p className="dcard__note">« {f.note} »</p>
            </article>
          ))}
        </div>

        {/* The Hidden King — the triangle, bottom-right */}
        <div
          className="patrons__wedge"
          aria-hidden="true"
          onMouseEnter={() => earn('king', 100)}
        >
          <div className="patrons__wedge-inner">
            <div className="patrons__king"><HiddenKing /></div>
            <p className="patrons__figure-label patrons__figure-label--king">
              The Hidden King
            </p>
          </div>
        </div>

        {/* Patron dialogue bar */}
        <div className="patrons__dialogue" aria-live="polite">
          <span className="patrons__speaker">{DIALOGUE[line].who}</span>
          <span className="patrons__line" key={line}>{DIALOGUE[line].line}</span>
        </div>
      </section>

      {/* --- Credits (required attribution) --- */}
      <footer className="patrons__credits">
        <p>
          Planet textures ©{' '}
          <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer noopener">
            Solar System Scope
          </a>{' '}
          (CC BY 4.0), derived from NASA imagery. Planet art rendered originally in
          WebGL. Experience-page dusk parallax art and rider sprite by{' '}
          <a href="https://opengameart.org/content/mountain-at-dusk-background" target="_blank" rel="noreferrer noopener">
            ansimuz
          </a>{' '}
          (CC0); Utahraptor run cycle —{' '}
          <a href="https://opengameart.org/content/2d-raptor-running-fbx-animation" target="_blank" rel="noreferrer noopener">
            animation by kestrelm, artwork by Fred Wierum
          </a>{' '}
          (CC BY-SA 4.0, via OpenGameArt). Themed sections are original homages —
          no Bungie, Wildcard, or Valve artwork is used.
        </p>
      </footer>
    </main>
  )
}
