import { createContext, useContext, useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ============================================================
   TransitionContext
   ------------------------------------------------------------
   Orchestrates the "fly to destination" transition that masks
   a route change. The phases:

     idle      → nothing happening
     launching → overlay is covering the screen; THIS is the
                 window where your Destiny 2 orbit video plays.
     arriving  → overlay is uncovering to reveal the new page

   We navigate the router at the MIDPOINT of the launch (when the
   overlay fully covers the screen), so the user never sees the
   page swap underneath — the animation masks it completely.

   Tunables live in the two consts below.
   ============================================================ */

const TransitionContext = createContext(null)

// How long the overlay takes to fully cover the screen before we
// swap the route underneath. Match this to your masking video's
// "fully obscured" frame if you drop one in.
const COVER_MS = 900
// How long the overlay lingers (the "in orbit" beat) after the
// route has swapped, before it uncovers. Total visible transition
// ≈ COVER_MS + HOLD_MS + uncover.
const HOLD_MS = 350

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('idle')
  const [destination, setDestination] = useState(null)
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  /**
   * travelTo — kick off a masked transition to a destination object
   * (see data/destinations.js). Falls back to an instant navigate
   * if the user prefers reduced motion.
   */
  const travelTo = useCallback(
    (dest) => {
      if (!dest || phase !== 'idle') return

      const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      setDestination(dest)

      if (reduce) {
        navigate(dest.route)
        return
      }

      clearTimers()
      setPhase('launching')

      // Midpoint: overlay fully covers screen → swap route unseen.
      timers.current.push(
        setTimeout(() => {
          navigate(dest.route)
          setPhase('arriving')
        }, COVER_MS)
      )

      // End: uncover finished → reset.
      timers.current.push(
        setTimeout(() => {
          setPhase('idle')
          setDestination(null)
        }, COVER_MS + HOLD_MS + COVER_MS)
      )
    },
    [navigate, phase]
  )

  const value = { phase, destination, travelTo, COVER_MS, HOLD_MS }

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx)
    throw new Error('useTransition must be used within <TransitionProvider>')
  return ctx
}
