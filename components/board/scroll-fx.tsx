"use client"
import { useEffect } from "react"

/** Adds .in to every .sr element as it enters the viewport. */
export function ScrollFX() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 })
    const scan = () => document.querySelectorAll(".sr:not(.in)").forEach((el) => io.observe(el))
    scan(); const t = setTimeout(scan, 800)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [])
  return null
}
