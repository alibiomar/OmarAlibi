"use client"

import type { PersonaType } from "@/hooks/use-theme-switcher"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const profile = {
  engineer: {
    eyebrow: "(01) Profile / engineering practice",
    statement: "I design the hardware, write the firmware, and ship the software around it. Real-time control, edge AI, and industrial IoT — taken from schematic to a working product.",
    note: "Build with intent. Test in the real world.",
    capabilities: [
      { number: "01", title: "Embedded systems", description: "Arduino, ESP32/8266, STM32, Raspberry Pi, BeagleBone, FPGA, and PCB design." },
      { number: "02", title: "Web & software", description: "React, Next.js, Node.js, Python, Flutter, C/C++, and Rust." },
      { number: "03", title: "IoT & industrial", description: "MQTT, industrial automation, real-time systems, and connected dashboards." },
    ],
    education: { program: "Electrical Engineering", institution: "National Engineering School of Tunis", duration: "2023 — 2026", history: [["2023 — 2026", "National Engineering School of Tunis", "Electrical Engineering"], ["2023", "Preparatory Institute for Engineering Studies, El Manar", "Engineering studies"], ["2021", "Baccalauréat Technical Sciences", "17.43 / 20"]] },
    experience: [["2025", "OnWire Link", "Engineering Intern"], ["2024", "STEG", "Technical Intern"], ["—", "ASHE", "Founder & Manager"]],
  },
  freelancer: {
    eyebrow: "(01) Profile / creative practice",
    statement: "I pair an engineer's discipline with a designer's eye: identities, video, and web experiences for brands that want to look sharp and run fast.",
    note: "Make it clear. Make it memorable.",
    capabilities: [
      { number: "01", title: "Web experiences", description: "Full-stack web, e-commerce, responsive systems, and digital products." },
      { number: "02", title: "Visual identity", description: "Brand systems, logos, guidelines, and marketing materials for growing businesses." },
      { number: "03", title: "Motion & content", description: "Video, social assets, and launch materials that give brands momentum." },
    ],
    education: { program: "Electrical Engineering", institution: "National Engineering School of Tunis", duration: "2023 — 2026", history: [["2023 — 2026", "National Engineering School of Tunis", "Electrical Engineering"], ["2023", "Preparatory Institute for Engineering Studies, El Manar", "Engineering studies"], ["2021", "Baccalauréat Technical Sciences", "17.43 / 20"]] },
    experience: [["01", "Brand systems", "15+ businesses supported"], ["02", "Digital products", "React · Next.js · Firebase"], ["03", "Creative tools", "Adobe Creative Suite"]],
  },
}

export function AboutSection({ persona }: { persona: PersonaType }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const c = profile[persona]

  useEffect(() => {
    const words = ref.current?.querySelectorAll("span")
    if (!words) return
    const tw = gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true } })
    return () => { tw.scrollTrigger?.kill(); tw.kill() }
  }, [persona])

  return (
    <section id="about" className="px-6 py-32 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between gap-8">
          <p className="mono-label">{c.eyebrow}</p>
          <span className="mono-label hidden text-right md:block">{c.note.split(" ").map((word, i) => <span key={i}>{word}{i === 1 ? <br /> : " "}</span>)}</span>
        </div>

        <p ref={ref} key={persona} className="mt-8 max-w-5xl text-[clamp(1.75rem,4.2vw,4rem)] font-medium leading-[1.08] tracking-[-0.035em]">
          {c.statement.split(" ").map((word, i) => <span key={i}>{word} </span>)}
        </p>

        <div className="mt-24 border-y border-foreground/20">
          <div className="grid gap-8 py-6 md:grid-cols-[1fr_2fr] md:items-baseline">
            <p className="mono-label">Core capabilities</p>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">A cross-disciplinary toolkit for moving from an idea to a tested, useful result.</p>
          </div>
          <div className="grid divide-y divide-foreground/15 md:grid-cols-3 md:divide-x md:divide-y-0">
            {c.capabilities.map((item) => <article key={item.number} className="py-7 md:px-7 md:first:pl-0 md:last:pr-0"><div className="flex items-start justify-between gap-4"><span className="mono-label text-accent-brand">{item.number}</span><span className="mono-label text-right">{persona === "engineer" ? "Focus" : "Offer"}</span></div><h3 className="mt-10 text-xl font-medium tracking-tight">{item.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p></article>)}
          </div>
        </div>

        <div className="mt-24 grid gap-16 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="flex items-end justify-between gap-6"><h3 className="text-2xl font-semibold tracking-tight">Education</h3><span className="mono-label">01 / Academic history</span></div>
            <div className="mt-6 flex items-center gap-5 border-y border-foreground py-6"><Image src="/enit.png" alt="ENIT" width={56} height={56} className="h-14 w-14 object-contain" /><div><p className="font-medium">{c.education.program}</p><p className="mt-1 text-sm text-muted-foreground">{c.education.institution}</p><p className="mono-label mt-2">Completed · {c.education.duration}</p></div></div>
            <ul className="divide-y divide-foreground/15 border-b border-foreground/20">{c.education.history.map(([date, institution, detail]) => <li key={institution} className="grid grid-cols-[6rem_1fr_auto] gap-4 py-4 text-sm"><span className="mono-label">{date}</span><span className="font-medium">{institution}</span><span className="text-right text-muted-foreground">{detail}</span></li>)}</ul>
          </div>
          <div><div className="flex items-end justify-between gap-6"><h3 className="text-2xl font-semibold tracking-tight">Experience</h3><span className="mono-label">02 / Practice</span></div><ul className="mt-6 divide-y divide-foreground/15 border-y border-foreground">{c.experience.map(([date, company, role]) => <li key={company} className="grid grid-cols-[4rem_1fr_auto] gap-4 py-4 text-sm"><span className="mono-label">{date}</span><span className="font-medium">{company}</span><span className="text-right text-muted-foreground">{role}</span></li>)}</ul></div>
        </div>
      </div>
    </section>
  )
}
