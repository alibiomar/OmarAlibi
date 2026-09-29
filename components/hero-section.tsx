"use client"

import type { PersonaType } from "@/hooks/use-theme-switcher"
import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"
import SplitText from "@/components/SplitText"
import DecryptedText from "@/components/DecryptedText"
import Magnet from "@/components/Magnet"

const HelmetScene = dynamic(() => import("@/components/helmet-scene"), { ssr: false })

const content = {
  engineer: { role: "Electrical Engineer", line: "From bare metal to cloud.", tags: ["Real-time", "Edge AI", "RISC-V", "IoT"] },
  freelancer: { role: "Creative Developer", line: "Brand identity and web, built with engineering rigor.", tags: ["Identity", "Web", "Motion", "Video"] },
}
const socials = [
  { icon: Github, href: "https://github.com/alibiomar", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/omar-alibi", label: "LinkedIn" },
  { icon: Mail, href: "mailto:omar.alibi@etudiant-enit.utm.tn", label: "Email" },
]
const bracket = "pointer-events-none absolute h-6 w-6 border-foreground/60"

export function HeroSection({ persona, onTogglePersona }: { persona: PersonaType; onTogglePersona: () => void }) {
  const c = content[persona]
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const words = root.current?.querySelectorAll(".hero-word")
    if (!words) return
    gsap.set(words, { yPercent: 115 })
    const go = () => gsap.to(words, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.12 })
    addEventListener("intro:done", go, { once: true })
    const t = setTimeout(go, 3200)
    return () => { removeEventListener("intro:done", go); clearTimeout(t) }
  }, [])

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[720px] overflow-hidden">
      <h1 className="sr-only">Omar Alibi — {c.role}</h1>

      {/* giant type, sits behind the helmet */}
      <div aria-hidden className="absolute inset-0 z-0 flex select-none flex-col justify-center px-4 md:px-8">
                <div className="overflow-hidden pb-[0.04em] ">
          <p className="hero-word text-[clamp(4.5rem,20vw,24rem)] font-semibold uppercase leading-[0.8] tracking-[-0.07em] [-webkit-text-stroke:2px_var(--foreground)] text-transparent">Omar</p>
        </div>
        <div className="overflow-hidden pb-[0.04em] text-right">
          <p className="hero-word text-[clamp(4.5rem,20vw,24rem)] font-semibold uppercase leading-[0.8] tracking-[-0.07em]">Alibi</p>
        </div>

      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
  <HelmetScene />
</div>

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-6 bottom-24 top-24 z-20 md:inset-x-12">
        <i className={`${bracket} left-0 top-0 border-l border-t`} />
        <i className={`${bracket} right-0 top-0 border-r border-t`} />
        <i className={`${bracket} bottom-0 left-0 border-b border-l`} />
        {/* <i className={`${bracket} bottom-0 right-0 border-b border-r`} /> */}
        <div className="mono-label absolute left-4 top-4 hidden sm:block">SYS.ONLINE / {c.role}</div>
        <div className="mono-label absolute right-4 top-4 hidden text-right sm:block">
          YAW <span id="hud-yaw" className="text-accent-brand">  0</span>° · PITCH <span id="hud-pitch" className="text-accent-brand">  0</span>°
        </div>
        <div className="mono-label absolute left-4 top-1/2 hidden -translate-y-1/2 -rotate-90 origin-left lg:block">{c.tags.join(" / ")}</div>
      </div>

      <div className="absolute inset-x-6 bottom-6 z-30 flex flex-col gap-6 md:inset-x-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <SplitText key={persona} text={c.line} tag="p" splitType="words" delay={80} animateOn="hover" textAlign="left" threshold={0} rootMargin="0px"
            className="text-xl font-medium leading-tight tracking-tight md:text-3xl pl-4" />
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Magnet padding={60} magnetStrength={4}>
              <a href="#projects-section" className="btn-solid">Selected work <ArrowUpRight className="h-4 w-4" /></a>
            </Magnet>
            <Magnet padding={60} magnetStrength={4}>
              <a href="/Omar_Alibi_Resume.pdf" target="_blank" rel="noopener" className="btn-line">Résumé</a>
            </Magnet>
          </div>
        </div>
        <div className="flex flex-col items-start gap-6 pb-4 md:items-end">
          <p className="mono-label flex items-center gap-2 !text-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-brand" />
            <DecryptedText text="Available for work" animateOn="hover" sequential speed={40} className="text-lg" />
          </p>
          {/* <button onClick={onTogglePersona} className="mono-label underline underline-offset-4 hover:!text-accent-brand">
            Mode: {persona === "engineer" ? "Engineer → Creative" : "Creative → Engineer"}
          </button> */}
          <div className="flex gap-4">
            {socials.map(({ icon: I, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener" aria-label={label} className="hover:text-accent-brand"><I className="h-5 w-5" /></a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
