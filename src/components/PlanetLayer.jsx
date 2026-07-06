import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { DESTINATIONS } from '../data/destinations'
import PlanetScene from './PlanetGL'

/* ============================================================
   PlanetLayer — the single global WebGL surface.

   ONE fixed, fullscreen, pointer-events:none <Canvas> renders
   every planet via drei <View> scissor rects. Each View tracks
   a node's .planet-shell div (refs created in Director.jsx), so
   the node's centering, parallax, hover-scale and bob keep
   driving where the planet draws — the View re-measures the
   tracked rect every frame.

   Lazy-loaded (React.lazy in Director) so three.js stays out of
   the initial bundle. Per-view Suspense keeps one slow texture
   from blanking the other planets. A lost WebGL context flips
   Director back to the SVG fallback via onContextLost.

   NOTE: the canvas must NOT sit inside a CSS-transformed
   ancestor — scissor math assumes canvas space == page space.
   (.director's blur filter is fine; transforms are not.)
   ============================================================ */

export default function PlanetLayer({ refs, onContextLost }) {
  return (
    <Canvas
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3, // above bg layers + line layer (2), below the node UI (4)
        pointerEvents: 'none',
      }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onContextLost?.()
        })
      }}
    >
      {/* IMPORTANT: Views must be INSIDE the Canvas for the `track`
         prop to be honored. Outside the Canvas, drei's View routes to
         HtmlView, which DISCARDS `track` and tracks its own empty div
         (zero-size scissor → planets render into nothing). Inside,
         it routes to CanvasView, which scissors to the tracked rect. */}
      {DESTINATIONS.map((d) => (
        <View key={d.id} track={refs[d.id]}>
          <Suspense fallback={null}>
            <PlanetScene {...d} />
          </Suspense>
        </View>
      ))}
    </Canvas>
  )
}
