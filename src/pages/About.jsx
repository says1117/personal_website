import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArchmotherScene, HiddenKingScene } from '../components/PatronScenes'
import SoulPlayground from '../components/SoulPlayground'
import './about-patrons.css'

/* ============================================================
   About — "THE GREAT GAME" v3: the key-art split.

   The page IS the poster: the Archmother's poster-blue field on
   the left, the Hidden King's poster-yellow field on the right,
   divided by a hard DIAGONAL cut whose position (--split)
   chases the cursor with inertia. At rest it's 50/50 — pure
   key art. Push into a side to reveal that patron's dossier
   (the same four facts, voiced by each patron).

   · Colored checkers: white/blue strips on her side,
     black/orange on his (per the user's note).
   · Poster logotypes: Cinzel for ARCHMOTHER, Rock Salt scrawl
     for Hidden King.
   · SOULS counter + patron dialogue bar carried over from v2.
   · SoulPlayground: the cracked soul orb is a physics toy
     (bat / grab / throw) and CALICO the sphynx chases it —
     and flees your cursor. Scoring feeds the Souls counter.

   Default layout is STACKED (mobile / reduced-motion / coarse
   pointer); the live split + playground mount only on fine
   pointers with motion allowed. The King layer is aria-hidden
   (mirrored, re-voiced content) so screen readers hear one page.
   ============================================================ */

const EMAIL = 'saysschool4321@gmail.com'

/* ---- exact-image mode --------------------------------------
   Drop the reference images into /public/oldgods/ (see the
   README there) and the page uses them automatically:
   the two model shots become the realm BACKGROUNDS, the soul
   screenshot skins the orb, and a Calico cutout replaces the
   vector cat. Missing files fall back to the original art —
   keep the image build private (Valve IP). */
function useAsset(url) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const img = new Image()
    img.onload = () => setOk(true)
    img.src = url
  }, [url])
  return ok
}

const IMG = {
  mother: '/oldgods/archmother.jpg',
  king: '/oldgods/hiddenking.jpg',
  soul: '/oldgods/soul.png',
  calico: '/oldgods/calico.png',
}

/* Same four facts, two voices. */
const FACTS = [
  {
    id: 'craft',
    mother: {
      k: 'The Craft',
      v: 'Begin from the citizen’s need. Raise a sharp first structure, then refine it under real light. Details are load-bearing.',
    },
    king: {
      k: 'the grind',
      v: 'start with somebody’s actual problem. ship the rough cut, fix it in the street. keep what survives.',
    },
  },
  {
    id: 'instruments',
    mother: {
      k: 'Instruments',
      v: 'React and TypeScript at the facade. Python in the engine rooms below. Whatever steel the structure demands.',
    },
    king: {
      k: 'tools of the trade',
      v: 'react + typescript out front. python running the back rooms. whatever gets the job done clean.',
    },
  },
  {
    id: 'works',
    mother: {
      k: 'Civic Works',
      v: 'Accessible tools as public infrastructure — an ASL-to-speech instrument; NextPlay, a disciplined kanban.',
    },
    king: {
      k: 'after hours',
      v: 'side jobs that talk: a rig that turns sign into speech. a kanban with good manners. tools for the forgotten.',
    },
  },
  {
    id: 'contact',
    mother: { k: 'Correspondence', v: null },
    king: { k: 'leave word', v: null },
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

/* Diagonal cut, matching the poster's slant: the King's layer is
   clipped left of a line running from (split+10vw, top) down to
   (split−10vw, bottom). */
const KING_CLIP =
  'polygon(calc(var(--split) + 10vw) 0, 100% 0, 100% 100%, calc(var(--split) - 10vw) 100%)'

function Plaques({ voice }) {
  return (
    <div className="og__plaques">
      {FACTS.map((f) => {
        const t = f[voice]
        return (
          <article className="og-plaque" key={f.id}>
            <div className="checker-mini" aria-hidden="true" />
            <h3 className="og-plaque__k">{t.k}</h3>
            {f.id === 'contact' ? (
              <p className="og-plaque__v">
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </p>
            ) : (
              <p className="og-plaque__v">{t.v}</p>
            )}
          </article>
        )
      })}
    </div>
  )
}

export default function About() {
  const rootRef = useRef(null)
  const [pin, setPin] = useState(null)
  const [souls, setSouls] = useState(1130)
  const [line, setLine] = useState(0)
  const [live, setLive] = useState(false)

  /* exact-image assets (auto-detected; see /public/oldgods/) */
  const motherImg = useAsset(IMG.mother)
  const kingImg = useAsset(IMG.king)
  const soulImg = useAsset(IMG.soul)
  const calicoImg = useAsset(IMG.calico)

  const addSouls = useCallback((n) => setSouls((s) => s + n), [])

  /* the seam — eased toward the cursor, overridden by pledges */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wide = window.matchMedia('(min-width: 901px)').matches
    if (!fine || reduce || !wide) return

    setLive(true)
    root.classList.add('og--live')

    let tx = 0.5
    let cur = 0.5
    let raf = 0

    const onMove = (e) => {
      tx = Math.min(0.92, Math.max(0.08, e.clientX / window.innerWidth))
    }
    const frame = () => {
      const pinNow = root.dataset.pin
      const target = pinNow === 'mother' ? 0.9 : pinNow === 'king' ? 0.1 : tx
      cur += (target - cur) * 0.075
      root.style.setProperty('--split', `${(cur * 100).toFixed(2)}%`)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    root.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      root.removeEventListener('pointermove', onMove)
      root.classList.remove('og--live')
    }
  }, [])

  /* patron dialogue */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setLine((l) => (l + 1) % DIALOGUE.length), 5200)
    return () => clearInterval(id)
  }, [])

  const pledge = (side) => setPin((p) => (p === side ? null : side))

  return (
    <main className="og" ref={rootRef} data-pin={pin ?? undefined}>
      {/* --- match HUD --- */}
      <div className="og__hud">
        <Link to="/" className="og__back">← Star map</Link>
        <span className="og__hudtitle">Steven Yodice-Smith · The Great Game</span>
        <span className="og__souls" title="Souls earned this visit">
          <span className="og__soul-orb" aria-hidden="true" />
          {souls.toLocaleString()}
        </span>
      </div>

      <div className="og__stage">
        {/* ------- THE ARCHMOTHER (base, poster blue) ------- */}
        <section
          className={`og-realm og-realm--mother${motherImg ? ' og-realm--img' : ''}`}
          style={motherImg ? { backgroundImage: `url(${IMG.mother})` } : undefined}
        >
          {!motherImg && (
            <div className="og-realm__scene" aria-hidden="true">
              <ArchmotherScene />
            </div>
          )}
          <div className="og-realm__content og-realm__content--mother">
            <h1 className="og-logotype og-logotype--mother">Archmother</h1>
            <div className="checker-strip checker-strip--mother" aria-hidden="true" />
            <p className="og-realm__creed">
              Glass, steel and stone. Order and power where once there was none.
            </p>
            <Plaques voice="mother" />
          </div>
        </section>

        {/* ------- THE HIDDEN KING (top, poster yellow, diagonal clip) ------- */}
        <section
          className={`og-realm og-realm--king${kingImg ? ' og-realm--img' : ''}`}
          style={
            kingImg
              ? { clipPath: KING_CLIP, backgroundImage: `url(${IMG.king})` }
              : { clipPath: KING_CLIP }
          }
          aria-hidden="true"
        >
          {!kingImg && (
            <div className="og-realm__scene" aria-hidden="true">
              <HiddenKingScene />
            </div>
          )}
          <div className="og-realm__content og-realm__content--king">
            <h1 className="og-logotype og-logotype--king">Hidden King</h1>
            <div className="checker-strip checker-strip--king" aria-hidden="true" />
            <p className="og-realm__creed">
              the stretching shadow of a skyscraper. he waits in the cracks.
            </p>
            <Plaques voice="king" />
          </div>
        </section>

        {/* ------- shared chrome ------- */}
        <div className="og__pledges" role="group" aria-label="Pledge to a patron">
          <button
            type="button"
            className={`og-pledge og-pledge--mother${pin === 'mother' ? ' is-on' : ''}`}
            aria-pressed={pin === 'mother'}
            onClick={() => pledge('mother')}
          >
            ☩ Archmother
          </button>
          <button
            type="button"
            className={`og-pledge og-pledge--king${pin === 'king' ? ' is-on' : ''}`}
            aria-pressed={pin === 'king'}
            onClick={() => pledge('king')}
          >
            ⚿ hidden king
          </button>
        </div>

        <div className="og__dialogue" aria-live="polite">
          <span className="og__speaker">{DIALOGUE[line].who}</span>
          <span className="og__line" key={line}>{DIALOGUE[line].line}</span>
        </div>
      </div>

      {/* --- credits (required attribution) --- */}
      <footer className="og__credits">
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

      {/* --- the toys (fine pointer + motion only) --- */}
      {live && (
        <SoulPlayground
          onScore={addSouls}
          ballImg={soulImg ? IMG.soul : null}
          catImg={calicoImg ? IMG.calico : null}
        />
      )}
    </main>
  )
}
