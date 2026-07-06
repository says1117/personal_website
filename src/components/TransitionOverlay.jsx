import { AnimatePresence, motion } from 'framer-motion'
import { useTransition } from '../context/TransitionContext'
import './TransitionOverlay.css'

/* ============================================================
   TransitionOverlay
   ------------------------------------------------------------
   Full-screen layer that covers the viewport while the route
   swaps underneath. Visible whenever phase !== 'idle'.

   The default look is a sharp wipe + a small "traveling to X"
   readout. Replace the marked block below with your custom
   Destiny 2 orbit video and everything else keeps working.
   ============================================================ */

export default function TransitionOverlay() {
  const { phase, destination } = useTransition()
  const active = phase !== 'idle'

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="transition-overlay"
          // Cover from bottom → settle → uncover upward.
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ====================================================
              ▼▼▼  CUSTOM DESTINY 2 ORBIT ANIMATION GOES HERE  ▼▼▼

              Drop your video/animation in to mask the route swap.
              It should fill the layer and ideally hit its "fully
              obscured" frame around COVER_MS (see TransitionContext).

              Example — swap the placeholder <div> below for:

                <video
                  className="transition-overlay__video"
                  src={`/transitions/${destination?.id ?? 'default'}.webm`}
                  autoPlay
                  muted
                  playsInline
                  // poster keeps frame 1 painted before decode
                  poster="/transitions/poster.jpg"
                />

              Per-destination clips: name files by destination.id
              (dashboard.webm, about.webm, …) and the line above
              picks the right one automatically.
              ==================================================== */}

          <div className="transition-overlay__placeholder">
            <div className="transition-overlay__grid" aria-hidden="true" />

            <div className="transition-overlay__readout">
              <span className="eyebrow">Transmat in progress</span>
              <span className="transition-overlay__dest">
                {destination?.label ?? '—'}
              </span>
              <span className="transition-overlay__sub">
                {destination?.section}
              </span>
            </div>
          </div>

          {/* ▲▲▲  END custom animation slot  ▲▲▲ */}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
