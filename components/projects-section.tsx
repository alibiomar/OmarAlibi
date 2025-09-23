"use client"

import type { PersonaType } from "@/hooks/use-theme-switcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Eye, ChevronDown } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"

interface ProjectsSectionProps {
  persona: PersonaType
}

function useLazyLoading() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setLoadedImages((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    return () => observerRef.current?.disconnect()
  }, [])

  const observeElement = (element: HTMLElement | null, index: number) => {
    if (element && observerRef.current) {
      element.setAttribute("data-index", index.toString())
      observerRef.current.observe(element)
    }
  }

  return { loadedImages, observeElement }
}

export function ProjectsSection({ persona }: ProjectsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const { loadedImages, observeElement } = useLazyLoading()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("projects-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const engineerProjects = [
    {
      title: "Industrial Power Distribution System",
      description:
        "Designed and implemented a 480V power distribution system for a 50,000 sq ft manufacturing facility, including load calculations, panel schedules, and protective device coordination.",
      technologies: ["AutoCAD", "ETAP", "NEC Compliance", "Load Analysis"],
      category: "Power Systems",
      year: "2024",
      status: "Completed",
      image: "/industrial-power-distribution-electrical-panel-sys.jpg",
      featured: true,
    },
    {
      title: "Solar Microgrid Integration",
      description:
        "Developed a 2MW solar microgrid system with battery storage for a commercial campus, including grid-tie capabilities and islanding protection systems.",
      technologies: ["PVsyst", "HOMER", "IEEE 1547", "SCADA"],
      category: "Renewable Energy",
      year: "2023",
      status: "In Progress",
      image: "/solar-microgrid-battery-storage-system.jpg",
      featured: true,
    },
    {
      title: "Motor Control Center Upgrade",
      description:
        "Modernized legacy motor control systems with VFDs and smart monitoring capabilities, resulting in 30% energy savings and improved reliability.",
      technologies: ["Allen-Bradley", "VFD Programming", "HMI Design", "Ethernet/IP"],
      category: "Industrial Automation",
      year: "2023",
      status: "Completed",
      image: "/motor-control-center-vfd-industrial-automation.jpg",
      featured: false,
    },
    {
      title: "Emergency Power System Design",
      description:
        "Engineered backup power systems including diesel generators, UPS systems, and automatic transfer switches for critical healthcare facilities.",
      technologies: ["Generator Sizing", "UPS Design", "ATS Logic", "NFPA 99"],
      category: "Critical Systems",
      year: "2022",
      status: "Completed",
      image: "/emergency-power-generator-ups-healthcare-facility.jpg",
      featured: false,
    },
    {
      title: "Smart Grid Communication Network",
      description:
        "Implemented advanced metering infrastructure with real-time data collection and analysis for utility-scale smart grid deployment.",
      technologies: ["AMI", "RF Mesh", "Data Analytics", "Cybersecurity"],
      category: "Smart Grid",
      year: "2024",
      status: "In Progress",
      image: "/smart-grid-communication-network-ami-meters.jpg",
      featured: false,
    },
    {
      title: "High-Voltage Substation Design",
      description:
        "Complete electrical design for 138kV/13.8kV substation including protection schemes, control systems, and SCADA integration.",
      technologies: ["PSS/E", "Protection Coordination", "SCADA", "IEEE Standards"],
      category: "Power Systems",
      year: "2023",
      status: "Completed",
      image: "/high-voltage-electrical-substation-transformers.jpg",
      featured: false,
    },
  ]

  const freelancerProjects = [
    {
      title: "TechFlow SaaS Platform",
      description:
        "Complete brand identity and web application design for a project management SaaS. Created a modern, intuitive interface that increased user engagement by 40%.",
      technologies: ["React", "Next.js", "Figma", "Tailwind CSS"],
      category: "Web Development",
      year: "2024",
      status: "Live",
      link: "https://techflow.example.com",
      image: "/modern-saas-dashboard-interface-design.jpg",
      featured: true,
    },
    {
      title: "Artisan Coffee Co. Rebrand",
      description:
        "Full brand redesign including logo, packaging, and digital presence for a local coffee roastery. Developed cohesive visual identity across all touchpoints.",
      technologies: ["Adobe Creative Suite", "Brand Strategy", "Print Design", "Photography"],
      category: "Brand Identity",
      year: "2024",
      status: "Completed",
      image: "/coffee-brand-packaging-logo-design-artisan.jpg",
      featured: true,
    },
    {
      title: "EcoTech Mobile App",
      description:
        "UI/UX design for a sustainability tracking mobile app. Focused on gamification and user motivation to drive environmental consciousness.",
      technologies: ["Figma", "Prototyping", "User Research", "Design Systems"],
      category: "Mobile Design",
      year: "2023",
      status: "In Development",
      image: "/mobile-app-ui-sustainability-eco-green-design.jpg",
      featured: false,
    },
    {
      title: "Portfolio Website Collection",
      description:
        "Designed and developed custom portfolio websites for creative professionals, each with unique animations and interactive elements.",
      technologies: ["React", "Framer Motion", "GSAP", "Responsive Design"],
      category: "Web Development",
      year: "2023",
      status: "Multiple Live Sites",
      image: "/creative-portfolio-website-design-modern.jpg",
      featured: false,
    },
    {
      title: "Corporate Video Series",
      description:
        "Produced and edited a series of corporate training videos with motion graphics, resulting in 60% improvement in employee engagement.",
      technologies: ["After Effects", "Premiere Pro", "Motion Graphics", "Color Grading"],
      category: "Video Production",
      year: "2024",
      status: "Completed",
      image: "/corporate-video-production-motion-graphics.jpg",
      featured: false,
    },
    {
      title: "E-commerce Platform Design",
      description:
        "Complete UX/UI redesign of an e-commerce platform, focusing on conversion optimization and mobile-first approach.",
      technologies: ["Figma", "User Testing", "A/B Testing", "Conversion Optimization"],
      category: "E-commerce",
      year: "2023",
      status: "Live",
      image: "/ecommerce-website-design-mobile-shopping.jpg",
      featured: false,
    },
  ]

  const projects = persona === "engineer" ? engineerProjects : freelancerProjects
  const sectionTitle = persona === "engineer" ? "Engineering Projects" : "Creative Portfolio"
  const displayedProjects = showAll ? projects : projects.slice(0, 4)

  return (
    <section id="projects-section" className="py-20 px-6 theme-transition">
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-4xl font-bold mb-12 text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          {sectionTitle}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {displayedProjects.map((project, index) => (
            <Card
              key={index}
              className={`theme-transition hover-lift overflow-hidden group ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden bg-muted" ref={(el) => observeElement(el, index)}>
                {loadedImages.has(index) ? (
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 animate-pulse flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>

                {project.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className={`${persona === "engineer" ? "bg-blue-500" : "bg-green-500"} text-white`}>
                      Featured
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="mb-2">
                    {project.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{project.year}</span>
                </div>
                <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={project.status === "Completed" || project.status === "Live" ? "default" : "outline"}
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs hover-lift">
                      {tech}
                    </span>
                  ))}
                </div>

                {persona === "freelancer" && "link" in project && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover-lift bg-transparent">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live
                    </Button>
                    <Button variant="ghost" size="sm" className="hover-lift">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length > 4 && (
          <div className={`mt-12 text-center ${isVisible ? "animate-fade-in-up animate-delay-400" : "opacity-0"}`}>
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              size="lg"
              className="hover-lift transform hover:scale-105 transition-all duration-300"
            >
              {showAll ? "Show Less" : `View All ${projects.length} Projects`}
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        )}

        {persona === "engineer" && (
          <div className={`mt-12 text-center ${isVisible ? "animate-fade-in-up animate-delay-400" : "opacity-0"}`}>
            <Card className="max-w-2xl mx-auto theme-transition hover-lift">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">Professional Certifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2 pulse-glow">
                      <span className="text-primary font-bold">PE</span>
                    </div>
                    <p className="text-sm font-medium">Professional Engineer</p>
                    <p className="text-xs text-muted-foreground">California</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2 pulse-glow">
                      <span className="text-primary font-bold">CEM</span>
                    </div>
                    <p className="text-sm font-medium">Certified Energy Manager</p>
                    <p className="text-xs text-muted-foreground">AEE</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
