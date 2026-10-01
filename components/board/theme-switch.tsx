"use client"
import { useEffect, useState } from "react"
import { THEME_EVENT } from "@/lib/theme-colors"

const themes = [
  { id: "ink", name: "Ink", s: "#0a0a0a", a: "#d7ff3a" },
  //{ id: "blueprint", name: "Blueprint", s: "#07152b", a: "#ffd23f" },
  { id: "paper", name: "Paper", s: "#ece8de", a: "#2b3cff" },
  //{ id: "board", name: "Board", s: "#050d0a", a: "#ff4d00" },
]

export function ThemeSwitch() {
  const [t, setT] = useState("blueprint")
  useEffect(() => { setT(document.documentElement.dataset.theme || "blueprint") }, [])
  const pick = (id: string) => {
    document.documentElement.dataset.theme = id
    try { localStorage.setItem("oa-theme", id) } catch {}
    setT(id)
    requestAnimationFrame(() => dispatchEvent(new Event(THEME_EVENT)))
  }
  return (
    <div className="fixed bottom-4 h-8 left-4 z-[60] flex   items-center gap-3 border border-border bg-sub/90 px-3 py-2 backdrop-blur md:bottom-6" role="group" aria-label="Colour theme">
      {/* <span className="silk hidden sm:block">Theme</span> */}
      <div className="flex gap-2">
        {themes.map((x) => (
          <button key={x.id} onClick={() => pick(x.id)} aria-pressed={t === x.id} aria-label={`${x.name} theme`} title={x.name}
            className="swatch" style={{ ["--s" as any]: x.s, ["--a" as any]: x.a }}><i /></button>
        ))}
      </div>
    </div>
  )
}
