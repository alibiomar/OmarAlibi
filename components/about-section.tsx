"use client"

import type { PersonaType } from "@/hooks/use-theme-switcher"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface AboutSectionProps {
  persona: PersonaType
}

export function AboutSection({ persona }: AboutSectionProps) {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardsRef.current) return

    const cards = cardsRef.current.querySelectorAll('.about-card')
    
    gsap.fromTo(
      cards,
      { opacity: 0, y: 60, rotateX: -15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    )

    // Animate list items within cards
    cards.forEach((card) => {
      const items = card.querySelectorAll('li')
      gsap.fromTo(
        items,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [persona])
  const engineerContent = {
    title: "About",
    sections: [
      {
        title: "Experience",
        items: [
          "Engineering Intern at OnWire Link - IoT Firmware & Mobile App Development",
          "Real-Time Embedded Systems - BeagleBone, STM32, RISC-V SoC Design",
          "Edge AI & Machine Learning - TensorFlow Lite, TensorRT on Jetson Nano",
          "Industrial IoT - MQTT, Firebase, Real-time Dashboards & Automation",
        ],
      },
      {
        title: "Education",
        items: [
          "Electrical Engineering Student - ENIT (École Nationale d'Ingénieurs de Tunis)",
          "Preparatory Institute for Engineering Studies El Manar",
          "Baccalauréat in Technical Sciences - Mention Très Bien (17.43/20)",
          "OpusLab Frontend Development Certification",
        ],
      },
    ],
  }

  const freelancerContent = {
    title: "Information",
    sections: [
      {
        title: "Services",
        items: [
          "Full-Stack Web Development - Next.js, React, E-commerce Platforms",
          "Visual Identity Design for 15+ Businesses & Brands",
          "Complete Branding Packages - Hospitality, Cosmetics, Education",
          "Digital Marketing Materials & Multi-channel Support",
        ],
      },
      {
        title: "Creative Tools",
        items: [
          "Design: Photoshop, Illustrator, After Effects, Premiere Pro",
          "Web Development: React, NextJS, HTML/CSS, JavaScript",
          "Backend: Node.js, Python, Firebase, Supabase",
          "Additional: LaTeX, Microsoft Office, SolidWorks",
        ],
      },
    ],
  }


  const content = persona === "engineer" ? engineerContent : freelancerContent

  return (
    <section id="about" className="py-20 px-6 theme-transition">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">{content.title}</h2>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-8">
          {content.sections.map((section, index) => (
            <Card key={index} className="about-card theme-transition">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-primary">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}