"use client"
import { useEffect, useState } from "react"
import data from "@/data/projects-data.json"

const projectCount = (data as any).engineer.projects.length

const where = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    return tz.includes("/") ? tz.split("/").pop()!.replace(/_/g, " ") : "Earth"
  } catch { return "Earth" }
}
const makeLines = (place: string) => [
  `OA-BIOS v2026.09  ·  ${place}`,
  "POST ........ RAM 512K ........ OK",
  "MOUNT /profile ................. OK",
  `MOUNT /work (${projectCount} projects) ..... OK`,
  "LINK  contact@omar.alibi ....... OK",
]

export function Boot() {
  const [lines, setLines] = useState(() => makeLines("..."))
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(false)
  const [out, setOut] = useState(false)

  useEffect(() => {
    const L = makeLines(where())
    setLines(L)
    const finish = () => { document.documentElement.setAttribute("data-booted", "1"); document.documentElement.classList.add("probe") }
    const skip = () => { setOut(true); finish(); setN(L.length); try { sessionStorage.setItem("oa-booted", "1") } catch {} }
    let seen = false
    try { seen = sessionStorage.getItem("oa-booted") === "1" } catch {}
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (seen || reduced) { finish(); setGone(true); return }
    addEventListener("keydown", skip)
    addEventListener("pointerdown", skip)
    const t: ReturnType<typeof setTimeout>[] = []
    L.forEach((_, i) => t.push(setTimeout(() => setN(i + 1), 180 + i * 230)))
    t.push(setTimeout(() => { setOut(true); finish() }, 180 + L.length * 230 + 250))
    t.push(setTimeout(() => { setGone(true); try { sessionStorage.setItem("oa-booted", "1") } catch {} }, 180 + L.length * 230 + 1250))
    return () => { t.forEach(clearTimeout); removeEventListener("keydown", skip); removeEventListener("pointerdown", skip) }
  }, [])

  if (gone) return null
  return (
    <div role="button" tabIndex={0} aria-label="Skip intro" onClick={() => { setOut(true); setN(lines.length); try { sessionStorage.setItem("oa-booted", "1") } catch {} }} aria-hidden className="fixed inset-0 z-[10000] flex cursor-pointer flex-col justify-end bg-sub p-6 transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)] md:p-12"
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
