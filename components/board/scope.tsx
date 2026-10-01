"use client"
import { useEffect, useRef } from "react"
import { THEME_EVENT, rgba, themeColors } from "@/lib/theme-colors"

/** Oscilloscope strip: a PWM-ish wave whose duty cycle drifts, sped up by scroll velocity. */
export function Scope() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext("2d")!
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    let col = themeColors(); const recolor = () => { col = themeColors() }
    let w = 0, h = 0, dpr = 1, off = 0, raf = 0, vis = true, last = performance.now(), sy = scrollY, boost = 0
    const size = () => { const b = cv.getBoundingClientRect(); w = b.width; h = b.height; dpr = Math.min(devicePixelRatio || 1, 2); cv.width = w * dpr; cv.height = h * dpr }
    const frame = (n: number) => {
      const dt = Math.min(0.05, (n - last) / 1000); last = n
      const v = Math.abs(scrollY - sy) / Math.max(dt, 0.001); sy = scrollY
      boost += (Math.min(v / 40, 4) - boost) * 0.1
      if (!vis) { raf = requestAnimationFrame(frame); return }
      off += (60 + boost * 90) * dt
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = rgba(col.gold, 0.16); ctx.lineWidth = 1; ctx.beginPath()
      for (let x = 0; x < w; x += 48) { ctx.moveTo(x, 0); ctx.lineTo(x, h) }
      for (let y = 0; y <= h; y += h / 4) { ctx.moveTo(0, y); ctx.lineTo(w, y) }
      ctx.stroke()
      const t = n / 1000, mid = h / 2, amp = h * 0.32, period = 120
      // CH2: analog carrier
      ctx.beginPath(); ctx.strokeStyle = rgba(col.led, 0.7); ctx.lineWidth = 1.2
      for (let x = 0; x <= w; x += 3) { const y = mid + Math.sin((x + off * 1.4) / 22) * h * 0.1 + Math.sin((x + off) / 7) * h * 0.02; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }
      ctx.stroke()
      // CH1: PWM whose duty drifts
      ctx.beginPath(); ctx.strokeStyle = col.signal; ctx.lineWidth = 2; ctx.shadowColor = col.signal; ctx.shadowBlur = 10
      for (let x = 0; x <= w; x += 2) {
        const s = Math.sin(((x + off) / period) * Math.PI * 2) + 0.7 * Math.sin(t * 0.7)
        const y = mid - Math.tanh(7 * s) * amp
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      }
      ctx.stroke(); ctx.shadowBlur = 0
      raf = requestAnimationFrame(frame)
    }
    size(); addEventListener(THEME_EVENT, recolor); const ro = new ResizeObserver(size); ro.observe(cv)
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting)); io.observe(cv)
    if (reduced) { frame(performance.now()); cancelAnimationFrame(raf) } else raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener(THEME_EVENT, recolor) }
  }, [])
  return <canvas ref={ref} aria-hidden className="block h-full w-full" />
}
