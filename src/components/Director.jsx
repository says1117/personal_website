import {
  Suspense,
  createRef,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTransition } from '../context/TransitionContext'
import { DESTINATIONS, HUB, SATELLITES } from '../data/destinations'
import DirectorNode from './DirectorNode'
import DirectorOrnament from './DirectorOrnament'
import './Director.css'

/* Lazy — keeps three.js out of the initial bundle. */
const PlanetLayer = lazy(() => import('./PlanetLayer'))

function webglSupported() {
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    )
  } catch {
    return false
  }
}

/* ============================================================
   Director — the landing HUD: an original sci-fi star chart in
   the Destiny "Director" spirit.

   Rendering: ONE global WebGL canvas (PlanetLayer) draws all
   planets via drei <View> scissor rects tracking each node's
   .planet-shell. No WebGL / reduced motion / context loss →
   SVG fallback planets (PlanetArt via DirectorNode gl=false).

   Interaction — the Destiny feel:
   · custom reticle cursor (pointer:fine only) driven by a rAF
     loop with cursor magnetism (target bends toward a node's
     center inside its well) and friction (chase rate drops
     near nodes → weight)
   · the reticle's SMOOTHED position drives --mx/--my, so the
     global parallax (bg layers via [data-parallax], nodes via
     --depth) inherits the same inertia — one source of truth
   · masked route transition defocuses the whole frame
     (.director--blur) like the in-game menu blur.
   ============================================================ */

export default function Director() {
  const { travelTo, phase } = useTransition()
  const rootRef = useRef(null)
  const reticleRef = useRef(null)
  const [clock, setClock] = useState('')

  /* WebGL planets unless unsupported / reduced motion; a lost
     context also flips this off permanently for the session. */
  const [glOk, setGlOk] = useState(
    () =>
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      webglSupported()
  )

  /* Stable refs shared between each node's .planet-shell and its
     tracking <View>. Views mount after first paint (ready gate)
     so every tracked element exists before a View measures it. */
  const shellRefs = useMemo(() => {
    const o = {}
    DESTINATIONS.forEach((d) => {
      o[d.id] = createRef()
    })
    return o
  }, [])
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  /* Live status clock */
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const p = (n) => String(n).padStart(2, '0')
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  /* Reticle: magnetism + friction, and the parallax source. */
  useEffect(() => {
    const root = rootRef.current
    const ret = reticleRef.current
    if (!root || !ret) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduce || !fine) return

    root.classList.add('director--reticle')

    const mouse = { x: innerWidth / 2, y: innerHeight * 0.45 }
    const pos = { ...mouse }
    let last = performance.now()
    let raf = 0
    const lerp = (a, b, t) => a + (b - a) * t

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      // hide the reticle over the floating nav (it keeps the OS cursor)
      const overNav = e.target?.closest?.('.nav')
      ret.style.opacity = overNav ? '0' : '1'
    }
    const onLeave = () => {
      ret.style.opacity = '0'
      mouse.x = innerWidth / 2
      mouse.y = innerHeight / 2
    }

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      /* Target = mouse, bent toward a node center inside its well. */
      let tx = mouse.x
      let ty = mouse.y
      let k = 0.22 // base chase rate
      let lock = false
      for (const n of root.querySelectorAll('.node')) {
        const r = n.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const R = r.width / 2 + 26 // magnet well: node radius + margin
        const d = Math.hypot(mouse.x - cx, mouse.y - cy)
        if (d < R) {
          const pull = (1 - d / R) * 0.55 // 0 at edge → 0.55 at center
          tx = lerp(mouse.x, cx, pull)
          ty = lerp(mouse.y, cy, pull)
          k = 0.12 // friction: heavier inside the well
          lock = true
          break
        }
      }

      /* Frame-rate-independent chase. */
      const ease = 1 - Math.pow(1 - k, dt * 60)
      pos.x += (tx - pos.x) * ease
      pos.y += (ty - pos.y) * ease

      ret.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      ret.classList.toggle('is-locked', lock)

      /* The smoothed reticle position IS the parallax input. */
      root.style.setProperty('--mx', (((pos.x / innerWidth) - 0.5) * 2).toFixed(3))
      root.style.setProperty('--my', (((pos.y / innerHeight) - 0.5) * 2).toFixed(3))

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    document.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      root.classList.remove('director--reticle')
    }
  }, [])

  return (
    <section
      className={`director${phase !== 'idle' ? ' director--blur' : ''}`}
      ref={rootRef}
      style={{ '--mx': 0, '--my': 0 }}
    >
      {/* Atmospheric layers (parallaxed via data-parallax) */}
      <div className="director__field" aria-hidden="true" />
      <div className="director__nebula" aria-hidden="true" />
      <div className="director__stars director__stars--a" data-parallax="far" aria-hidden="true" />
      <div className="director__stars director__stars--b" data-parallax="mid" aria-hidden="true" />

      {/* Bright "hero" stars with glow */}
      <div className="director__herostars" data-parallax="far" aria-hidden="true">
        <span style={{ left: '16%', top: '22%' }} />
        <span style={{ left: '82%', top: '18%' }} />
        <span style={{ left: '68%', top: '74%' }} />
        <span style={{ left: '30%', top: '82%' }} />
      </div>

      {/* Sun with god-rays */}
      <div className="director__sun" aria-hidden="true" />
      <div className="director__rays" aria-hidden="true" />

      {/* Distant planets for solar-system depth */}
      <div className="director__distant director__distant--1" data-parallax="mid" aria-hidden="true" />
      <div className="director__distant director__distant--2" data-parallax="near" aria-hidden="true" />

      {/* Astrolabe ornament (the Director framing) */}
      <div className="director__ornament" aria-hidden="true">
        <DirectorOrnament />
      </div>

      <div className="director__grid" data-parallax="mid" aria-hidden="true" />
      <div className="director__radar" aria-hidden="true" />
      <div className="director__earth" data-parallax="near" aria-hidden="true">
        <div className="director__earth-glow" />
      </div>
      <div className="director__scan" aria-hidden="true" />
      <div className="director__vignette" aria-hidden="true" />

      {/* HUD bracket frame */}
      <div className="director__frame" aria-hidden="true">
        <span className="brk brk--tl" />
        <span className="brk brk--tr" />
        <span className="brk brk--bl" />
        <span className="brk brk--br" />
      </div>

      {/* Connector constellation — below the planet canvas (z 2) */}
      <div className="director__linelayer" aria-hidden="true">
        <svg
          className="director__lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <ellipse className="orbit" cx={HUB.x} cy={HUB.y} rx="34" ry="30"
            vectorEffect="non-scaling-stroke" />
          {SATELLITES.map((s) => (
            <line key={s.id} className="link" x1={HUB.x} y1={HUB.y} x2={s.x} y2={s.y}
              vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>

      {/* Node UI — above the planet canvas (z 4) */}
      <div className="director__stage">
        {DESTINATIONS.map((dest, i) => (
          <DirectorNode
            key={dest.id}
            destination={dest}
            index={i}
            onSelect={travelTo}
            gl={glOk}
            shellRef={shellRefs[dest.id]}
          />
        ))}
      </div>

      {/* The single global WebGL canvas + per-node Views (z 3) */}
      {glOk && ready && (
        <Suspense fallback={null}>
          <PlanetLayer refs={shellRefs} onContextLost={() => setGlOk(false)} />
        </Suspense>
      )}

      {/* Film grain over the whole frame */}
      <div className="director__grain" aria-hidden="true" />

      {/* Status readout bar */}
      <div className="director__status">
        <span className="director__status-l">
          <span className="blink">/</span>/ SELECT A DESTINATION
        </span>
        <span className="director__status-r">
          SYS · ONLINE&nbsp;&nbsp;|&nbsp;&nbsp;{clock}
        </span>
      </div>

      {/* Custom cursor reticle (pointer:fine only) */}
      <div className="reticle" ref={reticleRef} aria-hidden="true">
        <span className="reticle__ring" />
        <span className="reticle__dot" />
      </div>
    </section>
  )
}
