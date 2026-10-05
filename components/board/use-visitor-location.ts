"use client"
import { useEffect, useState } from "react"

export type VisitorClock = {
  /** HH:MM:SS in the visitor's own timezone */
  time: string
  /** Short timezone label, e.g. "CET", "GMT+1", "PST" */
  zone: string
  /** City guessed from the IANA timezone, e.g. "Africa/Tunis" -> "Tunis" */
  city: string
  /** "36.8065°N 10.1815°E" once the visitor grants geolocation, otherwise "" */
  coords: string
}

const EMPTY: VisitorClock = { time: "--:--:--", zone: "", city: "", coords: "" }

// one geolocation request shared by every component that uses the hook
let coordsPromise: Promise<string> | null = null
const requestCoords = (): Promise<string> => {
  if (!coordsPromise) {
    coordsPromise = new Promise((resolve) => {
      if (!("geolocation" in navigator)) return resolve("")
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve(`${fmtCoord(coords.latitude, "N", "S")} ${fmtCoord(coords.longitude, "E", "W")}`),
        () => resolve(""),
        { maximumAge: 3_600_000, timeout: 10000 },
      )
    })
  }
  return coordsPromise
}

const fmtCoord = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(4)}°${v >= 0 ? pos : neg}`

/**
 * Live clock + location for the person looking at the page.
 * - Timezone and city come from the browser instantly, no permission needed.
 * - Exact coordinates are added only if the visitor allows geolocation.
 * - Nothing is sent anywhere; it all stays in the browser.
 */
export function useVisitorLocation(): VisitorClock {
  const [state, setState] = useState<VisitorClock>(EMPTY)

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    const city = tz.includes("/") ? tz.split("/").pop()!.replace(/_/g, " ") : ""
    const clock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    const zoneFmt = new Intl.DateTimeFormat("en-GB", { timeZoneName: "short" })
    const tick = () => {
      const now = new Date()
      const zone = zoneFmt.formatToParts(now).find((p) => p.type === "timeZoneName")?.value ?? ""
      setState((s) => ({ ...s, time: clock.format(now), zone, city }))
    }
    tick()
    const id = setInterval(tick, 1000)

    let cancelled = false
    requestCoords().then((c) => { if (!cancelled && c) setState((st) => ({ ...st, coords: c })) })
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  return state
}
