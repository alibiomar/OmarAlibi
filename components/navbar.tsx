"use client"
import { useVisitorLocation } from "@/components/board/use-visitor-location"

const links = [["Profile", "#profile"], ["Work", "#projects-section"], ["Contact", "#contact"]]

export function Navbar() {
  const { time, zone, city } = useVisitorLocation()
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 mix-blend-difference text-white">
      <a href="#top" className="text-lg font-semibold tracking-tight">OA<sup className="text-[10px]">®</sup></a>
      <span className="mono-label hidden !text-white/70 sm:block" suppressHydrationWarning>
        {city && <>{city} </>}{time}{zone && <> {zone}</>}
      </span>
      <ul className="flex gap-6 text-sm">
        {links.map(([l, h], i) => (
          <li key={l}><a href={h} className="underline-offset-4 hover:underline"><sup className="mr-1 font-mono text-[9px] opacity-60">0{i + 1}</sup>{l}</a></li>
        ))}
      </ul>
    </nav>
  )
}
