import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, useTexture } from '@react-three/drei'
import * as THREE from 'three'

/* ============================================================
   PlanetScene — the 3D contents of ONE drei <View> (the single
   global Canvas and the tracked Views live in PlanetLayer.jsx).

   Destiny-fidelity art direction, all on the planet surface
   itself (no additive shell):

   · MeshPhysicalMaterial + NASA-derived texture (CC BY 4.0)
   · one strong directional key light per view
   · onBeforeCompile patch injects, at emissivemap_fragment
     (after the final view-space `normal` is defined, before
     the lighting chunks run):
       1. terminator cheat — diffuse is multiplied by a narrow
          smoothstep of sunDot, hardening the day/night line
          without touching three's lighting chunks
       2. sun-biased Fresnel rim — pow(1 - dot(V, N), power)
          added to totalEmissiveRadiance, faded on the night
          limb so the atmosphere hugs the lit edge
   · customProgramCacheKey shares one compiled program across
     all four planets (uniform VALUES stay per-material)
   ============================================================ */

const RIM_GLSL = /* glsl */ `
#include <emissivemap_fragment>
{
  vec3 V = normalize( vViewPosition );                       // fragment → camera (view space)
  vec3 sunVS = normalize( ( viewMatrix * vec4( uSunDir, 0.0 ) ).xyz );
  float sunDot = dot( normal, sunVS );

  // 1. Hard terminator: narrow smoothstep band, lifted night floor
  float dayMask = smoothstep( -0.06, 0.22, sunDot );
  diffuseColor.rgb *= mix( 0.3, 1.0, dayMask );

  // 2. Fresnel atmosphere rim, biased to the sunlit limb
  float fres = pow( 1.0 - saturate( dot( V, normal ) ), uRimPower );
  float dayside = mix( 0.18, 1.0, saturate( sunDot ) );
  totalEmissiveRadiance += uRimColor * fres * uRimStrength * dayside;
}
`

export default function PlanetScene({
  texture,
  atmosphere = '#bfe4ff',
  tint = '#ffffff',
  emissive = '#1a1208',
  sun = [3.2, 1.6, 2.2],
  spin = 0.06,
  rimPower = 3.0,
  rimStrength = 1.3,
}) {
  const group = useRef()
  const map = useTexture(texture)
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 8

  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      map,
      color: new THREE.Color(tint),
      emissive: new THREE.Color(emissive),
      emissiveMap: map,
      emissiveIntensity: 0.16,
      roughness: 1,
      metalness: 0,
    })

    const sunDir = new THREE.Vector3(...sun).normalize()

    m.onBeforeCompile = (shader) => {
      shader.uniforms.uRimColor = { value: new THREE.Color(atmosphere) }
      shader.uniforms.uRimPower = { value: rimPower }
      shader.uniforms.uRimStrength = { value: rimStrength }
      shader.uniforms.uSunDir = { value: sunDir }

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
uniform vec3 uRimColor;
uniform float uRimPower;
uniform float uRimStrength;
uniform vec3 uSunDir;`
        )
        .replace('#include <emissivemap_fragment>', RIM_GLSL)

      m.userData.shader = shader
    }
    // Same injected source everywhere → share one compiled program.
    m.customProgramCacheKey = () => 'planet-rim-v1'
    return m
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, tint, emissive, atmosphere, rimPower, rimStrength])

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * spin
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.6]} fov={30} />
      {/* faint warm ambient — Traveler-light fill on the dark side */}
      <ambientLight intensity={0.14} color="#ffe9c8" />
      {/* the single dramatic key light → the terminator */}
      <directionalLight position={sun} intensity={2.9} color="#fff4e2" />

      <group ref={group}>
        <mesh material={material}>
          <sphereGeometry args={[1, 64, 64]} />
        </mesh>
      </group>
    </>
  )
}
