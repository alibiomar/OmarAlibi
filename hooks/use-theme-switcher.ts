"use client"

import { useState, useEffect } from "react"

export type PersonaType = "engineer" | "freelancer"

export function useThemeSwitcher() {
  const [persona, setPersona] = useState<PersonaType>("engineer")

  const togglePersona = () => {
    setPersona((prev) => (prev === "engineer" ? "freelancer" : "engineer"))
  }

  return { persona, togglePersona }
}
