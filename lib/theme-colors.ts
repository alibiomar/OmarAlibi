export type ThemeColors = { sub: string; wire: string; gold: string; signal: string; led: string }

/** Reads the active theme's palette from CSS variables so canvases follow the theme. */
export function themeColors(): ThemeColors {
  const cs = getComputedStyle(document.documentElement)
  const g = (n: string) => cs.getPropertyValue(n).trim() || "#888888"
  return { sub: g("--sub"), wire: g("--wire"), gold: g("--gold"), signal: g("--signal"), led: g("--led") }
}

export function rgba(hex: string, a: number) {
  const h = hex.replace("#", "")
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

export const THEME_EVENT = "oa-theme"
