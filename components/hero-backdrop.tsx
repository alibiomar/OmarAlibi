"use client"
import dynamic from "next/dynamic"
import Aurora from "@/components/Aurora"

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false })
// Paste your Spline "Code → Public URL" (…/scene.splinecode) into .env.local
const SCENE = process.env.NEXT_PUBLIC_SPLINE_SCENE

export function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {SCENE ? (
        <Spline scene={SCENE} className="!absolute inset-0 !h-full !w-full opacity-90" />
      ) : (
        <Aurora colorStops={["#d6ff3f", "#1a1f0a", "#3a4a00"]} amplitude={0.9} blend={0.6} />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  )
}
