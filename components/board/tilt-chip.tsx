"use client"
import { useRef, type ReactNode } from "react"

const MAX = 9 // max tilt in degrees

/**
 * The IC package. Wherever the pointer is, that part of the chip is pressed
 * back into the board, so the opposite side lifts toward you. A soft sheen
 * follows the pointer. Touch input and reduced-motion users get a static chip.
 */
export function TiltChip({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return
    const el = ref.current
    if (!el) return
    const { clientX, clientY } = e
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      const px = (clientX - r.left) / r.width // 0..1
      const py = (clientY - r.top) / r.height
      const nx = px * 2 - 1 // -1..1
      const ny = py * 2 - 1
      // positive rotateY sends the right edge away; negative rotateX sends the bottom edge away
      el.style.setProperty("--rx", `${(-ny * MAX).toFixed(2)}deg`)
      el.style.setProperty("--ry", `${(nx * MAX).toFixed(2)}deg`)
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`)
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`)
      el.dataset.tilt = "on"
    })
  }
  const leave = () => {
    cancelAnimationFrame(raf.current)
    const el = ref.current
    if (!el) return
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
    delete el.dataset.tilt
  }

  return (
    <div className="tilt-stage mx-auto w-full max-w-[1240px]">
      <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`ic tilt ${className}`}>
        <span aria-hidden className="tilt-sheen" />
        {children}
      </div>
    </div>
  )
}
