"use client"

import type { PersonaType } from "@/hooks/use-theme-switcher"
import { Card, CardContent } from "@/components/ui/card"

interface AboutSectionProps {
  persona: PersonaType
}

export function AboutSection({ persona }: AboutSectionProps) {
  const engineerContent = {
    title: "About",
    sections: [
      {
        title: "Experience",
        items: [
          "Engineering Intern at OnWire Link - Smart Switch Systems",
          "Founder & Manager at ASHE - Artisanal Products Brand", 
          "Freelancer at ALIBI STUDIO - Visual Identity & Web Development",
          "Community Manager at AQUALIGHT CLUB - Digital Strategy",
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
          "Complete Visual Identity Design for 10+ Local Businesses",
          "Custom Website Development with E-commerce Integration",
          "Digital Marketing Materials & Multi-channel Support",
          "Brand Strategy & Creative Direction",
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

        <div className="grid md:grid-cols-2 gap-8">
          {content.sections.map((section, index) => (
            <Card key={index} className="theme-transition">
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