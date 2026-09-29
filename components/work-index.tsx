"use client"
import { useRef, useState } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ArrowUpRight } from "lucide-react"

type P = { title: string; category: string; year: string; image: string; technologies: string[] }

export function WorkIndex({ projects, onSelect }: { projects: P[]; onSelect: (p: any) => void }) {
  const preview = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(-1)
  const pos = useRef<{ x: any; y: any }>()

  const move = (e: React.MouseEvent) => {
    if (!preview.current) return
    pos.current ??= {
      x: gsap.quickTo(preview.current, "x", { duration: 0.5, ease: "power3" }),
      y: gsap.quickTo(preview.current, "y", { duration: 0.5, ease: "power3" }),
    }
    pos.current.x(e.clientX + 24); pos.current.y(e.clientY - 120)
  }

  return (
    <div onMouseMove={move} onMouseLeave={() => setActive(-1)} className="relative">
      <ul className="border-t border-border">
        {projects.map((p, i) => (
          <li key={p.title} className="border-b border-border">
            <button
              data-hot
              onClick={() => onSelect(p)}
              onMouseEnter={() => setActive(i)}
              className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-7 text-left transition-[padding,opacity] duration-500 hover:pl-4 md:grid-cols-[4rem_1fr_14rem_5rem_2rem]"
              style={{ opacity: active === -1 || active === i ? 1 : 0.3 }}
            >
              <span className="mono-label">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-2xl font-medium tracking-tight md:text-4xl">{p.title.split(" - ")[0]}</span>
              <span className="mono-label hidden md:block">{p.category}</span>
              <span className="mono-label hidden md:block">{p.year}</span>
              <ArrowUpRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </button>
          </li>
        ))}
      </ul>
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-56 w-80 overflow-hidden rounded-[2px] border border-foreground transition-[opacity,scale] duration-300 md:block"
        style={{ opacity: active >= 0 ? 1 : 0, scale: active >= 0 ? 1 : 0.9 }}
      >
        {projects.map((p, i) => (
          <Image key={p.image} src={p.image} alt="" fill sizes="320px"
            className={`object-cover transition-opacity duration-300 ${i === active ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
    </div>
  )
}
