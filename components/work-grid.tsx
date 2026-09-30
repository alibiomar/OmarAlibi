"use client"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

type P = { title: string; category: string; year: string; image: string; technologies: string[]; status: string; featured: boolean; company?: string }

export function WorkGrid({ projects, onSelect }: { projects: P[]; onSelect: (p: any) => void }) {
  return (
    <ul className="grid gap-px border border-border bg-border md:grid-cols-6">
      {projects.map((p, i) => {
        const wide = i % 5 === 0 // rhythm: every 5th card spans wider
        return (
          <li key={p.title} className={`bg-background ${wide ? "md:col-span-4" : "md:col-span-2"}`}>
            <button data-hot onClick={() => onSelect(p)} className="group flex h-full w-full flex-col text-left">
              <div className={`relative w-full overflow-hidden bg-muted ${wide ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                <Image src={p.image} alt={p.title} fill sizes={wide ? "(min-width:768px) 66vw, 100vw" : "(min-width:768px) 33vw, 100vw"}
                  className="object-cover grayscale transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0" />
                <span className="mono-label absolute left-4 top-4 !text-foreground bg-background/80 px-2 py-1 backdrop-blur">{String(i + 1).padStart(2, "0")}</span>
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-accent-brand text-[#0e0e0d] opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="serif text-3xl leading-none md:text-4xl">{p.title.split(" - ")[0]}</h3>
                  <span className="mono-label shrink-0">{p.year}</span>
                </div>
                <p className="mono-label">{p.category}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {p.technologies.slice(0, wide ? 5 : 3).map((t) => <li key={t} className="chip !px-2.5 !py-1 !text-[11px] text-muted-foreground">{t}</li>)}
                </ul>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
