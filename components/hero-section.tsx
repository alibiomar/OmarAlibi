"use client"

import type { PersonaType } from "@/hooks/use-theme-switcher"
import { Button } from "@/components/ui/button"
import { ArrowDown, GraduationCap,Github, Linkedin, Mail, FileText,    Code, Cpu, Download } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Image from 'next/image'
import LightRays from '@/components/LightRays';
import ShinyText from './ShinyText';
import me from '../public/meWhenThe.png';
import he from '../public/meWhenNo.png';
import { gsap } from "gsap"

interface HeroSectionProps {
  persona: PersonaType
  onTogglePersona: () => void
}
function IntegratedPersonaSwitcher({ persona, onToggle }: { persona: PersonaType; onToggle: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const lastMoveTime = useRef(0);
  const lastPosition = useRef(0);

  const SLIDER_WIDTH = 80; // 20rem = 80px
  const BUTTON_WIDTH = 24; // 6rem = 24px
  const PADDING = 4; // 1rem = 4px (top-1)
  const MAX_OFFSET = SLIDER_WIDTH - BUTTON_WIDTH - PADDING ;

  const handleStart = (clientX: number) => {
    if (!sliderRef.current) return;
    
    setIsDragging(true);
    setVelocity(0);
    
    const rect = sliderRef.current.getBoundingClientRect();
    const currentPos = persona === "engineer" ? PADDING : MAX_OFFSET;
    const clickOffset = clientX - rect.left - currentPos - (BUTTON_WIDTH / 2);
    
    lastMoveTime.current = Date.now();
    lastPosition.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left - (BUTTON_WIDTH / 2);
    const clampedOffset = Math.max(PADDING, Math.min(relativeX, MAX_OFFSET));
    
    // Calculate velocity for momentum
    const now = Date.now();
    const timeDelta = now - lastMoveTime.current;
    if (timeDelta > 0) {
      const positionDelta = clientX - lastPosition.current;
      setVelocity(positionDelta / timeDelta);
    }
    
    setDragOffset(clampedOffset);
    lastMoveTime.current = now;
    lastPosition.current = clientX;
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const centerPoint = MAX_OFFSET / 2;
    const currentOffset = dragOffset;
    const velocityThreshold = 0.5;
    
    // Consider both position and velocity for more natural feel
    let shouldToggle = false;
    
    if (Math.abs(velocity) > velocityThreshold) {
      // Fast swipe - use velocity direction
      shouldToggle = (persona === "engineer" && velocity > 0) || 
                     (persona === "freelancer" && velocity < 0);
    } else {
      // Slow drag - use position
      shouldToggle = (persona === "engineer" && currentOffset > centerPoint) ||
                     (persona === "freelancer" && currentOffset < centerPoint);
    }
    
    if (shouldToggle) {
      onToggle();
    }
    
    setIsDragging(false);
    //setDragOffset(0);
    setVelocity(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };


  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleStart(e.touches[0].clientX);
  };

  // Global event listeners for smooth dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    const handleGlobalEnd = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      handleEnd();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalEnd);
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalEnd);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, dragOffset]);

  const getButtonPosition = () => {
    if (isDragging) {
      return `${dragOffset}px`;
    }
    return persona === "engineer" ? `${PADDING}px` : `${MAX_OFFSET}px`;
  };

  const getBackgroundGradient = () => {
    const progress = isDragging 
      ? (dragOffset - PADDING) / (MAX_OFFSET - PADDING)
      : persona === "engineer" ? 0 : 1;
    
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const opacity = 0.1 + (clampedProgress * 0.2); // Subtle gradient change

    return `linear-gradient(${persona === "engineer" ? '270deg' : '90deg'}, 
      rgba(0, 0, 0, ${0.3 - clampedProgress * 0.1}) 0%, 
      rgba(255, 255, 255, ${opacity}) 100%)`;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl px-3 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
        <p className="text-xs font-semibold text-white/70 text-center tracking-wider uppercase mb-3">Mode</p>

        <div className="flex justify-between text-[8px] items-center gap-2 font-normal">
          <span className={`transition-all duration-500 ease-out select-none ${
            persona === "engineer" ? "text-white font-medium" : "text-white/40"
          }`}>
            ENGINEER
          </span>
          
          <div 
            ref={sliderRef}
            className="relative w-20 h-8 rounded-2xl border  border-foreground/30 select-none "
            style={{ 
              background: getBackgroundGradient(),
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Track glow effect */}
            <div 
              className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
                isDragging ? 'bg-white/15' : ''
              }`} 
            />
            
            {/* Sliding button */}
            <div
              className={`absolute top-1 w-6 h-6 rounded-xl flex z-50 items-center justify-center transform cursor-grab active:cursor-grabbing select-none ${
                isDragging 
                  ? 'transition-none scale-110 shadow-2xl bg-white/25 border border-white/30' 
                  : 'transition-all duration-700 ease-out hover:scale-105 bg-white/20 hover:bg-white/25 border border-white/20 shadow-lg'
              }`}
              style={{ 
                left: getButtonPosition(),
                filter: isDragging ? 'brightness(1.2)' : 'brightness(1)',
                backdropFilter: 'blur(8px)'
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className={`transition-all duration-300 ${isDragging ? 'scale-90' : ''}`}>
                {persona === "engineer" ? (
                  <Cpu className="w-3 h-3 text-white pointer-events-none drop-shadow-sm" />
                ) : (
                  <Code className="w-3 h-3 text-white pointer-events-none drop-shadow-sm" />
                )}
              </div>
            </div>
            
            {/* Subtle highlight track */}
            <div 
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
              style={{
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0.03) 50%, 
                  transparent 100%)`
              }}
            />
          </div>
          
          <span className={`transition-all duration-500 ease-out select-none ${
            persona === "freelancer" ? "text-white font-medium" : "text-white/40"
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
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Add delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!contentRef.current) return

      // Animate hero content on mount
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
        
        // Target elements within the contentRef scope
        const h1 = contentRef.current?.querySelector("h1")
        const h2 = contentRef.current?.querySelector("h2")
        const description = contentRef.current?.querySelector(".hero-description")
        const buttons = contentRef.current?.querySelectorAll(".hero-buttons > *")

        if (h1) {
          tl.from(h1, { 
            opacity: 0, 
            y: 50, 
            duration: 1,
            delay: 0.2
          })
        }

        if (h2) {
          tl.from(h2, { 
            opacity: 0, 
            y: 30, 
            duration: 0.8
          }, "-=0.6")
        }

        if (description) {
          tl.from(description, { 
            opacity: 0, 
            y: 20, 
            duration: 0.8
          }, "-=0.4")
        }

        if (buttons && buttons.length > 0) {
          tl.from(buttons, { 
            opacity: 0, 
            y: 20, 
            stagger: 0.1,
            duration: 0.6
          }, "-=0.4")
        }
      }, contentRef)

      // Animate skills with stagger
      if (skillsRef.current && skillsRef.current.children.length > 0) {
        gsap.from(skillsRef.current.children, {
          opacity: 0,
          scale: 0.8,
          y: 20,
          stagger: 0.05,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 1.2
        })
      }

      // Animate image on mount
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
          delay: 0.5
        })
      }

      return () => {
        if (ctx) ctx.revert()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [persona])

  const engineerContent = {
    name: "Omar Alibi",
    age: "23",
    title: "Electrical Engineer",
    subtitle: "Embedded Systems • Edge AI • Real-Time Control • IoT Solutions",
    description:
      "Building intelligent embedded systems from bare metal to cloud. Specialized in real-time control systems, edge AI deployment, RISC-V architecture, and industrial IoT platforms. From kernel modules to neural networks running on microcontrollers.",
    cta: "View Engineering Projects",
        education: "ENIT - École Nationale d'Ingénieurs de Tunis",

    skills: [
      "Real-Time Embedded Systems", 
      "Edge AI & TinyML", 
      "RISC-V & SoC Design", 
      "Industrial IoT", 
      "Linux Kernel Development",
      "STM32 & ARM Cortex",
      "Computer Vision"
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
    <section className="min-h-screen flex items-center bg-gradient-to-b from-[#0b213a] via-black/80 to-[#0F1114] md:bg-none justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 theme-transition relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="inset-0 w-full absolute" >
          <LightRays
            raysOrigin="top-center"
            raysColor={persona === "engineer" ?"#00ffff":"#ff004f"}
            raysSpeed={2}
            lightSpread={0.8}
            rayLength={10}
            followMouse={true}
            fadeDistance={1.5}
            mobileOptimized={true}
            mouseInfluence={0.3}
            noiseAmount={0.3}
            distortion={0.01}
            className="hidden md:block"
          />

        </div>
      </div>



      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-center py-5">
          
          {/* Left Column - Content */}
          <div ref={contentRef} className={`space-y-6 sm:space-y-8 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            
            {/* Top section with name and image (mobile/tablet) */}
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3">
                <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-white/50 font-medium">
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
                
                {/* Name with Image on mobile/tablet - Responsive Layout */}
                <div className="flex items-center gap-4 lg:block">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-balance leading-tight text-white flex-1">
                    {content.name}
                  </h1>
                </div>
              </div>
            </div>

            {/* Rest of content */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white/80">{content.title}</h2>
              <p className="text-lg sm:text-xl text-white/50 font-medium text-pretty">{content.subtitle}</p>
              <div className="flex items-center gap-2 text-white/60">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-medium">{content.education}</span>
              </div>
            </div>

            <p className="hero-description text-base sm:text-lg text-white/50 leading-relaxed max-w-2xl text-pretty">
              {content.description}
            </p>

            <div ref={skillsRef} className="flex flex-wrap gap-2 sm:gap-3">
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

            <div className="hero-buttons flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={() => document.querySelector('#projects-section')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                className="text-base sm:text-lg px-6 text-white/75 sm:px-10 py-4 sm:py-7 glass-button hover-lift transition-all duration-300 w-full sm:w-auto border-0"
              >
                {content.cta}
                <ArrowDown className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                onClick={() => window.open('/Omar_Alibi_Resume.pdf', '_blank')}
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

            {/* Social Links - Bottom on mobile, moved here */}
            <div className="flex  flex-col gap-10 pt-5 lg:hidden ">
                  <IntegratedPersonaSwitcher persona={persona} onToggle={onTogglePersona} />
                  <div className="flex gap-4 justify-center lg:justify-start z-20">
              {[
                { icon: Github, href: "https://github.com/alibiomar", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com/in/omar-alibi", label: "LinkedIn" },
                { icon: Mail, href: "mailto:omar.alibi@etudiant-enit.utm.tn", label: "Email" }
              ].map(({ icon: Icon, href, label }, index) => (
                <Button
                  key={index}
                  size="icon"
                  onClick={() => window.open(href, '_blank')}
                  className="w-10 h-10 text-white/70 hover:text-white glass-button hover-lift transition-all duration-300 hover:scale-110 rounded-2xl"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              ))}</div>
            </div>
          </div>

          {/* Right Column - Desktop Image and Content */}
          <div ref={imageRef} className={`lg:scale-150 scale-125 z-10 relative h-auto sm:h-auto lg:h-[600px] hidden lg:block transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="relative w-full h-full flex flex-col items-center justify-center space-y-8">
              
              <div className="relative -mb-5">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-96 lg:h-96">
                  <Image 
                    src={persona === "engineer" ? me : he} 
                    alt="Profile Picture" 
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Floating persona switcher - Desktop only */}
                <div className="absolute top-4 -left-4 scale-75 rounded-2xl flex items-center justify-center animate-float">
                  <IntegratedPersonaSwitcher persona={persona} onToggle={onTogglePersona} />
                </div>
              </div>

              {/* Desktop Social Links */}
              <div className="flex gap-4 justify-center z-20">
                {[
                  { icon: Github, href: "https://github.com/alibiomar", label: "GitHub" },
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

              {/* Desktop Info Card */}
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