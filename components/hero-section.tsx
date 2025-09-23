"use client"

import type { PersonaType } from "@/hooks/use-theme-switcher"
import { Button } from "@/components/ui/button"
import { ArrowDown, GraduationCap,Github, Linkedin, Mail, FileText,    Code, Cpu, Download } from "lucide-react"
import { useEffect, useState } from "react"
import Image from 'next/image'
import LightRays from '@/components/LightRays';
import ShinyText from './ShinyText';
import me from '../public/meWhenThe.png';
import he from '../public/meWhenNo.png';

interface HeroSectionProps {
  persona: PersonaType
  onTogglePersona: () => void
}
function IntegratedPersonaSwitcher({ persona, onToggle }: { persona: PersonaType; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-center  ">
      <div className="backdrop-blur-md h-28 bg-white/10 border border-white/20 rounded-3xl px-5 py-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="text-center mb-2">
          <p className="text-xs font-semibold text-white/70 tracking-wider uppercase">Mode</p>
        </div>

        {/* Clean switch */}
        <div className="relative w-20 h-8 bg-black/20 rounded-2xl p-2 border border-white/10">
          <button
            onClick={onToggle}
            className={`absolute top-1 w-6 h-6 rounded-xl transition-all duration-500 ease-out flex items-center justify-center transform hover:scale-105 ${
              persona === "engineer" ? "left-2" : "right-2"
            } bg-white/15 hover:bg-white/25 border border-white/20 shadow-lg`}
          >
            {persona === "engineer" ? (
              <Cpu className="w-3 h-3 text-white" />
            ) : (
              <Code className="w-3 h-3 text-white" />
            )}
          </button>
        </div>

        <div className="flex justify-between text-[8px] font-normal mt-4 px-2">
          <span className={`transition-all duration-300 ${
            persona === "engineer" ? "text-white" : "text-white/40"
          }`}>
            ENGINEER
          </span>
          <span className={`transition-all duration-300 ${
            persona === "freelancer" ? "text-white" : "text-white/40"
          }`}>
            ARTIST
          </span>
        </div>
      </div>
    </div>
  );
}



export function HeroSection({ persona, onTogglePersona }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const engineerContent = {
    name: "Omar Alibi",
    age: "23",
    title: "Electrical Engineer",
    subtitle: "Advanced Reconfigurable and Real-Time Microelectronic Systems",
    description:
      "Specialized in cutting-edge microelectronics design and real-time signal processing systems. I develop high-performance embedded solutions, FPGA implementations, and advanced control systems for next-generation electronic applications.",
    cta: "View Engineering Projects",
        education: "ENIT - École Nationale d'Ingénieurs de Tunis",

    skills: [
      "Microelectronics Design", 
      "IoT & Industry 4.0", 
      "FPGA Development", 
      "Embedded C/C++", 
      "Real-Time Systems",
      "PCB Design & Simulation",
      "Machine Learning"
    ],
    icon: Cpu,
  }

  const freelancerContent = {
    name: "Omar Alibi",
    age: "23",
    title: "Creative Freelancer",
        education: "Engineering Background + Creative Expertise",

    subtitle: "Full-Stack Development • Digital Design • Brand Strategy",
    description:
      "Bringing technical precision to creative work. I combine my engineering background with artistic vision to create stunning visual identities, engaging video content, and cutting-edge web experiences that stand out in the digital landscape.",
    cta: "View Creative Portfolio",
    skills: ["Graphic Design", "Video Editing", "Web Development", "UI/UX Design", "Brand Identity"],
    icon: Code,
  }

  const content = persona === "engineer" ? engineerContent : freelancerContent

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 theme-transition relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden ">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div
    className={`fixed m-10 z-10 self-center sm:self-auto transition-all duration-1000 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}
  >
  </div>

  <div className="inset-0 w-full absolute pointer-events-none">
    <LightRays
      raysOrigin="top-left"
      raysColor={persona === "engineer" ? "#00ffff" : "#ff00ff"}
      raysSpeed={1.5}
      lightSpread={0.8}
      rayLength={3}
      followMouse={true}
      mobileOptimized={true}
      mouseInfluence={0.5}
      noiseAmount={0.3}
      distortion={0.01}
    />
  </div>
</div>
</div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
       

        <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-16 items-center py-5">
          {/* Left Column - Content */}
          <div
            className={`space-y-6 sm:space-y-8 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3">

                <div className="space-y-3">
                <div className="flex  gap-2 sm:gap-4 text-xs sm:text-sm text-white/50 font-medium">
                  
                  <ShinyText 
                    text={`${content.age} YEARS OLD`}
                    disabled={false} 
                    speed={1.8} 
                    className='inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full w-fit' 
                  />
                 
                    <ShinyText 
                      text="AVAILABLE FOR WORK"
                      disabled={false} 
                      speed={1.8} 
                      className='inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full w-fit' 
                    />
                
                </div>
                
                {/* Name with Switcher - Responsive Layout */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-balance leading-tight text-white ">
                    {content.name}
                  </h1>
                  
                  
                

              </div>

              </div>
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white/80">{content.title}</h2>
                <p className="text-lg sm:text-xl text-white/50 font-medium text-pretty">{content.subtitle}</p>
                 <div className="flex items-center gap-2 text-white/60">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm font-medium">{content.education}</span>
                  </div>
              </div>
            </div>

            <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-2xl text-pretty">
              {content.description}
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {content.skills.map((skill, index) => (
                <span
                  key={skill}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  
                  <ShinyText
                    text={`${skill}`}
                    disabled={false}
                    speed={2}
                    className='px-4 sm:px-6 py-2 sm:py-3 glass-card text-white/50 rounded-full text-xs sm:text-sm font-semibold hover-lift transition-all duration-300'
                  />
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
              onClick={() => document.querySelector('#projects-section')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
                className="text-base sm:text-lg px-6 text-white/75 sm:px-10 py-4 sm:py-7 glass-button hover-lift transition-all duration-300 w-full sm:w-auto border-0"
              >
                {content.cta}
                <ArrowDown className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
              onClick={() => window.open('/Omar_Alibi_Resume.pdf', 'download')}
                size="lg"
                className="text-base sm:text-lg px-6 text-white/50 sm:px-10 py-4 sm:py-7 glass-button hover-lift transition-all duration-300 w-full sm:w-auto"
              >
                <FileText className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                <ShinyText
                  text="Download Resume"
                  disabled={false}
                  speed={1}
                />
              </Button>
            </div>

           
          </div>

          {/* Right Column - Glass Profile Section */}
          <div
            className={`lg:scale-150 scale-125 z-10 relative h-auto sm:h-auto lg:h-[600px] order-first lg:order-last transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            
            <div className="relative w-full h-full flex flex-col items-center justify-center space-y-8">

          <div className="relative -mb-5">
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-96 lg:h-96 ">
                  <Image src={persona === "engineer" ?me:he} alt="Profile Picture" layout="fill" objectFit="cover"  />
              </div>
            
            {/* Floating accent element */}
            <div className="absolute top-4  -left-4 scale-50 lg:scale-75 rounded-2xl flex items-center justify-center animate-float">
                                  <IntegratedPersonaSwitcher persona={persona} onToggle={onTogglePersona} />

            </div>
          </div>
         <div className="flex gap-4 justify-center z-20">
              {[
                { icon: Github, href: "https://github.com/omaralibi", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com/in/omar-alibi", label: "LinkedIn" },
                { icon: Mail, href: "mailto:omar.alibi@etudiant-enit.utm.tn", label: "Email" }
              ].map(({ icon: Icon, href, label }, index) => (
                <Button
                  key={index}
                  size="icon"
                  onClick={() => window.open(href, '_blank')}
                  className="w-7 h-7 text-white/70 hover:text-white glass-button hover-lift transition-all duration-300 hover:scale-110 rounded-2xl"
                  aria-label={label}
                >
                  <Icon className="w-6 h-6" />
                </Button>
              ))}
            </div>
            <div className="scale-50 grid grid-cols-1 gap-4 w-full max-w-sm -mt-10">
              <div className="glass-card p-4 rounded-2xl text-center hover-lift transition-all duration-300">
                <div className="text-2xl font-bold text-white mb-1">
                  {persona === "engineer" ? "Current Focus" : "Specializing In"}
                </div>
                <div className="text-sm text-white/70">
                  {persona === "engineer" ? "Embedded Systems & IoT Systems" : "Branding & Visual Identity"}
                </div>
              </div>
            </div>
    </div>
          </div>
        </div>

      </div>
    </section>
  )
}
