"use client"
import type { PersonaType } from "@/hooks/use-theme-switcher"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import projectsData from "@/data/projects-data.json"

gsap.registerPlugin(ScrollTrigger)

const statement = {
  engineer: "I design the hardware, write the firmware and ship the cloud dashboard. Real-time control, edge AI and industrial IoT, taken from schematic to production.",
  freelancer: "I pair an engineer's discipline with a designer's eye: identities, video and web experiences for brands that want to look sharp and run fast.",
}

const eng = (projectsData as any).engineer
const skills: { title: string; items: string[] }[] = Object.values(eng.skills as Record<string, { title: string; description: string }>)
  .map((s) => ({ title: s.title, items: s.description.split(",").map((x) => x.trim()) }))

const education = [
  { when: "2023 – 2026", title: "Electrical Engineering", org: "National Engineering School of Tunis (ENIT)", tag: "Completed", logo: true },
  { when: "2023", title: "Preparatory Cycle", org: "Preparatory Institute for Engineering Studies, El Manar" },
  { when: "2021", title: "Baccalauréat, Technical Sciences", org: "Grade 17.43 / 20" },
]
const experience = [
  { when: "2025", role: "Engineering Intern", org: "OnWire Link", note: "IoT firmware & mobile app" },
  { when: "", role: "Technical Intern", org: "STEG", note: "" },
  { when: "", role: "Founder & Manager", org: "ASHE", note: "" },
]

const freelancer = [
  { k: "Services", items: ["Full-stack web: Next.js, React, e-commerce", "Visual identity for 15+ businesses", "Branding: hospitality, cosmetics, education", "Digital marketing materials"] },
  { k: "Tools", items: ["Photoshop, Illustrator, After Effects, Premiere Pro", "React, Next.js, HTML/CSS, JavaScript", "Node.js, Python, Firebase, Supabase", "LaTeX, Microsoft Office, SolidWorks"] },
]

const Head = ({ n, t }: { n: string; t: string }) => (
  <div className="mb-6 flex items-baseline justify-between">
    <h3 className="serif text-3xl leading-none">{t}</h3>
    <span className="mono-label">{n}</span>
  </div>
)

export function ProfileSection({ persona }: { persona: PersonaType }) {
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    const words = ref.current?.querySelectorAll("span")
    if (!words) return
    const tw = gsap.fromTo(words, { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true } })
    return () => { tw.scrollTrigger?.kill(); tw.kill() }
  }, [persona])

  return (
    <section id="profile" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <p className="mono-label">(01) Profile</p>
        <p ref={ref} key={persona} className="serif mt-8 max-w-6xl text-[clamp(2rem,4.8vw,4.75rem)] leading-[1.04]">
          {statement[persona].split(" ").map((w, i) => <span key={i}>{w} </span>)}
        </p>

        {persona === "engineer" ? (
          <div className="mt-24 grid gap-4 lg:grid-cols-12">
            {/* Education */}
            <div className="panel p-7 lg:col-span-5 lg:row-span-2 md:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mono-label">Academic background</p>
                  <p className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent-brand">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-brand" /> Engineering degree completed
                  </p>
                </div>
                <Image src="/enit.png" alt="ENIT" width={72} height={72} className="h-14 w-14 object-contain" />
              </div>
              <ol className="relative mt-10 space-y-9 border-l border-foreground/20 pl-8">
                {education.map((e, i) => (
                  <li key={e.title} className="relative">
                    <span className={`absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full border ${i === 0 ? "border-accent-brand bg-accent-brand" : "border-foreground/50 bg-background"}`} />
                    <p className="mono-label">{e.when}{e.tag && <span className="ml-3 !text-accent-brand">● {e.tag}</span>}</p>
                    <p className="serif mt-2 text-[1.75rem] leading-tight">{e.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{e.org}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Skills */}
            <div className="panel p-7 md:p-9 lg:col-span-7">
              <Head n="A" t="Core technical skills" />
              <div className="space-y-6">
                {skills.map((s) => (
                  <div key={s.title} className="grid gap-3 border-t border-foreground/15 pt-5 md:grid-cols-[9rem_1fr]">
                    <p className="mono-label pt-1.5 !text-foreground">{s.title}</p>
                    <ul className="flex flex-wrap gap-2">{s.items.map((i) => <li key={i} className="chip">{i}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="panel p-7 md:p-9 lg:col-span-7">
              <Head n="B" t="Professional experience" />
              <ul>
                {experience.map((x) => (
                  <li key={x.org} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-t border-foreground/15 py-4 md:grid-cols-[3.5rem_1fr_auto]">
                    <span className="mono-label">{x.when || "—"}</span>
                    <span className="text-lg tracking-tight">{x.role}<span className="text-muted-foreground"> · {x.org}</span>
                      {x.note && <span className="block text-sm text-muted-foreground">{x.note}</span>}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-24 grid gap-4 md:grid-cols-2">
            {freelancer.map((s) => (
              <div key={s.k} className="panel p-7 md:p-9">
                <Head n="" t={s.k} />
                <ul>{s.items.map((b) => <li key={b} className="border-t border-foreground/15 py-4">{b}</li>)}</ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
