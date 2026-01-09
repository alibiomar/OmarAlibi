"use client"

import { useThemeSwitcher } from "@/hooks/use-theme-switcher"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import {LogoLoop} from '@/components/LogoLoop'
import {SiQt, SiReact,SiLinux,SiElectron,SiGrafana,SiJavascript,SiMongodb,SiPytorch,SiNodedotjs,SiMqtt,SiMysql,SiAdobeaftereffects ,SiNextdotjs, SiTypescript, SiHtml5,SiTailwindcss,SiAdobephotoshop,SiAdobeillustrator,SiAdobepremierepro,SiArduino, SiAnaconda,SiPython,SiCplusplus,SiC,SiRust,SiStmicroelectronics, SiGit,SiDocker,SiRaspberrypi } from 'react-icons/si';
import Image from "next/image"
import GlassSurface from "@/components/GlassSurface"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

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
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const freelancerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Smooth scroll animations for each section
    sectionsRef.current.forEach((section, index) => {
      if (section) {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        )
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [persona])

  useEffect(() => {
    // Parallax effect for floating shapes in freelancer mode
    if (persona === "freelancer" && freelancerRef.current) {
      const shapes = freelancerRef.current.querySelectorAll('.animate-float')
      
      shapes.forEach((shape, index) => {
        gsap.to(shape, {
          y: `${(index + 1) * 20}`,
          rotation: index % 2 === 0 ? 360 : -360,
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2
        })
      })
    }
  }, [persona])

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  return (
    <div>
      
      {persona === "freelancer" ? (
        <div ref={freelancerRef} className="min-h-screen flex flex-col items-center justify-center px-4 relative  overflow-hidden">
          {/* Floating geometric shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-20 left-10 w-32 h-32 border border-purple-500/50 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
            <div className="absolute bottom-32 right-20 w-24 h-24 border border-pink-500/50 rotate-45 animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-blue-500/50 rotate-6 animate-float" style={{animationDelay: '2s'}}></div>
                        <div className="absolute top-1/3 left-1/4 w-16 h-16 border border-blue-500/50 rotate-12 animate-float" style={{animationDelay: '2s'}}></div>
            
                        <div className="absolute top-2 right-1 w-32 h-32 border border-purple-500/50 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-2 left-40 w-24 h-24 border border-pink-500/50 rotate-45 animate-float" style={{animationDelay: '1s'}}></div>

          </div>

          <div className="max-w-3xl text-center space-y-8 animate-fade-in-up  relative z-10 inset-0 py-20">


            {/* Main heading with liquid chrome effect */}
            <div className="relative inline-block">
                <Image src="/toocreativetoshow.webp" alt="Main Heading" width={500} height={100} className="-mb-14" />
                <div className="w-full flex justify-center">

                    <button
                      onClick={togglePersona}
                    className="glass-button cursor-pointer group px-6 py-4 text-white/70 hover:text-white transition-all duration-300 rounded-2xl"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                      <span className="relative text-sm tracking-wide">← Back to Engineer Mode</span>
                    </button>
                </div>
            </div>
            {/* Divider line */}
            <div className="flex items-center justify-center gap-3 ">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="h-1 w-1 rounded-full bg-white/50"></div>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide">
              Content can't be loaded due to high quality
            </p>

            {/* Small text */}
            <p className="text-sm text-white/40 italic font-light max-w-md mx-auto leading-relaxed">
              The creative portfolio is currently being refined with pixel-perfect precision
            </p>
          </div>

        </div>


      ) : (
    <div className="min-h-screen theme-transition relative overflow-hidden bg-background">

       
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
      className=" backdrop-blur-sm  fixed top-0 w-full z-30 bg-background"
      fadeOutColor="#010202"
      ariaLabel="Technology partners"
      />
          <div ref={addToRefs}>
            <AboutSection persona={persona} />
          </div>
          <div ref={addToRefs}>
            <ProjectsSection persona={persona} />
          </div>
          <div ref={addToRefs}>
            <ContactSection persona={persona} />
          </div>
      
    </div>
      )}
    </div>
  )
}
