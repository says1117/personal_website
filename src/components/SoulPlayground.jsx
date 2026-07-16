import { useEffect, useRef } from 'react'

/* ============================================================
   SoulPlayground — the toy layer: a cracked green SOUL ORB you
   can bat and throw, and CALICO the lilac sphynx cat who plays
   with it — and bolts when your cursor gets too close.

   Physics + AI run in one rAF with direct-DOM transforms (the
   established pattern). The layer is fixed, pointer-events:
   none; only the orb itself is grabbable.

   Cat brain:
   · cursor within FLEE_R → flee (fast, ears back)
   · otherwise → trot toward the orb; on contact, kick it
   · orb slow + far cursor → idle (tail sway only)

   Scoring hooks back into the page's Souls counter:
   +2 cursor bat (cooldown), +5 cat kick, +8 throw.
   Mounted only for fine pointers with motion allowed.
   ============================================================ */

const FLEE_R = 190
const BALL_R = 26

/* ballImg / catImg: optional exact-image skins (from
   /public/oldgods/ — see About.jsx). Physics and the cat brain
   are identical either way; only the visuals swap. */
export default function SoulPlayground({ onScore, ballImg = null, catImg = null }) {
  const ballRef = useRef(null)
  const catRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ball = ballRef.current
    const cat = catRef.current
    if (!fine || reduce || !ball || !cat) return

    const W = () => window.innerWidth
    const H = () => window.innerHeight
    const GROUND = () => H() - 26

    const B = { x: W() * 0.62, y: H() * 0.3, vx: -60, vy: 0, roll: 0 }
    const C = { x: W() * 0.25, vx: 0, dir: 1, mode: 'idle' }
    const cur = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0 }

    let dragging = false
    let last = performance.now()
    let lastBat = 0
    let lastKick = 0
    let raf = 0

    const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by)
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

    const onMove = (e) => { cur.x = e.clientX; cur.y = e.clientY }
    const onDown = (e) => {
      if (dist(e.clientX, e.clientY, B.x, B.y) < BALL_R + 16) {
        dragging = true
        ball.classList.add('is-held')
      }
    }
    const onUp = () => {
      if (!dragging) return
      dragging = false
      ball.classList.remove('is-held')
      /* throw with the cursor's velocity */
      B.vx = clamp(cur.vx, -1400, 1400)
      B.vy = clamp(cur.vy, -1400, 1400)
      onScore?.(8)
    }

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.033)
      last = now

      /* cursor velocity (smoothed) */
      if (cur.px > -9000 && dt > 0) {
        cur.vx = cur.vx * 0.6 + ((cur.x - cur.px) / dt) * 0.4
        cur.vy = cur.vy * 0.6 + ((cur.y - cur.py) / dt) * 0.4
      }
      cur.px = cur.x
      cur.py = cur.y

      /* ---------------- orb physics ---------------- */
      if (dragging) {
        B.x = cur.x
        B.y = cur.y
        B.vx = cur.vx
        B.vy = cur.vy
      } else {
        B.vy += 1650 * dt
        B.vx *= 0.999
        B.x += B.vx * dt
        B.y += B.vy * dt

        if (B.x < BALL_R) { B.x = BALL_R; B.vx = Math.abs(B.vx) * 0.75 }
        if (B.x > W() - BALL_R) { B.x = W() - BALL_R; B.vx = -Math.abs(B.vx) * 0.75 }
        if (B.y < BALL_R + 70) { B.y = BALL_R + 70; B.vy = Math.abs(B.vy) * 0.7 }
        if (B.y > GROUND() - BALL_R) {
          B.y = GROUND() - BALL_R
          B.vy = -Math.abs(B.vy) * 0.66
          B.vx *= 0.94
          if (Math.abs(B.vy) < 50) B.vy = 0
        }

        /* cursor bat */
        const d = dist(cur.x, cur.y, B.x, B.y)
        if (d < BALL_R + 24 && now - lastBat > 260) {
          lastBat = now
          const n = Math.max(d, 1)
          B.vx += ((B.x - cur.x) / n) * 430 + cur.vx * 0.45
          B.vy += ((B.y - cur.y) / n) * 430 + cur.vy * 0.45 - 110
          onScore?.(2)
        }
      }
      B.roll += (B.vx * dt) / (BALL_R * 0.0174) * 0.02

      /* ---------------- Calico brain ---------------- */
      const catY = GROUND() - 30
      const dCur = dist(cur.x, cur.y, C.x, catY)
      let targetX
      let maxSpeed
      if (dCur < FLEE_R) {
        C.mode = 'flee'
        targetX = C.x + (C.x >= cur.x ? 1 : -1) * 500
        maxSpeed = 660
      } else if (Math.abs(B.x - C.x) > 30 || Math.abs(B.vx) > 60) {
        C.mode = 'chase'
        targetX = B.x
        maxSpeed = 380
      } else {
        C.mode = 'idle'
        targetX = C.x
        maxSpeed = 0
      }

      const dx = targetX - C.x
      if (Math.abs(dx) > 8 && maxSpeed > 0) {
        C.vx += Math.sign(dx) * 1500 * dt
        C.vx = clamp(C.vx, -maxSpeed, maxSpeed)
      } else {
        C.vx *= 0.82
      }
      C.x = clamp(C.x + C.vx * dt, 34, W() - 34)
      if (C.vx > 14) C.dir = 1
      else if (C.vx < -14) C.dir = -1

      /* cat kicks the orb */
      if (!dragging && now - lastKick > 650) {
        if (dist(C.x, catY, B.x, B.y) < BALL_R + 40) {
          lastKick = now
          B.vx = C.dir * (430 + Math.random() * 330)
          B.vy = -(360 + Math.random() * 300)
          onScore?.(5)
        }
      }

      /* ---------------- paint ---------------- */
      ball.style.transform =
        `translate3d(${(B.x - BALL_R).toFixed(1)}px, ${(B.y - BALL_R).toFixed(1)}px, 0) ` +
        `rotate(${B.roll.toFixed(1)}deg)`
      cat.style.transform =
        `translate3d(${(C.x - 46).toFixed(1)}px, ${(GROUND() - 62).toFixed(1)}px, 0) scaleX(${C.dir})`
      cat.classList.toggle('is-running', Math.abs(C.vx) > 55)
      cat.classList.toggle('is-fleeing', C.mode === 'flee')

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    ball.addEventListener('pointerdown', onDown)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      ball.removeEventListener('pointerdown', onDown)
    }
  }, [onScore])

  return (
    <div className="playground" aria-hidden="true">
      {/* THE SOUL ORB — cracked green sphere, gilt ring */}
      <div
        className={`playground__ball${ballImg ? ' playground__ball--img' : ''}`}
        ref={ballRef}
        title="the soul"
      >
        {ballImg ? (
          <img src={ballImg} alt="" draggable="false" />
        ) : (
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="27" fill="none" stroke="#ffd94a" strokeWidth="3.5" />
          <defs>
            <radialGradient id="soul-g" cx="0.38" cy="0.34" r="0.8">
              <stop offset="0%" stopColor="#7fe3a8" />
              <stop offset="45%" stopColor="#2fae72" />
              <stop offset="100%" stopColor="#0d6b45" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="24" fill="url(#soul-g)" />
          {/* cracks */}
          <g stroke="#0a4a30" strokeWidth="1.8" fill="none" strokeLinecap="round">
            <path d="M30 12 L34 24 L26 32 L34 42 L28 52" />
            <path d="M34 24 L46 20 M34 24 L44 32 M26 32 L14 28 M34 42 L46 46 M34 42 L44 36 M26 32 L16 42" />
          </g>
          <ellipse cx="24" cy="20" rx="6" ry="3.6" fill="#c8f4d9" opacity="0.75" transform="rotate(-24 24 20)" />
        </svg>
        )}
      </div>

      {/* CALICO — the lilac sphynx */}
      <div
        className={`playground__cat${catImg ? ' playground__cat--img' : ''}`}
        ref={catRef}
      >
        {catImg ? (
          <img src={catImg} alt="" draggable="false" />
        ) : (
        <svg viewBox="0 0 140 96">
          {/* tail */}
          <path className="cat__tail" d="M18 62 C2 54 0 34 12 24" fill="none" stroke="#d9bff0" strokeWidth="9" strokeLinecap="round" />
          {/* back legs */}
          <g className="cat__legs-b">
            <path d="M34 66 L30 90 L38 90 L42 68 Z" fill="#cbaee6" />
            <path d="M48 68 L46 90 L54 90 L56 70 Z" fill="#d9bff0" />
          </g>
          {/* front legs */}
          <g className="cat__legs-f">
            <path d="M84 68 L82 90 L90 90 L92 70 Z" fill="#cbaee6" />
            <path d="M98 66 L98 90 L106 90 L106 68 Z" fill="#d9bff0" />
          </g>
          {/* body — slim, chest high */}
          <path
            d="M22 60 C30 44 56 40 82 44 C102 46 112 52 116 60 C118 68 108 74 92 74 L44 74 C30 74 18 70 22 60 Z"
            fill="#d9bff0"
          />
          {/* head + big sphynx ears */}
          <g className="cat__head">
            <path d="M104 26 L112 2 L124 22 Z" fill="#d9bff0" />
            <path d="M107 24 L112 9 L119 21 Z" fill="#b48cd9" />
            <path d="M126 30 L142 12 L142 34 Z" fill="#d9bff0" />
            <path d="M128 28 L138 17 L138 31 Z" fill="#b48cd9" />
            <path d="M100 30 C104 20 124 18 132 28 C140 38 134 52 120 54 C106 56 96 44 100 30 Z" fill="#e2ccf5" />
            {/* eyes */}
            <ellipse className="cat__eye" cx="115" cy="36" rx="4.6" ry="5.4" fill="#f4eeda" />
            <circle cx="116" cy="37" r="1.9" fill="#3d2c52" />
            <ellipse className="cat__eye" cx="129" cy="37" rx="4" ry="5" fill="#f4eeda" />
            <circle cx="130" cy="38" r="1.8" fill="#3d2c52" />
            {/* muzzle */}
            <path d="M132 44 L138 47 L132 50" fill="none" stroke="#9a77c4" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </svg>
        )}
      </div>
    </div>
  )
}
