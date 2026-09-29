"use client"
import type { PersonaType } from "@/hooks/use-theme-switcher"
import { useState } from "react"
import { z } from "zod"

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

export function ContactSection({ persona }: { persona: PersonaType }) {
  const [f, setF] = useState<F>(empty)
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | string>("idle")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = schema.safeParse(f)
    if (!r.success) return setStatus(r.error.issues[0].message)
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...r.data, persona }) })
      if (!res.ok) throw new Error((await res.json()).message || "Failed to send")
      setF(empty); setStatus("ok")
    } catch (err) { setStatus(err instanceof Error ? err.message : "Failed to send") }
  }

  const line = "w-full border-b border-foreground/40 bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted-foreground focus:border-accent-brand"

  return (
    <section id="contact" className="bg-foreground px-6 py-32 text-background md:px-12">
      <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-2">
        <div>
          <p className="mono-label !text-background/60">(03) Contact</p>
          <a href="mailto:omar.alibi@etudiant-enit.utm.tn" data-hot
            className="mt-8 block text-[clamp(3rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.055em] transition-colors hover:text-accent-brand">
            Let’s build<br />something ↗
          </a>
        </div>
        <form onSubmit={submit} className="grid content-end gap-6 sm:grid-cols-2">
          {fields.map(([k, label]) => (
            <input key={k} aria-label={label} placeholder={label} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}
              className={`${line} ${k === "subject" || k === "email" ? "sm:col-span-2" : ""}`} />
          ))}
          <textarea aria-label="Message" placeholder="Message" rows={4} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={`${line} resize-none sm:col-span-2`} />
          <div className="flex items-center justify-between gap-4 sm:col-span-2">
            <button disabled={status === "sending"} className="rounded-full bg-accent-brand px-7 py-3.5 font-medium text-[#0e0e0d] transition-transform hover:scale-105 disabled:opacity-50">
              {status === "sending" ? "Sending…" : "Send message ↗"}
            </button>
            <p role="status" className="mono-label !text-background/70">
              {status === "ok" ? "Sent. Thank you." : status !== "idle" && status !== "sending" ? status : ""}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
