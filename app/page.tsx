"use client"

import { useThemeSwitcher } from "@/hooks/use-theme-switcher"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import {LogoLoop} from '@/components/LogoLoop';

import {SiQt, SiReact,SiLinux,SiElectron,SiGrafana,SiJavascript,SiMongodb,SiPytorch,SiNodedotjs,SiMqtt,SiMysql,SiAdobeaftereffects ,SiNextdotjs, SiTypescript, SiHtml5,SiTailwindcss,SiAdobephotoshop,SiAdobeillustrator,SiAdobepremierepro,SiArduino, SiAnaconda,SiPython,SiCplusplus,SiC,SiRust,SiStmicroelectronics, SiGit,SiDocker,SiRaspberrypi } from 'react-icons/si';

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

  return (
    <div className="min-h-screen theme-transition relative overflow-hidden">
       
      <HeroSection persona={persona} onTogglePersona={togglePersona} />
            <LogoLoop
        logos={techLogos}
        speed={120}
        direction="left"
        logoHeight={48}
        gap={40}
        scaleOnHover
        pauseOnHover={false}
        fadeOut
                className="p-10 bg-trasparent my-10 absolute w-full z-50"

        fadeOutColor="#000000"
        ariaLabel="Technology partners"
      />
      <AboutSection persona={persona} />

      <ProjectsSection persona={persona} />
      <ContactSection persona={persona} />
    </div>
  )
}
