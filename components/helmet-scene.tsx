"use client"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Lightformer, Float, Sparkles, PerformanceMonitor, useGLTF } from "@react-three/drei"
import * as THREE from "three"

const URL = "/models/helmet.glb"
const HEAD_URL = "/models/me.glb"
const deg = (r: number) => String(Math.round((r * 180) / Math.PI)).padStart(3, " ")

// head placement inside the helmet (helmet frame)
const HEAD_POS: [number, number, number] = [0, 3.3, -0.87]
const HEAD_SCALE = 2.4
const RAY_INTERVAL = 1 / 20 // raycast rate (s)

/* ---------- liquid shader ---------- */
const GLSL_NOISE = /* glsl */ `
float hash13(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash13(i), hash13(i + vec3(1,0,0)), f.x), mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x), mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++){ s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s / 0.875; }
float fbm2(vec3 p){ return (0.6 * vnoise(p) + 0.4 * vnoise(p * 2.07 + 5.3)); }
vec3 liquidBump(vec3 p, float freq, float t, mat3 M, vec3 n){
  vec3 q = p * freq + vec3(t * 0.25, -t * 0.4, 0.0); float e = 0.06;
  float h0 = fbm2(q);
  vec3 g = vec3(fbm2(q + vec3(e,0,0)) - h0, fbm2(q + vec3(0,e,0)) - h0, fbm2(q + vec3(0,0,e)) - h0) / e;
  vec3 gv = M * g; gv -= n * dot(gv, n);
  return normalize(n - gv * 0.22);
}
`
const GLSL_DECL = /* glsl */ `
varying vec3 vP;
uniform float uReveal;
uniform float uTime;
uniform vec3 uOrigin;
uniform mat3 uLocalToView;
${GLSL_NOISE}
`

type Uniforms = Record<string, THREE.IUniform>

function patchLiquid(mat: THREE.MeshStandardMaterial, u: Uniforms, kind: "helmet" | "head") {
  const helmet = kind === "helmet"
  // main-scope setup: computes liqFilm / liqEdge / liqBand and (helmet) discards the face window
  const setup = helmet
    ? /* glsl */ `
float liqFilm = 0.0, liqEdge = 0.0, liqBand = 0.0;
if (uReveal > 0.001) {
  vec3 p = vP;
  float n = fbm(p * 2.1 + vec3(0.0, uTime * 0.2, 0.0));
  float dist = length(p - uOrigin) + (n - 0.5) * 0.7;
  float R = uReveal * 3.2;
  liqFilm = 1.0 - smoothstep(R - 0.04, R, dist);
  liqEdge = smoothstep(R - 0.3, R - 0.02, dist) * liqFilm;
  float wp = smoothstep(0.35, 0.95, uReveal);
  vec2 q = (p.xy - vec2(0.0, 3.62)) / vec2(0.56, 0.6);
  float streak = vnoise(vec3(p.x * 5.0, p.y * 0.7 - uTime * 0.1, p.z * 2.0));
  float wd = length(q) + (streak - 0.5) * 0.5;
  float open = wp * 1.0 - wd;
  float zmask = smoothstep(-0.7, -0.45, p.z);
  float covered = step(0.5, liqFilm);
  if (open > 0.0 && zmask > 0.5 && covered > 0.5) discard;
  liqBand = smoothstep(-0.12, 0.0, open) * (1.0 - step(0.0, open)) * zmask * covered;
}
`
    : /* glsl */ `
float liqFilm = 0.0, liqEdge = 0.0, liqBand = 0.0;
if (uReveal > 0.001) {
  float yn = clamp((vP.y + 0.06) / 0.48, 0.0, 1.0);
  float n2 = fbm(vP * 9.0 + vec3(0.0, -uTime * 0.3, 0.0));
  float t = mix(1.4, -0.3, smoothstep(0.5, 1.0, uReveal));
  liqFilm = 1.0 - smoothstep(t - 0.06, t + 0.06, yn + (n2 - 0.5) * 0.5);
  liqEdge = smoothstep(0.0, 0.25, liqFilm) * (1.0 - smoothstep(0.25, 0.9, liqFilm));
}
`
  const freq = helmet ? "3.0" : "5.0"

  mat.onBeforeCompile = (sh: { uniforms: any; vertexShader: string; fragmentShader: string }) => {
    Object.assign(sh.uniforms, u)
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vP;\n${helmet ? "uniform mat4 uMeshToHelmet;" : ""}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\nvP = ${helmet ? "(uMeshToHelmet * vec4(position, 1.0)).xyz" : "position"};`)
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\n${GLSL_DECL}`)
      .replace("#include <clipping_planes_fragment>", `#include <clipping_planes_fragment>\n${setup}`)
      .replace(
        "#include <map_fragment>",
        // fbm only evaluated while liquid is visible
        `#include <map_fragment>\nif (liqFilm > 0.001) diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.75, 0.09, 0.0), vec3(1.0, 0.27, 0.01), fbm(vP * 4.0 + uTime * 0.1)), liqFilm);`,
      )
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.22, liqFilm);`)
      .replace("#include <metalnessmap_fragment>", `#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 0.1, liqFilm);`)
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>\nif (liqFilm > 0.001) normal = normalize(mix(normal, liquidBump(vP, ${freq}, uTime, uLocalToView, nonPerturbedNormal), liqFilm));`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
totalEmissiveRadiance *= (1.0 - liqFilm * 0.85);
totalEmissiveRadiance += mix(vec3(1.0, 0.24, 0.02), vec3(1.0, 0.55, 0.16), liqEdge * liqEdge) * (liqFilm * 0.1 + liqEdge * 1.2 + liqBand * 3.5);`,
      )
  }
  mat.customProgramCacheKey = () => `liquid-${kind}`
  mat.needsUpdate = true
}

const _m4 = new THREE.Matrix4()
function rotOnly(out: THREE.Matrix3, camera: THREE.Camera, obj: THREE.Object3D) {
  _m4.multiplyMatrices(camera.matrixWorldInverse, obj.matrixWorld)
  const s = _m4.getMaxScaleOnAxis() || 1
  out.setFromMatrix4(_m4).multiplyScalar(1 / s)
}

function Head({ groupRef, uniforms }: { groupRef: React.RefObject<THREE.Group | null>; uniforms: Uniforms }) {
  const { scene } = useGLTF(HEAD_URL)
  const head = useMemo(() => {
    const m = scene.clone(true)
    m.traverse((o) => {
      o.updateMatrix()
      o.matrixAutoUpdate = false // static: skip per-frame local compose
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
      patchLiquid(mat, uniforms, "head")
      mesh.material = mat
    })
    return m
  }, [scene, uniforms])

  // free cloned materials on unmount
  useEffect(
    () => () => {
      head.traverse((o) => ((o as THREE.Mesh).isMesh && ((o as THREE.Mesh).material as THREE.Material).dispose()))
    },
    [head],
  )

  return (
    <group ref={groupRef} position={HEAD_POS} rotation={[0, -Math.PI / 2 - 0.16, 0]} scale={HEAD_SCALE}>
      <primitive object={head} />
    </group>
  )
}

function Helmet() {
  const { scene } = useGLTF(URL)
  const { viewport, gl } = useThree()
  const g = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ptr = useRef<{ x: number; y: number } | null>(null) // NDC, null = outside canvas
  const hover = useRef({ on: false, hold: 0 })
  const rayAcc = useRef(RAY_INTERVAL)
  const lastHit = useRef<THREE.Intersection | undefined>(undefined)
  const scr = useRef({ y: 0, h: 1 })
  const [showHead, setShowHead] = useState(false)
  const hud = useRef<{ yaw: HTMLElement | null; pit: HTMLElement | null; ys: string; ps: string }>({ yaw: null, pit: null, ys: "", ps: "" })

  // built once per scene: no rebuild on resize
  const { model, size, c, helmetU, headU } = useMemo(() => {
    const m = scene.clone(true)
    m.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(m)
    const size = box.getSize(new THREE.Vector3())
    const c = box.getCenter(new THREE.Vector3())

    const shared = { uReveal: { value: 0 }, uTime: { value: 0 } }
    const helmetU: Uniforms = { ...shared, uOrigin: { value: new THREE.Vector3(0, 3.5, 0) }, uLocalToView: { value: new THREE.Matrix3() }, uMeshToHelmet: { value: new THREE.Matrix4() } }
    const headU: Uniforms = { ...shared, uOrigin: { value: new THREE.Vector3() }, uLocalToView: { value: new THREE.Matrix3() } }

    m.traverse((o) => {
      o.matrixAutoUpdate = false // static: skip per-frame local compose
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
      mesh.material = mat
      // per-mesh transform into the helmet frame (root is identity here)
      const u: Uniforms = { ...helmetU, uMeshToHelmet: { value: mesh.matrixWorld.clone() } }
      patchLiquid(mat, u, "helmet")
    })
    return { model: m, size, c, helmetU, headU }
  }, [scene])

  // cheap: only scale/offset depend on viewport
  const { s, off } = useMemo(() => {
    const s = Math.min(2.25, viewport.width * 0.75) / Math.max(size.x, size.y, size.z)
    return { s, off: [-c.x * s, -c.y * s, -c.z * s] as [number, number, number] }
  }, [viewport.width, size, c])

  useEffect(
    () => () => {
      model.traverse((o) => ((o as THREE.Mesh).isMesh && ((o as THREE.Mesh).material as THREE.Material).dispose()))
    },
    [model],
  )

  // scroll/size cached: no layout reads in frame loop
  useEffect(() => {
    const sc = () => (scr.current.y = scrollY)
    const rs = () => (scr.current.h = innerHeight || 1)
    sc()
    rs()
    addEventListener("scroll", sc, { passive: true })
    addEventListener("resize", rs, { passive: true })
    return () => {
      removeEventListener("scroll", sc)
      removeEventListener("resize", rs)
    }
  }, [])

  // defer head model load until idle: faster first paint
  useEffect(() => {
    const id: number =
      "requestIdleCallback" in window
        ? requestIdleCallback(() => setShowHead(true), { timeout: 1500 })
        : window.setTimeout(() => setShowHead(true), 400)
    return () => ("cancelIdleCallback" in window ? cancelIdleCallback(id) : clearTimeout(id))
  }, [])

  const ray = useMemo(() => new THREE.Raycaster(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    let clear: ReturnType<typeof setTimeout> | undefined
    // rect read only on pointer events, not per frame
    const f = (e: PointerEvent) => {
      mouse.current = { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1 }
      const r = gl.domElement.getBoundingClientRect()
      ptr.current =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
          ? { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 }
          : null
    }
    const down = (e: PointerEvent) => {
      f(e)
      if (e.pointerType === "touch") {
        clearTimeout(clear)
        clear = setTimeout(() => (ptr.current = null), 2200)
      }
    }
    const out = () => (ptr.current = null)
    addEventListener("pointermove", f, { passive: true })
    addEventListener("pointerdown", down, { passive: true })
    addEventListener("blur", out)
    document.documentElement.addEventListener("pointerleave", out)
    return () => {
      removeEventListener("pointermove", f)
      removeEventListener("pointerdown", down)
      removeEventListener("blur", out)
      document.documentElement.removeEventListener("pointerleave", out)
      clearTimeout(clear)
    }
  }, [gl])

  useFrame((st, dt) => {
    if (!g.current) return
    const t = st.clock.elapsedTime, sc = Math.min(scr.current.y / scr.current.h, 1.5)
    const ty = mouse.current.x * 0.75 + sc * Math.PI + Math.sin(t * 0.5) * 0.08
    const tx = mouse.current.y * 0.3
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, ty, 0.06)
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, tx, 0.06)
    g.current.position.y = -sc * 1.2

    // HUD: cached nodes, write only on change
    const H = hud.current
    if (!H.yaw) H.yaw = document.getElementById("hud-yaw")
    if (!H.pit) H.pit = document.getElementById("hud-pitch")
    const ys = deg(g.current.rotation.y), ps = deg(g.current.rotation.x)
    if (H.yaw && ys !== H.ys) (H.yaw.textContent = ys), (H.ys = ys)
    if (H.pit && ps !== H.ps) (H.pit.textContent = ps), (H.ps = ps)

    /* ---- hover -> liquid reveal ---- */
    const head = headRef.current
    const p = ptr.current
    if (!p) {
      lastHit.current = undefined
      rayAcc.current = RAY_INTERVAL
    } else {
      rayAcc.current += dt
      if (rayAcc.current >= RAY_INTERVAL) {
        rayAcc.current = 0
        g.current.updateMatrixWorld(true)
        ndc.set(p.x, p.y)
        ray.setFromCamera(ndc, st.camera)
        lastHit.current = ray.intersectObjects(head && head.visible ? [model, head] : [model], true)[0]
      }
    }
    const hit = lastHit.current
    const h = hover.current
    const U = helmetU
    if (hit) {
      h.hold = 0.18
      h.on = true
      if (U.uReveal.value < 0.03 && !head?.getObjectById(hit.object.id)) U.uOrigin.value.copy(model.worldToLocal(tmp.copy(hit.point)))
    } else if (h.on) {
      h.hold -= dt
      if (h.hold <= 0) h.on = false
    }
    const target = h.on ? 1 : 0
    let v = THREE.MathUtils.damp(U.uReveal.value, target, h.on ? 2.1 : 3.2, dt)
    if (target === 1 && v > 0.995) v = 1
    if (target === 0 && v < 0.004) v = 0
    U.uReveal.value = v
    U.uTime.value = t
    if (head) {
      head.visible = v > 0.28
      if (head.visible) rotOnly(headU.uLocalToView.value, st.camera, head)
    }
    if (v > 0) rotOnly(U.uLocalToView.value, st.camera, model) // uses last frame's matrices
  })

  return (
    <group ref={g}>
      <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.5}>
        <group scale={s} position={off}>
          <primitive object={model} />
          {showHead && (
            <Suspense fallback={null}>
              <Head groupRef={headRef} uniforms={headU} />
            </Suspense>
          )}
        </group>
      </Float>
    </group>
  )
}

export default function HelmetScene() {
  const [maxDpr, setMaxDpr] = useState(1.5)
  const [low, setLow] = useState(false)
  return (
    <Canvas
  className="!pointer-events-none absolute inset-0 h-full w-full"
      camera={{ position: [0, 0, 5.2], fov: 35 }}
      dpr={[1, maxDpr]}
      gl={{ alpha: true, antialias: true, stencil: false, powerPreference: "high-performance" }}
    >
      {/* adaptive resolution: drop dpr when fps sags, restore when stable */}
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setMaxDpr(1)}
        onIncline={() => setMaxDpr(1.5)}
        onFallback={() => (setMaxDpr(1), setLow(true))}
      />
      <Suspense fallback={null}>
        {/* frames={1}: bake env once, not every frame */}
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={5} position={[0, 4, 4]} scale={[9, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={9} position={[-5, 0, -2]} scale={[2, 7, 1]} color="#ff4d00" />
          <Lightformer form="rect" intensity={4} position={[5, 1, 2]} scale={[2, 6, 1]} color="#8fc0ff" />
          <Lightformer form="rect" intensity={2} position={[0, -4, 3]} scale={[8, 2, 1]} color="#ffffff" />
        </Environment>
        <Helmet />
        <Sparkles count={low ? 35 : 70} scale={[8, 4.5, 3]} size={2.4} speed={0.35} color="#ff4d00" />
      </Suspense>
    </Canvas>
  )
}
useGLTF.preload(URL)