"use client"
import { useEffect, useRef } from "react"

/** Crosshair cursor with live X/Y readout, like a logic-analyzer probe. */
export function Probe() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const xy = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return
    let tx = 0, ty = 0, rx = 0, ry = 0, raf = 0
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${tx}px,${ty}px)`
      if (xy.current) xy.current.textContent = `X${String(Math.round(tx)).padStart(4, "0")} Y${String(Math.round(ty)).padStart(4, "0")}`
      const hot = !!(e.target as HTMLElement)?.closest?.("a,button,input,textarea,[data-hot]")
      ring.current?.setAttribute("data-hot", hot ? "1" : "0")
    }
    const loop = () => {
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    addEventListener("pointermove", move); raf = requestAnimationFrame(loop)
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9995] hidden mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={dot} className="absolute left-0 top-0 -ml-[2px] -mt-[2px] h-1 w-1 bg-white" />
      <div ref={ring} className="group absolute left-0 top-0 data-[hot='1']:[&>i]:scale-[1.9] data-[hot='1']:[&>i]:border-white">
        <i className="absolute -left-4 -top-4 block h-8 w-8 rounded-full border border-white/70 transition-transform duration-300" />
        <b className="absolute -left-6 top-0 h-px w-3 bg-white/70" /><b className="absolute left-3 top-0 h-px w-3 bg-white/70" />
        <b className="absolute -top-6 left-0 h-3 w-px bg-white/70" /><b className="absolute left-0 top-3 h-3 w-px bg-white/70" />
        <span ref={xy} className="absolute left-7 top-5 whitespace-nowrap font-mono text-[9px] tracking-widest text-white/80">X0000 Y0000</span>
      </div>
    </div>
  )
}
