import PlanetArt from './PlanetArt'

/* ============================================================
   DirectorNode — one selectable destination: a planet with a
   Destiny-style selection reticle that ignites on hover/focus,
   plus a label block.

   Planet art paths:
   · gl=true  → renders an empty .planet-shell span; the global
     PlanetLayer <View> tracks it and draws the WebGL planet in
     that rect (see PlanetLayer.jsx). shellRef comes from
     Director so the View and this DOM node share the ref.
   · gl=false → static SVG planet (PlanetArt) — no-WebGL,
     reduced-motion, and context-loss fallback.

   Everything else — centering, parallax (--depth + inherited
   --mx/--my), hover-scale, reticle — is CSS and identical in
   both paths. Plain <button> → keyboard + SR accessible.
   ============================================================ */

export default function DirectorNode({ destination, onSelect, index, gl, shellRef }) {
  const { id, section, code, blurb, x, y, primary, planet, size, depth } =
    destination

  return (
    <button
      type="button"
      className={`node${primary ? ' node--hub' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        '--mark': `${size}px`,
        '--depth': depth,
        '--in-delay': `${0.4 + index * 0.14}s`,
      }}
      onClick={() => onSelect(destination)}
      aria-label={`Travel to ${section}`}
    >
      <span className="node__mark" aria-hidden="true">
        {gl ? (
          <span className="planet-shell" ref={shellRef} />
        ) : (
          <span className={`planet-art planet-art--${planet}`}>
            <PlanetArt type={planet} uid={id} />
          </span>
        )}

        <span className="node__reticle" />
        <span className="node__ticks" />
      </span>

      <span className="node__label">
        <span className="node__code">{code}</span>
        <span className="node__name">{section}</span>
        <span className="node__blurb">{blurb}</span>
      </span>
    </button>
  )
}
