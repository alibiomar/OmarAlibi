"use client"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export function Grain() {
  return <div aria-hidden className="grain" />
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return
    const x = gsap.quickTo(dot.current, "x", { duration: 0.35, ease: "power3" })
    const y = gsap.quickTo(dot.current, "y", { duration: 0.35, ease: "power3" })
    const move = (e: MouseEvent) => { x(e.clientX); y(e.clientY) }
    const over = (e: MouseEvent) =>
      dot.current?.classList.toggle("is-hot", !!(e.target as HTMLElement).closest("a,button,[data-hot]"))
    addEventListener("mousemove", move); addEventListener("mouseover", over)
    return () => { removeEventListener("mousemove", move); removeEventListener("mouseover", over) }
  }, [])
  return <div ref={dot} aria-hidden className="cursor-dot" />
}

export function Preloader() {
  const [n, setN] = useState(0)
  const [done, setDone] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const o = { v: 0 }
    gsap.to(o, { v: 100, duration: 1.4, ease: "power2.inOut", onUpdate: () => setN(Math.round(o.v)),
      onComplete: () => {
        gsap.to(root.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut", onComplete: () => setDone(true) })
        window.dispatchEvent(new Event("intro:done"))
      } })
  }, [])
  if (done) return null
  return (
    <div ref={root} className="fixed inset-0 z-[10000] flex items-end justify-between bg-[#ff4d00] text-[#0e0e0d] p-6 md:p-12">
      <span className="mono-label !text-[#0e0e0d]">Omar Alibi — Portfolio ’26</span>
      <span className="text-[clamp(5rem,20vw,16rem)] font-semibold leading-none tracking-[-0.06em] tabular-nums">{n}</span>
    </div>
  )
}

export function BigMarquee({ words }: { words: string[] }) {
  const row = [...words, ...words].map((w, i) => (
    <span key={i} className="mx-8 flex items-center gap-16 uppercase">
      {w}<span className="text-accent-brand">✺</span>
    </span>
  ))
  return (
    <div className="overflow-hidden py-8" aria-hidden>
      <div className="marquee flex w-max whitespace-nowrap text-[clamp(3rem,8vw,7rem)] font-semibold leading-none tracking-[-0.04em]">
        {row}{row}
      </div>
    </div>
  )
}
