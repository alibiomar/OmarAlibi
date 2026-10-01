"use client"
import { useEffect, useState } from "react"

const lines = [
  "OA-BIOS v2026.09  ·  Tunis, TN",
  "POST ........ RAM 512K ........ OK",
  "MOUNT /profile ................. OK",
  "MOUNT /work (10 boards) ........ OK",
  "LINK  contact@omar.alibi ....... OK",
]

export function Boot() {
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(false)
  const [out, setOut] = useState(false)

  useEffect(() => {
    const finish = () => { document.documentElement.setAttribute("data-booted", "1"); document.documentElement.classList.add("probe") }
    let seen = false
    try { seen = sessionStorage.getItem("oa-booted") === "1" } catch {}
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (seen || reduced) { finish(); setGone(true); return }
    const t: ReturnType<typeof setTimeout>[] = []
    lines.forEach((_, i) => t.push(setTimeout(() => setN(i + 1), 180 + i * 230)))
    t.push(setTimeout(() => { setOut(true); finish() }, 180 + lines.length * 230 + 250))
    t.push(setTimeout(() => { setGone(true); try { sessionStorage.setItem("oa-booted", "1") } catch {} }, 180 + lines.length * 230 + 1250))
    return () => t.forEach(clearTimeout)
  }, [])

  if (gone) return null
  return (
    <div aria-hidden className="fixed inset-0 z-[10000] flex flex-col justify-end bg-sub p-6 transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)] md:p-12"
      style={{ transform: out ? "translateY(-100%)" : "none" }}>
      <div className="pour absolute inset-x-0 bottom-0 h-3 opacity-60" />
      <div className="font-mono text-sm leading-7 text-dim md:text-base">
        {lines.slice(0, n).map((l, i) => (
          <p key={l} className={i === n - 1 && n < lines.length ? "caret text-silk" : ""}>
            <span className="text-signal">{">"}</span> {l}
          </p>
        ))}
      </div>
      <div className="mt-8 h-px w-full bg-border">
        <div className="h-full bg-signal transition-[width] duration-300" style={{ width: `${(n / lines.length) * 100}%` }} />
      </div>
    </div>
  )
}
