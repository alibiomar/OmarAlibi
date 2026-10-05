"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import data from "@/data/projects-data.json"

gsap.registerPlugin(ScrollTrigger)

const eng = (data as any).engineer
const banks: { title: string; items: string[] }[] = Object.values(eng.skills as Record<string, { title: string; description: string }>)
  .map((s) => ({ title: s.title, items: s.description.split(",").map((x) => x.trim()) }))
const pinCount = banks.reduce((a, b) => a + b.items.length, 0)
const projectCount = eng.projects.length

const statement = "I design the hardware, write the firmware and ship the cloud dashboard. Real-time control, edge AI and industrial IoT, taken from schematic to production."

const education = [
  { addr: "0x2026", name: "Electrical Engineering", org: "National Engineering School of Tunis (ENIT)", span: "2023 – 2026", status: "Graduated", logo: true },
  { addr: "0x2023", name: "Preparatory Cycle", org: "Preparatory Institute for Engineering Studies, El Manar", span: "2023", status: "" },
  { addr: "0x2021", name: "Baccalauréat, Technical Sciences", org: "Grade 17.43 / 20", span: "2021", status: "" },
]
const internships = [
  { when: "2026", role: "Engineering Intern (PFE)", org: "IoT Solutions Ltd · Malta", note: "Industrial IoT energy monitoring", tag: "Final-year project", logo: "/logos/iotsolutions.png", w: 250, h: 252, invert: false },
  { when: "2025", role: "Engineering Intern", org: "OnWireWay", note: "IoT firmware & mobile app", tag: "", logo: "/logos/onwireway.png", w: 100, h: 284, invert: true },
  { when: "2024", role: "Technical Intern", org: "STEG", note: "Power systems observation & industrial operations", tag: "", logo: "/logos/steg.png", w: 128, h: 284, invert: false },
]
const languages = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "B2 · Upper-intermediate" },
  { name: "French", level: "B2 · Upper-intermediate" },
]
const leadership = [
  { when: "2024", org: "ASHE", role: "Founder & Manager" },
  { when: "2025", org: "Securinets ENIT", role: "Founding Member" },
  { when: "2023–2025", org: "ENIT Junior Enterprise", role: "Online Mission Head" },
  { when: "2023–2025", org: "Fablab ENIT", role: "Senior Member" },
  { when: "2024", org: "INJAZ Company Program · Econics", role: "Marketing Manager" },
]

const modules = [
  { id: "core", ref: "U1", label: "CORE", sub: "Who I am", diag: ["OA-2026", "@ 100 MHz"] },
  { id: "io", ref: "U2", label: "I/O", sub: "Core technical skills", diag: [`${banks.length} banks`, `${pinCount} pins`] },
  { id: "mem", ref: "U3", label: "MEMORY", sub: "Academic background", diag: ["0x2026 ENIT", "✓ programmed"] },
  { id: "log", ref: "U4", label: "LOG", sub: "Internships", diag: [`${internships.length} internships`, "boot: OK"] },
  { id: "aux", ref: "U5", label: "AUX", sub: "Leadership & languages", diag: [`${leadership.length} roles`, `${languages.length} langs`] },
]

/* ── the diagram ─────────────────────────────── */
const Y = [60, 155, 250, 345, 440] // block centre-y in viewBox
function Diagram({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 390 500" className="h-full w-full" role="img" aria-label="Block diagram of Omar's profile: core, I/O, memory, internship log and aux connected by a bus">
      {/* bus */}
      <line x1="195" y1="16" x2="195" y2="484" stroke="var(--trace)" strokeWidth="6" />
      <line x1="195" y1="16" x2="195" y2="484" stroke="var(--gold)" strokeOpacity=".35" strokeWidth="1" strokeDasharray="2 8" />
      <text x="195" y="498" textAnchor="middle" className="fill-dim" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.5">AXI4-LITE BUS</text>
      {/* travelling token */}
      <g style={{ transform: `translateY(${Y[active]}px)`, transition: "transform .8s cubic-bezier(.7,0,.2,1)" }}>
        <circle cx="195" cy="0" r="13" fill="var(--signal)" fillOpacity=".18" />
        <circle cx="195" cy="0" r="4.5" fill="var(--signal)" />
      </g>
      {modules.map((m, i) => {
        const left = i % 2 === 0
        const on = i === active
        const x = left ? 8 : 232, w = 150
        const cx1 = left ? x + w : x, cx2 = 195
        return (
          <g key={m.id}>
            <line x1={cx1} y1={Y[i]} x2={cx2} y2={Y[i]} stroke={on ? "var(--signal)" : "var(--trace)"} strokeWidth={on ? 2 : 3} className={on ? "flow" : ""} />
            <circle cx={cx2} cy={Y[i]} r="3.5" fill="var(--sub)" stroke={on ? "var(--signal)" : "var(--gold)"} strokeOpacity={on ? 1 : .6} />
            <rect x={x} y={Y[i] - 38} width={w} height="76" stroke={on ? "var(--signal)" : "var(--border)"} style={{ fill: on ? "color-mix(in srgb,var(--signal) 10%,var(--sub))" : "var(--sub-2)", transition: "all .4s" }} />
            {/* pins */}
            {Array.from({ length: 5 }).map((_, k) => (
              <rect key={k} x={left ? x - 5 : x + w} y={Y[i] - 30 + k * 15} width="5" height="6" fill="var(--gold)" opacity={on ? 1 : .45} />
            ))}
            <text x={x + 12} y={Y[i] - 21} fontSize="8" fontFamily="var(--font-mono)" letterSpacing="1.5" className="fill-dim">{m.ref}</text>
            <text x={x + 12} y={Y[i] - 2} fontSize="17" fontWeight="600" fontFamily="var(--font-mono)" letterSpacing="1" fill={on ? "var(--signal)" : "var(--silk)"} style={{ transition: "fill .4s" }}>{m.label}</text>
            <text x={x + 12} y={Y[i] + 14} fontSize="8.5" fontFamily="var(--font-mono)" className="fill-dim">{m.diag[0]}</text>
            <text x={x + 12} y={Y[i] + 27} fontSize="8.5" fontFamily="var(--font-mono)" className="fill-dim">{m.diag[1]}</text>
          </g>
        )
      })}
    </svg>
  )
}

const Head = ({ i }: { i: number }) => (
  <div className="mb-8 flex items-center gap-4">
    <span className="border border-gold/60 px-2 py-1 font-mono text-[11px] text-gold">{modules[i].ref}</span>
    <span className="silk silk-w">{modules[i].label}</span>
    <span className="h-px flex-1 bg-border" />
    <span className="silk">{modules[i].sub}</span>
  </div>
)

export function Profile() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])
  const words = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-42% 0px -42% 0px" })
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const w = words.current?.querySelectorAll("span")
    if (!w) return
    const tw = gsap.fromTo(w, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: words.current, start: "top 82%", end: "bottom 50%", scrub: true } })
    return () => { tw.scrollTrigger?.kill(); tw.kill() }
  }, [])

  const reg = (i: number) => ({ ref: (el: HTMLElement | null) => { refs.current[i] = el }, "data-i": i })

  return (
    <section id="profile" className="relative px-6 py-32 md:px-14">
      <div className="mx-auto max-w-[1500px]">
        <div className="sr mb-20 flex items-end justify-between border-b border-silk pb-5">
          <div>
            <p className="silk">(01) Profile</p>
            <h2 className="display mt-4 text-[clamp(2.6rem,7vw,6.5rem)]">System <span className="text-signal">overview</span></h2>
          </div>
          <p className="silk hidden max-w-[16rem] text-right md:block">One chip. Five subsystems.<br />Scroll to route the bus.</p>
        </div>

        <div className="grid gap-16 lg:grid-cols-[390px_1fr] lg:gap-24">
          {/* sticky diagram */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 h-[min(72vh,620px)] w-[390px]">
              <Diagram active={active} />
            </div>
          </aside>

          <div className="min-w-0 space-y-24 lg:space-y-56">
            {/* U1 — CORE */}
            <article {...reg(0)}>
              <Head i={0} />
              <p ref={words} className="text-[clamp(1.9rem,3.9vw,3.8rem)] font-medium leading-[1.06] tracking-[-0.04em]">
                {statement.split(" ").map((w, i) => <span key={i}>{w} </span>)}
              </p>
              <dl className="mt-14 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
                {[["DEGREE", "B.Eng · EE"], ["BAC", "17.43 / 20"], ["PROJECTS", String(projectCount)], ["INTERNSHIPS", String(internships.length)]].map(([k, v]) => (
                  <div key={k} className="bg-sub p-5">
                    <dt className="silk">{k}</dt>
                    <dd className="mt-2 font-mono text-xl text-silk md:text-2xl">{v}</dd>
                  </div>
                ))}
              </dl>
            </article>

            {/* U2 — I/O : skills */}
            <article {...reg(1)}>
              <Head i={1} />
              <div className="space-y-12">
                {banks.map((b, bi) => (
                  <div key={b.title} className="sr" style={{ ["--d" as any]: `${bi * 0.08}s` }}>
                    <div className="flex items-baseline gap-4">
                      <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{b.title}</h3>
                      <span className="silk">BANK {String.fromCharCode(65 + bi)} · {b.items.length} pins</span>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-2.5">
                      {b.items.map((it, k) => (
                        <li key={it} className="pin"><i className="pad" /><span className="text-dim">P{String.fromCharCode(65 + bi)}{k}</span><span className="text-silk">{it}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>

            {/* U3 — MEMORY : education */}
            <article {...reg(2)}>
              <Head i={2} />
              <div className="border-y border-silk">
                <div className="hidden grid-cols-[6rem_1fr_9rem] gap-6 border-b border-border py-3 md:grid">
                  <span className="silk">Addr</span><span className="silk">Region</span><span className="silk text-right">Span</span>
                </div>
                {education.map((e, i) => (
                  <div key={e.addr} className="sr grid grid-cols-[4.5rem_1fr] gap-x-6 gap-y-1 border-b border-border py-7 last:border-b-0 md:grid-cols-[6rem_1fr_9rem]" style={{ ["--d" as any]: `${i * 0.08}s` }}>
                    <span className="font-mono text-sm text-gold">{e.addr}</span>
                    <div className="flex items-start gap-5">
                      {e.logo ? <Image src="/enit.png" alt="ENIT" width={64} height={64} className="hidden h-14 w-14 shrink-0 object-contain sm:block" /> : <span aria-hidden className="hidden h-14 w-14 shrink-0 sm:block" />}
                      <div>
                        <p className="text-2xl font-semibold leading-tight tracking-tight md:text-[1.75rem]">{e.name}</p>
                        <p className="mt-1 text-sm text-dim">{e.org}</p>
                      </div>
                    </div>
                    <div className="col-start-2 md:col-start-auto md:text-right">
                      <p className="font-mono text-sm text-silk">{e.span}</p>
                      {e.status && <p className="silk mt-1 inline-flex items-center gap-2"><i className="led" /> {e.status}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* U4 — LOG : internships */}
            <article {...reg(3)}>
              <Head i={3} />
              <ul className="space-y-5">
                {internships.map((x, i) => (
                  <li key={x.org} className="sr bracket grid overflow-hidden border border-border bg-sub-2 md:grid-cols-[14rem_1fr]" style={{ ["--d" as any]: `${i * 0.08}s` }}>
                    {/* logo tile: light "label" so every logo reads, whatever its colours */}
                    <div className="grid h-28 place-items-center bg-[#f3f2ee] p-5 md:h-auto md:min-h-[8.5rem]">
                      <Image src={x.logo} alt={`${x.org} logo`} width={x.w} height={x.h}
                        className={`h-auto w-auto max-h-[4.5rem] max-w-full object-contain ${x.invert ? "brightness-0" : ""}`} />
                    </div>
                    <div className="flex flex-col justify-between gap-5 p-6 md:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                        <span className="silk flex items-center gap-2"><i className="led" /> {x.tag || "Completed"}</span>
                        <span className="font-mono text-sm text-gold">{x.when}</span>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold leading-tight tracking-tight md:text-[1.75rem]">{x.org}</p>
                        <p className="mt-1 text-silk/85">{x.role}</p>
                        {x.note && <p className="mt-3 text-sm text-dim">{x.note}</p>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            {/* U5 — AUX : leadership & languages */}
            <article {...reg(4)}>
              <Head i={4} />
              <div className="border border-border bg-sub-2/70 p-6 font-mono text-[13px] leading-7 md:p-9 md:text-[15px] md:leading-8">
                <p className="sr text-dim">{"// leadership & extracurricular"}</p>
                {leadership.map((l) => (
                  <p key={l.org} className="sr">
                    <span className="text-dim">[ {l.when} ]</span> <span className="text-led">OK</span>{" "}
                    <span className="text-silk">{l.org}</span> <span className="text-dim">—</span> {l.role}
                  </p>
                ))}

                <p className="sr mt-6 text-dim">{"// languages"}</p>
                <p className="sr flex flex-wrap gap-x-6">
                  {languages.map((l) => (
                    <span key={l.name}>
                      <span className="text-silk">{l.name}</span> <span className="text-dim">=</span> <span className="text-signal">{l.level.split(" ")[0]}</span>
                    </span>
                  ))}
                </p>

                <p className="sr mt-6"><span className="text-dim">[ NOW  ]</span> <span className="text-signal">..</span> <span className="caret text-silk">Fresh graduate, open to work</span></p>
              </div>
            </article>

          </div>
        </div>
      </div>
    </section>
  )
}