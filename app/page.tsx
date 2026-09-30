"use client"

import { useThemeSwitcher } from "@/hooks/use-theme-switcher"
import { HeroSection } from "@/components/hero-section"
import { ProfileSection } from "@/components/profile-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import { LogoLoop } from "@/components/LogoLoop"
import {SiQt, SiReact,SiLinux,SiElectron,SiGrafana,SiJavascript,SiMongodb,SiPytorch,SiNodedotjs,SiMqtt,SiMysql,SiAdobeaftereffects ,SiNextdotjs, SiTypescript, SiHtml5,SiTailwindcss,SiAdobephotoshop,SiAdobeillustrator,SiAdobepremierepro,SiArduino, SiAnaconda,SiPython,SiCplusplus,SiC,SiRust,SiStmicroelectronics, SiGit,SiDocker,SiRaspberrypi } from 'react-icons/si';
import Image from "next/image"

const techLogos = [
  { node: <SiReact />, title: "React" },
  { node: <SiHtml5 />, title: "HTML5" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
  { node: <SiNextdotjs />, title: "Next.js"},
  { node: <SiJavascript />, title: "JavaScript" },
  { node: <SiTypescript />, title: "TypeScript"},
  { node: <SiNodedotjs />, title: "Node.js" },
  { node: <SiElectron />, title: "Electron" },
  { node: <SiArduino />, title: "Arduino" },
  { node: <SiStmicroelectronics />, title: "STM32" },
  { node: <SiRaspberrypi />, title: "Raspberry Pi" },
      { src: "/icons/vivado.svg", alt: "Vivado" },
  {node:<SiLinux/>, title:"LinusOs"},
      { src: "/icons/freertos.svg", alt: "FreeRtos" },
  { node: <SiAnaconda />, title: "Anaconda" },
    { src: "/icons/matlab.svg", alt: "MATLAB" },
  { node: <SiPytorch />, title: "PyTorch" },
  { node: <SiPython />, title: "Python" },
  { node: <SiCplusplus />, title: "C++" },
  { src: "/icons/c.svg", alt: "C" },
    { node: <SiRust />, title: "Rust" },
  { node: <SiQt />, title: "Qt" },
  { node: <SiGit />, title: "Git" },
  { node: <SiDocker />, title: "Docker" },
  { node: <SiMongodb />, title: "Mongodb" },
  { node: <SiMysql />, title: "MySQL" },
  { node: <SiGrafana />, title: "Grafana" },
  { node: <SiMqtt />, title: "MQTT" },
  { node: <SiAdobephotoshop />, title: "Photoshop" },
  { node: <SiAdobeillustrator />, title: "Illustrator" },
  { node: <SiAdobepremierepro />, title: "Premiere Pro" },
  { node: <SiAdobeaftereffects />, title: "After Effects" },
  { src: "/icons/questasim.svg", alt: "QuestaSim" },
    { src: "/icons/ltspice.svg", alt: "LTSpice" },
    { src: "/icons/eaglepcb.svg", alt: "EaglePCB" },
    
];

export default function HomePage() {
  const { persona, togglePersona } = useThemeSwitcher()

  if (persona === "freelancer")
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="mono-label">Creative mode</p>
        <h2 className="max-w-3xl text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
          Too creative to show. Yet.
        </h2>
        <p className="max-w-md text-muted-foreground">The creative portfolio is being refined with pixel-perfect precision.</p>
        <button onClick={togglePersona} className="btn-solid">← Back to engineer mode</button>
      </div>
    )

  return (
    <div className="relative bg-background ">
      <HeroSection persona={persona} onTogglePersona={togglePersona} />

      <LogoLoop logos={techLogos} speed={50} direction="left" logoHeight={28} gap={48} scaleOnHover fadeOut
        fadeOutColor="#0a0a0a" ariaLabel="Tech stack" className="border-y border-border py-6 text-foreground/70" />
      <ProfileSection persona={persona} />
      <ProjectsSection persona={persona} />
      <ContactSection persona={persona} />
    </div>
  )
}
