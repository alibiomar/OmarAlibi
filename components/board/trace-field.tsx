"use client"
import { useEffect, useRef } from "react"
import { THEME_EVENT, rgba, themeColors } from "@/lib/theme-colors"

type Pt = { x: number; y: number }
type Trace = { pts: Pt[]; cum: number[]; total: number }

const G = 30 // routing grid
const DIRS: Pt[] = [ {x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1} ]

function rng(seed: number) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647 }

function build(w: number, h: number): Trace[] {
  const r = rng(20260930)
  const cols = Math.floor(w / G), rows = Math.floor(h / G)
  const out: Trace[] = []
  const count = Math.round((w * h) / 21000)
  for (let i = 0; i < count; i++) {
    let cx = Math.floor(r() * cols), cy = Math.floor(r() * rows)
    let dir = Math.floor(r() * 4) * 2 // start orthogonal
    const pts: Pt[] = [{ x: cx * G, y: cy * G }]
    const segs = 3 + Math.floor(r() * 6)
    for (let s = 0; s < segs; s++) {
      const len = 2 + Math.floor(r() * 7)
      const nx = cx + DIRS[dir].x * len, ny = cy + DIRS[dir].y * len
      if (nx < 0 || ny < 0 || nx > cols || ny > rows) break
      cx = nx; cy = ny
      pts.push({ x: cx * G, y: cy * G })
      dir = (dir + (r() < 0.5 ? 1 : 7)) % 8 // 45° turns only, like real routing
    }
    if (pts.length < 3) continue
    const cum = [0]
    for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y))
    out.push({ pts, cum, total: cum[cum.length - 1] })
  }
  return out
}

function at(t: Trace, d: number): Pt {
  d = Math.max(0, Math.min(t.total, d))
  for (let k = 1; k < t.cum.length; k++) if (d <= t.cum[k]) {
    const f = (d - t.cum[k - 1]) / (t.cum[k] - t.cum[k - 1] || 1)
    return { x: t.pts[k - 1].x + (t.pts[k].x - t.pts[k - 1].x) * f, y: t.pts[k - 1].y + (t.pts[k].y - t.pts[k - 1].y) * f }
  }
  return t.pts[t.pts.length - 1]
}

function paint(ctx: CanvasRenderingContext2D, traces: Trace[], trace: string, pad: string, fill: string) {
  ctx.lineJoin = "round"; ctx.lineCap = "round"
  ctx.strokeStyle = trace; ctx.lineWidth = 2.2
  for (const t of traces) {
    ctx.beginPath(); t.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke()
  }
  for (const t of traces) {
    const ends = [t.pts[0], t.pts[t.pts.length - 1]]
    for (const p of ends) {
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 7); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = pad; ctx.lineWidth = 1.6; ctx.stroke()
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 7); ctx.fillStyle = pad; ctx.fill()
    }
    for (let k = 1; k < t.pts.length - 1; k += 2) { // vias on some bends
      const p = t.pts[k]
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.4, 0, 7); ctx.strokeStyle = pad; ctx.lineWidth = 1.2; ctx.stroke()
    }
  }
}

export function TraceField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext("2d")!
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0, h = 0, dpr = 1, traces: Trace[] = []
    const dim = document.createElement("canvas"), lit = document.createElement("canvas"), tmp = document.createElement("canvas")
    let pulses: { t: Trace; d: number; v: number }[] = []
    const mouse = { x: -999, y: -999, tx: -999, ty: -999, r: 0, tr: 0 }
    let raf = 0, visible = true, last = performance.now()
    let sig = "#ff4d00"

    const setup = () => {
      const b = cv.getBoundingClientRect()
      w = b.width; h = b.height; dpr = Math.min(devicePixelRatio || 1, 2)
      for (const c of [cv, dim, lit]) { c.width = w * dpr; c.height = h * dpr }
      cv.style.width = w + "px"; cv.style.height = h + "px"
      traces = build(w, h)
      const th = themeColors(); sig = th.signal
      for (const [c, tr, pad, fill] of [
        [dim, th.wire, rgba(th.gold, 0.32), th.sub],
        [lit, rgba(th.gold, 0.95), th.gold, th.sub],
      ] as const) {
        const x = c.getContext("2d")!; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h); paint(x, traces, tr, pad, fill)
      }
      pulses = Array.from({ length: Math.min(traces.length, Math.round(w / 90)) }, () => spawn())
      draw(0)
    }
    const spawn = () => { const t = traces[Math.floor(Math.random() * traces.length)]; return { t, d: -Math.random() * 300, v: 90 + Math.random() * 130 } }

    const draw = (dt: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(dim, 0, 0, w, h)

      // probe glow: copper lights up under the pointer
      mouse.x += (mouse.tx - mouse.x) * 0.18; mouse.y += (mouse.ty - mouse.y) * 0.18; mouse.r += (mouse.tr - mouse.r) * 0.12
      const R = mouse.r
      if (R > 4) {
        const s = Math.ceil(R * 2 * dpr); tmp.width = s; tmp.height = s
        const t = tmp.getContext("2d")!
        t.drawImage(lit, (mouse.x - R) * dpr, (mouse.y - R) * dpr, 2 * R * dpr, 2 * R * dpr, 0, 0, s, s)
        t.globalCompositeOperation = "destination-in"
        const g = t.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
        g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(.55, "rgba(0,0,0,.7)"); g.addColorStop(1, "rgba(0,0,0,0)")
        t.fillStyle = g; t.fillRect(0, 0, s, s)
        ctx.drawImage(tmp, mouse.x - R, mouse.y - R, 2 * R, 2 * R)
      }

      // signal pulses
      ctx.lineCap = "round"; ctx.lineJoin = "round"
      for (const p of pulses) {
        p.d += p.v * dt
        if (p.d > p.t.total + 90) Object.assign(p, spawn())
        if (p.d < 0) continue
        for (let k = 0; k < 14; k++) {
          const a = at(p.t, p.d - k * 6), b = at(p.t, p.d - (k + 1) * 6)
          ctx.strokeStyle = rgba(sig, 1 - k / 14); ctx.lineWidth = 3.2 - k * 0.12
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
        }
        if (p.d <= p.t.total) {
          const h0 = at(p.t, p.d)
          ctx.beginPath(); ctx.arc(h0.x, h0.y, 9, 0, 7); ctx.fillStyle = rgba(sig, 0.25); ctx.fill()
          ctx.beginPath(); ctx.arc(h0.x, h0.y, 2.6, 0, 7); ctx.fillStyle = sig; ctx.fill()
        }
      }
    }

    const loop = (n: number) => {
      const dt = Math.min(0.05, (n - last) / 1000); last = n
      if (visible) draw(dt)
      raf = requestAnimationFrame(loop)
    }
    const onMove = (e: PointerEvent) => { const b = cv.getBoundingClientRect(); mouse.tx = e.clientX - b.left; mouse.ty = e.clientY - b.top; mouse.tr = 230 }
    const onLeave = () => { mouse.tr = 0 }

    setup()
    addEventListener(THEME_EVENT, setup)
    const ro = new ResizeObserver(setup); ro.observe(cv)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(cv)
    if (!reduced) { addEventListener("pointermove", onMove); document.addEventListener("pointerleave", onLeave); raf = requestAnimationFrame(loop) }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener(THEME_EVENT, setup); removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave) }
  }, [])

  return <canvas ref={ref} aria-hidden className={className} />
}
