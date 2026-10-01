"use client"
import { useEffect, useState } from "react"

const stops = [
  { id: "top", tp: "TP0", label: "Boot" },
  { id: "profile", tp: "TP1", label: "Profile" },
  { id: "work", tp: "TP2", label: "Work" },
  { id: "contact", tp: "TP3", label: "Contact" },
]

/** Top bar + right-hand power rail with test points and scroll progress. */
export function Rail() {
  const [p, setP] = useState(0)
  const [pos, setPos] = useState<number[]>([0, 0.25, 0.55, 1])
  const [act, setAct] = useState(0)

  useEffect(() => {
    let raf = 0
    const calc = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight)
      setP(Math.min(1, scrollY / max))
      const offs = stops.map((s) => (document.getElementById(s.id)?.offsetTop ?? 0))
      setPos(offs.map((o) => Math.min(1, o / max)))
      let a = 0; offs.forEach((o, i) => { if (scrollY + innerHeight * 0.4 >= o) a = i }); setAct(a)
    }
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(calc) }
    calc(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on)
    const t = setTimeout(calc, 1500) // after images settle
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); clearTimeout(t); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <nav data-on-signal={act === 3 ? "" : undefined} className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 pb-8 md:px-14" aria-label="Primary">
        <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-sub via-sub/90 to-transparent transition-opacity ${act === 3 ? "opacity-0" : ""}`} />
        <a href="#top" className="font-mono text-sm font-semibold tracking-tight">OA<sup className="text-[9px] text-signal">®</sup></a>
        <ul className="flex items-center gap-1 sm:gap-2">
          {stops.slice(1).map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={`silk px-3 py-2 transition-colors hover:!text-signal ${act === i + 1 ? "silk-w" : ""}`}>
                <span className="mr-1.5 text-gold">0{i + 1}</span>{s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div aria-hidden className={`pointer-events-none fixed right-4 top-1/2 z-40 hidden h-[46vh] -translate-y-1/2 transition-opacity md:block ${act === 3 ? "opacity-0" : ""}`}>
        <div className="absolute inset-y-0 right-[3px] w-px bg-border" />
        <div className="absolute right-[3px] top-0 w-px bg-signal shadow-[0_0_8px_var(--signal)]" style={{ height: `${p * 100}%` }} />
        {stops.map((s, i) => (
          <div key={s.id} className="absolute right-0 flex -translate-y-1/2 items-center gap-3" style={{ top: `${pos[i] * 100}%` }}>
            <span className={`silk hidden 2xl:block transition-opacity ${act === i ? "opacity-100 !text-silk" : "opacity-0"}`}>{s.tp} · {s.label}</span>
            <i className={`block h-[7px] w-[7px] border ${act >= i ? "border-signal bg-signal" : "border-dim bg-sub"}`} />
          </div>
        ))}
      </div>
    </>
  )
}
