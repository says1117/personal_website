import { useEffect, useState } from 'react'
import './GlitchHeadline.css'

/* ============================================================
   GlitchHeadline
   ------------------------------------------------------------
   Cycles through phrases on an interval. On every swap it adds
   a `.is-glitching` class for ~450ms which runs a pure-CSS
   RGB-channel-split + clip-slice glitch (see the .css file).

   - Pure CSS effect = cheap & sharp, no JS animation loop.
   - data-text mirrors the text so the ::before/::after layers
     can render the duplicated, offset copies.
   - Honors prefers-reduced-motion (just swaps, no glitch).
   ============================================================ */

const DEFAULT_PHRASES = [
  'Software Engineer',
  'Builder of NextPlay',
  'ML × Accessibility',
  'Frontend Architect',
  'Currently shipping ASL-to-TTS',
]

export default function GlitchHeadline({
  phrases = DEFAULT_PHRASES,
  interval = 3200, // ms each phrase is shown
}) {
  const [index, setIndex] = useState(0)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    if (phrases.length <= 1) return

    const id = setInterval(() => {
      // Fire the glitch, advance text mid-glitch, then clear class.
      setGlitching(true)
      const swap = setTimeout(
        () => setIndex((i) => (i + 1) % phrases.length),
        180
      )
      const settle = setTimeout(() => setGlitching(false), 450)
      // Clean up the inner timers if interval fires again fast.
      return () => {
        clearTimeout(swap)
        clearTimeout(settle)
      }
    }, interval)

    return () => clearInterval(id)
  }, [phrases, interval])

  const text = phrases[index]

  return (
    <span
      className={`glitch${glitching ? ' is-glitching' : ''}`}
      data-text={text}
      // Announce changes politely for screen readers.
      aria-live="polite"
    >
      {text}
    </span>
  )
}
