"use client"
import type { PersonaType } from "@/hooks/use-theme-switcher"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const statement = {
  engineer: "I design the hardware, write the firmware and ship the cloud dashboard. Real-time control, edge AI and industrial IoT, taken from schematic to production.",
  freelancer: "I pair an engineer's discipline with a designer's eye: identities, video and web experiences for brands that want to look sharp and run fast.",
}
const cols = {
  engineer: [
    { k: "Experience", items: [["2025", "Engineering Intern, OnWire Link: IoT firmware & mobile app"], ["—", "Real-time embedded: BeagleBone, STM32, RISC-V SoC"], ["—", "Edge AI: TensorFlow Lite, TensorRT on Jetson Nano"], ["—", "Industrial IoT: MQTT, Firebase, live dashboards"]] },
    { k: "Education", items: [["Now", "Electrical Engineering, ENIT"], ["—", "Preparatory Institute for Engineering Studies, El Manar"], ["—", "Baccalauréat Technical Sciences, 17.43/20"], ["—", "OpusLab Frontend Development Certification"]] },
  ],
  freelancer: [
    { k: "Services", items: [["01", "Full-stack web: Next.js, React, e-commerce"], ["02", "Visual identity for 15+ businesses"], ["03", "Branding: hospitality, cosmetics, education"], ["04", "Digital marketing materials"]] },
    { k: "Tools", items: [["Design", "Photoshop, Illustrator, After Effects, Premiere Pro"], ["Web", "React, Next.js, HTML/CSS, JavaScript"], ["Backend", "Node.js, Python, Firebase, Supabase"], ["Other", "LaTeX, Microsoft Office, SolidWorks"]] },
  ],
}

export function AboutSection({ persona }: { persona: PersonaType }) {
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    const words = ref.current?.querySelectorAll("span")
    if (!words) return
    const tw = gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true } })
    return () => { tw.scrollTrigger?.kill(); tw.kill() }
  }, [persona])

  return (
    <section id="about" className="px-6 py-32 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <p className="mono-label">(01) About</p>
        <p ref={ref} key={persona} className="mt-8 max-w-5xl text-[clamp(1.75rem,4.2vw,4rem)] font-medium leading-[1.08] tracking-[-0.035em]">
          {statement[persona].split(" ").map((w, i) => <span key={i}>{w} </span>)}
        </p>
        <div className="mt-28 grid gap-16 md:grid-cols-2">
          {cols[persona].map((s) => (
            <div key={s.k}>
              <h3 className="text-2xl font-semibold tracking-tight">{s.k}</h3>
              <ul className="mt-6 divide-y divide-foreground/15 border-y border-foreground">
                {s.items.map(([a, b]) => (
                  <li key={b} className="grid grid-cols-[4.5rem_1fr] gap-4 py-4 text-[15px]">
                    <span className="mono-label pt-0.5">{a}</span><span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
