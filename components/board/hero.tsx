"use client"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import { TraceField } from "./trace-field"
import { Scope } from "./scope"
import { TiltChip } from "./tilt-chip"
import { useVisitorLocation } from "./use-visitor-location"

const socials = [
  { icon: Github, href: "https://github.com/alibiomar", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/omar-alibi", label: "LinkedIn" },
  { icon: Mail, href: "mailto:alibiomar3@gmail.com", label: "Email" },
]

export function Hero() {
  const { time, zone, city, coords } = useVisitorLocation()

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <TraceField className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_35%,var(--sub)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-sub" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-6 pb-20 pt-20 md:px-14 md:pb-24">
        {/* board header */}
        <div className="rv flex flex-wrap items-center justify-between gap-x-8 gap-y-2" style={{ ["--d" as any]: "0s" }}>
          <p className="silk">Board <span className="silk-w">OA-2026</span> · Rev A · 4-layer</p>
          <p className="silk hidden sm:block" suppressHydrationWarning>
            {coords && <>{coords} · </>}{city && <>{city} </>}<span className="silk-w tabular-nums">{time}</span>{zone && <> {zone}</>}
          </p>
        </div>

        {/* the chip */}
        <div className="flex flex-1 items-center py-6 md:py-8">
          <div className="rv mx-auto w-full max-w-[1240px]" style={{ ["--d" as any]: ".15s" }}>
          <TiltChip className="px-6 pb-6 pt-14 md:px-14 md:pb-7">
            <i className="ic-notch" /><i className="ic-dot" />
            <span className="silk absolute right-6 top-5 hidden !text-white/45 sm:block">U1 · Electrical Engineer · Class of 2026</span>
            <h1 className="display text-[clamp(3.4rem,min(12.5vw,24svh),13rem)]">
              <span className="sr-only">Omar Alibi, Electrical Engineer. </span>
              <span aria-hidden className="block outline-text">Omar</span>
              <span aria-hidden className="block text-right text-chip-fg">Alibi<span className="text-signal">.</span></span>
            </h1>
            <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[.18em] text-white/45 sm:grid-cols-3 md:text-[11px]">
              <span>OA-2026 · EE · REV A</span>
              <span className="sm:text-center">Embedded · Edge AI · RISC-V · IoT</span>
              <span className="sm:text-right">LOT 0926 · ENIT · TN</span>
            </div>
          </TiltChip>
          </div>
        </div>

        {/* status + actions */}
        <div className="rv grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end" style={{ ["--d" as any]: ".35s" }}>
          <div>
            <p className="text-[clamp(1.6rem,3vw,2.7rem)] font-medium leading-[1.05] tracking-[-0.035em]">
              From bare metal to cloud<span className="text-signal">.</span>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
              <p className="silk flex items-start gap-2"><i className="led mt-[3px] shrink-0" /><span>ENIT · Electrical Engineering · 2023–2026 · <span className="silk-w">Graduated</span></span></p>
              <p className="silk flex items-start gap-2"><i className="led o mt-[3px]" /> <span className="silk-o">Open to work · Embedded / Firmware / IoT<br /><span className="!text-dim">Relocation or remote · Tunisia / Europe</span></span></p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#work" className="group inline-flex items-center gap-3 bg-signal px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[.14em] text-on-signal transition-transform hover:-translate-y-0.5">
              Selected work <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </a>
            <a href="/Omar_Alibi_Resume.pdf" download className="border border-silk/60 px-6 py-4 font-mono text-xs uppercase tracking-[.14em] transition-colors hover:border-signal hover:text-signal">Download résumé</a>
            <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
            {socials.map(({ icon: I, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener" aria-label={label} className="grid h-12 w-12 place-items-center border border-border transition-colors hover:border-signal hover:text-signal"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>

        {/* oscilloscope */}
        <div className="rv relative mt-6 h-16 border border-border bg-sub/70 backdrop-blur-sm" style={{ ["--d" as any]: ".5s" }} aria-hidden>
          <Scope />
          <span className="silk absolute left-3 top-2 !text-signal">CH1 · 3.3V · PWM</span>
          <span className="silk absolute bottom-2 left-3 !text-led/80">CH2 · ANALOG</span>
          <span className="silk absolute right-3 top-2 hidden sm:block">1 kHz · 5 ms/div · RUN</span>
        </div>
      </div>
    </section>
  )
}
