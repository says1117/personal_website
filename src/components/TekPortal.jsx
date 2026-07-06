import { useEffect, useRef } from 'react'
import { useTransition } from '../context/TransitionContext'
import { DESTINATIONS } from '../data/destinations'
import './TekPortal.css'

/* ============================================================
   TekPortal — the Tek Teleporter's destination screen, in the
   spirit of ARK's tek UI (original build, no game art): dark
   translucent panel with clipped corners, scanlines, tracked
   uppercase type, and hex-ringed destination tiles.

   The destinations ARE the site's sections (data/destinations.js)
   and the icons are the WebGL planets' textures — teleporting
   off the island drops you back into the Destiny star system.
   Clicking a tile hands off to travelTo(), which runs the
   existing masked route transition (the "teleport" effect).

   A11y: role=dialog, focus moves in on open and the opener
   regains focus on close (browser default via button), Escape
   closes, body scroll locked while open, close ✕ top-left.
   ============================================================ */

export default function TekPortal({ onClose }) {
  const { travelTo } = useTransition()
  const panelRef = useRef(null)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="tek-portal"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="tek-portal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Tek Teleporter — select destination"
        tabIndex={-1}
        ref={panelRef}
      >
        <button
          type="button"
          className="tek-portal__close"
          onClick={onClose}
          aria-label="Close teleporter"
        >
          ✕
        </button>

        <p className="tek-portal__eyebrow">TEK TELEPORTER · ONLINE</p>
        <h2 className="tek-portal__title">Select destination</h2>

        <div className="tek-portal__grid">
          {DESTINATIONS.filter((d) => d.id !== 'experience').map((d) => (
            <button
              type="button"
              key={d.id}
              className="tek-portal__dest"
              onClick={() => travelTo(d)}
            >
              <span
                className="tek-portal__icon"
                style={{ backgroundImage: `url(${d.texture})` }}
                aria-hidden="true"
              />
              <span className="tek-portal__code">{d.code}</span>
              <span className="tek-portal__name">{d.section}</span>
            </button>
          ))}
        </div>

        <p className="tek-portal__hint">
          <span className="blink">/</span>/ TRANSMISSION STABLE — CHOOSE WISELY
        </p>
      </div>
    </div>
  )
}
