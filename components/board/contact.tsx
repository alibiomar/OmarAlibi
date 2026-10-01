"use client"
import { useState } from "react"
import { z } from "zod"
import { ArrowUpRight, Github, Linkedin } from "lucide-react"

const schema = z.object({
  firstName: z.string().min(2, "First name too short"),
  lastName: z.string().min(2, "Last name too short"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(5, "Subject too short"),
  message: z.string().min(10, "Message too short"),
})
type F = z.infer<typeof schema>
const empty: F = { firstName: "", lastName: "", email: "", subject: "", message: "" }
const fields: [keyof F, string][] = [["firstName", "First name"], ["lastName", "Last name"], ["email", "Email"], ["subject", "Subject"]]

export function Contact() {
  const [f, setF] = useState<F>(empty)
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | string>("idle")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = schema.safeParse(f)
    if (!r.success) return setStatus(r.error.issues[0].message)
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...r.data, persona: "engineer" }) })
      if (!res.ok) throw new Error((await res.json()).message || "Failed to send")
      setF(empty); setStatus("ok")
    } catch (err) { setStatus(err instanceof Error ? err.message : "Failed to send") }
  }

  const line = "w-full border-b-2 border-ink/50 bg-transparent py-3 text-lg text-ink outline-none transition-colors placeholder:text-ink/80 focus:border-ink"

  return (
    <section id="contact" className="relative bg-signal text-ink">
      <div className="mx-auto max-w-[1500px] px-6 pb-20 pt-32 md:px-14">
        <div className="mb-16 flex items-center justify-between border-b border-ink pb-5">
          <p className="silk !text-ink">(03) Contact · J1 programming header</p>
          <p className="silk hidden !text-ink sm:flex sm:items-center sm:gap-6">
            {["3V3", "SWDIO", "SWCLK", "GND"].map((p) => <span key={p} className="flex items-center gap-2"><i className="inline-block h-2 w-2 bg-ink" />{p}</span>)}
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <a href="mailto:alibiomar3@gmail.com" data-hot className="display group block text-[clamp(3rem,8.6vw,9.5rem)]">
              Let’s<br />build<br />something<span className="inline-block transition-transform duration-500 group-hover:translate-x-3 group-hover:-translate-y-3">↗</span>
            </a>
            <div className="mt-12 flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-[.14em]">
              <a href="mailto:alibiomar3@gmail.com" className="underline underline-offset-4">alibiomar3@gmail.com</a>
              <a href="https://github.com/alibiomar" target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:underline"><Github className="h-4 w-4" /> GitHub</a>
              <a href="https://linkedin.com/in/omar-alibi" target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:underline"><Linkedin className="h-4 w-4" /> LinkedIn</a>
            </div>
          </div>

          <form onSubmit={submit} className="grid content-end gap-x-8 gap-y-6 sm:grid-cols-2">
            {fields.map(([k, label]) => (
              <input key={k} aria-label={label} placeholder={label} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}
                className={`${line} ${k === "subject" || k === "email" ? "sm:col-span-2" : ""}`} />
            ))}
            <textarea aria-label="Message" placeholder="Message" rows={4} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={`${line} resize-none sm:col-span-2`} />
            <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
              <button disabled={status === "sending"} className="inline-flex items-center gap-3 bg-ink px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[.14em] text-signal transition-transform hover:-translate-y-0.5 disabled:opacity-50">
                {status === "sending" ? "Flashing…" : "Send message"} <ArrowUpRight className="h-4 w-4" />
              </button>
              <p role="status" className="silk !text-ink">
                {status === "ok" ? "Flashed OK. Thank you." : status !== "idle" && status !== "sending" ? status : ""}
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* ground pour + footer */}
      <div className="h-6 bg-[repeating-linear-gradient(45deg,color-mix(in_srgb,var(--on-signal)_55%,transparent)_0_1px,transparent_1px_9px)]" />
      <div className="flex flex-col gap-2 border-t border-ink px-6 py-5 md:flex-row md:justify-between md:px-14">
        <span className="silk !text-ink">© {new Date().getFullYear()} Omar Alibi · Tunis, TN</span>
        <span className="silk !text-ink">All rights reserved</span>
      </div>
    </section>
  )
}
