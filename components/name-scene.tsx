"use client"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Center, Text3D } from "@react-three/drei"
import { Physics, RigidBody, CuboidCollider, type RapierRigidBody } from "@react-three/rapier"
import * as THREE from "three"

const FONT = "/fonts/helvetiker_bold.typeface.json"
const NAME = "OMAR ALIBI".split("")
const KINDS = ["duck", "donut", "pizza", "mug", "ball"] as const
type Kind = (typeof KINDS)[number]

function Item({ kind, u }: { kind: Kind; u: number }) {
  const s = u * 0.55
  const m = (c: string, r = 0.5) => <meshStandardMaterial color={c} roughness={r} />
  return (
    <group scale={s}>
      {kind === "duck" && (<>
        <mesh><sphereGeometry args={[0.6, 24, 24]} />{m("#ffd21f", 0.4)}</mesh>
        <mesh position={[0.35, 0.55, 0]}><sphereGeometry args={[0.36, 24, 24]} />{m("#ffd21f", 0.4)}</mesh>
        <mesh position={[0.74, 0.52, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.13, 0.32, 16]} />{m("#ff7a1a")}</mesh>
        <mesh position={[0.5, 0.68, 0.22]}><sphereGeometry args={[0.06, 12, 12]} />{m("#111")}</mesh>
        <mesh position={[0.5, 0.68, -0.22]}><sphereGeometry args={[0.06, 12, 12]} />{m("#111")}</mesh>
      </>)}
      {kind === "donut" && (<>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}><torusGeometry args={[0.5, 0.26, 20, 40]} />{m("#e9a86b", 0.7)}</mesh>
        <mesh rotation={[Math.PI / 2.4, 0, 0]} position={[0, 0.05, 0.06]}><torusGeometry args={[0.5, 0.27, 20, 40]} />{m("#ff5fa2", 0.3)}</mesh>
      </>)}
      {kind === "pizza" && (<>
        <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.55, 1.3, 3]} />{m("#f2b544", 0.6)}</mesh>
        <mesh position={[0, 0.2, 0.28]}><sphereGeometry args={[0.13, 12, 12]} />{m("#d63b2f")}</mesh>
        <mesh position={[0.1, -0.2, 0.3]}><sphereGeometry args={[0.11, 12, 12]} />{m("#d63b2f")}</mesh>
      </>)}
      {kind === "mug" && (<>
        <mesh><cylinderGeometry args={[0.45, 0.4, 0.75, 28]} />{m("#f4f1ea", 0.3)}</mesh>
        <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.38, 28]} />{m("#4a2a17", 0.2)}</mesh>
        <mesh position={[0.5, 0, 0]}><torusGeometry args={[0.2, 0.06, 12, 24]} />{m("#f4f1ea", 0.3)}</mesh>
      </>)}
      {kind === "ball" && (<>
        <mesh><sphereGeometry args={[0.5, 24, 24]} />{m("#ff4d00", 0.25)}</mesh>
        <mesh position={[0.18, 0.12, 0.44]}><sphereGeometry args={[0.13, 16, 16]} />{m("#fff")}</mesh>
        <mesh position={[-0.18, 0.12, 0.44]}><sphereGeometry args={[0.13, 16, 16]} />{m("#fff")}</mesh>
        <mesh position={[0.2, 0.12, 0.55]}><sphereGeometry args={[0.055, 12, 12]} />{m("#111")}</mesh>
        <mesh position={[-0.16, 0.1, 0.55]}><sphereGeometry args={[0.055, 12, 12]} />{m("#111")}</mesh>
      </>)}
    </group>
  )
}

function Pointer({ u }: { u: number }) {
  const body = useRef<RapierRigidBody>(null)
  const { pointer, viewport } = useThree()
  useFrame(() => {
    body.current?.setNextKinematicTranslation({ x: (pointer.x * viewport.width) / 2, y: (pointer.y * viewport.height) / 2, z: 0 })
  })
  return (
    <RigidBody ref={body} type="kinematicPosition" colliders="ball">
      <mesh visible={false}><sphereGeometry args={[u * 0.7, 12, 12]} /></mesh>
    </RigidBody>
  )
}

function World() {
  const { viewport } = useThree()
  const u = viewport.width / 11.5
  const W = viewport.width, H = viewport.height
  const [items, setItems] = useState<{ id: number; kind: Kind; x: number }[]>([])
  const id = useRef(0)
  const spawn = (x?: number) =>
    setItems((a) => [...a.slice(-24), { id: id.current++, kind: KINDS[id.current % KINDS.length], x: x ?? (Math.random() - 0.5) * W * 0.8 }])

  useEffect(() => {
    const t = [900, 1500, 2100, 2700, 3300].map((d) => setTimeout(() => spawn(), d))
    return () => t.forEach(clearTimeout)
  }, [])

  const cell = u * 1.0
  const letters = useMemo(() => NAME.map((ch, i) => ({ ch, x: (i - (NAME.length - 1) / 2) * cell })), [cell])

  return (
    <Physics gravity={[0, -14, 0]}>
      <CuboidCollider args={[W, 0.5, 2]} position={[0, -H / 2 - 0.5 + u * 0.05, 0]} />
      <CuboidCollider args={[0.5, H * 3, 2]} position={[-W / 2 - 0.5, 0, 0]} />
      <CuboidCollider args={[0.5, H * 3, 2]} position={[W / 2 + 0.5, 0, 0]} />
      <CuboidCollider args={[W, H * 3, 0.5]} position={[0, 0, -1.2]} />
      <CuboidCollider args={[W, H * 3, 0.5]} position={[0, 0, 1.2]} />
      <Pointer u={u} />
      {letters.map(({ ch, x }, i) =>
        ch === " " ? null : (
          <RigidBody key={i} position={[x, H / 2 + u * (1 + i * 0.35), 0]} rotation={[0, 0, (Math.random() - 0.5) * 0.6]}
            colliders={false} restitution={0.35} friction={0.7} linearDamping={0.15} angularDamping={0.4}>
            <CuboidCollider args={[u * 0.36, u * 0.5, u * 0.22]} />
            <Center>
              <Text3D font={FONT} size={u * 0.95} height={u * 0.4} bevelEnabled bevelSize={u * 0.02} bevelThickness={u * 0.03} curveSegments={8}>
                {ch}
                <meshStandardMaterial color="#0e0e0d" roughness={0.35} metalness={0.25} />
              </Text3D>
            </Center>
          </RigidBody>
        ),
      )}
      {items.map((it) => (
        <RigidBody key={it.id} position={[it.x, H / 2 + u, 0]} colliders="ball" restitution={0.75} friction={0.4}
          angularVelocity={[Math.random() * 4, Math.random() * 4, Math.random() * 4]}>
          <Item kind={it.kind} u={u} />
        </RigidBody>
      ))}
      <mesh position={[0, 0, 0]} visible={false} onClick={(e) => spawn(e.point.x)}>
        <planeGeometry args={[W, H]} />
      </mesh>
    </Physics>
  )
}

export default function NameScene() {
  return (
    <div className="relative h-[62svh] min-h-[380px] w-full" data-hot>
      <Canvas camera={{ position: [0, 0, 14], fov: 40 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}
        onPointerDown={() => {}}>
        <hemisphereLight args={["#ffffff", "#8a887e", 1.4]} />
        <directionalLight position={[4, 6, 8]} intensity={2.2} />
        <pointLight position={[-6, -2, 4]} intensity={40} color="#ff4d00" />
        <Suspense fallback={null}>
          <World />
        </Suspense>
      </Canvas>
      <p className="mono-label pointer-events-none absolute right-0 top-0">Push the letters · click to drop stuff</p>
    </div>
  )
}
