"use client"

import type { PersonaType } from "@/hooks/use-theme-switcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Eye, ChevronDown, Calendar, MapPin, X } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import projectsData from "@/data/projects-data.json"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { createPortal } from "react-dom"

gsap.registerPlugin(ScrollTrigger)

interface ProjectsSectionProps {
  persona: PersonaType
}

interface Project {
  title: string
  description: string
  technologies: string[]
  category: string
  year: string
  status: string
  image: string
  featured: boolean
  company?: string
  client?: string
  link?: string
  technicalDetails?: string[]
  highlights?: string[]
}

interface Experience {
  company: string
  role: string
}

interface Client {
  name: string
  industry: string
}

interface ProjectData {
  sectionTitle: string
  description: string
  projects: Project[]
  skills?: {
    embedded: { title: string; description: string }
    web: { title: string; description: string }
    iot: { title: string; description: string }
  }
  academic?: {
    institution: string
    program: string
    fullName: string
    duration: string
    experience: Experience[]
  }
  services?: any
  stats?: {
    brandProjects: number | string
    webProjects: number | string
    recentClients: Client[]
  }
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { loadedImages, observeElement } = useLazyLoading()
  const projectsGridRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedProject])

  useEffect(() => {
    // Animate header
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }

    // Animate project cards
    if (projectsGridRef.current) {
      const cards = projectsGridRef.current.querySelectorAll('.project-card')
      
      gsap.fromTo(
        cards,
        { 
          opacity: 0, 
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: projectsGridRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [persona, showAll])

  // Get data for current persona
  const data: ProjectData = projectsData[persona]
  const displayedProjects = showAll ? data.projects : data.projects.slice(0, 4)

  const renderProjectDetailsContent = (project: Project) => {
    if (persona === "engineer" && project.technicalDetails) {
      return (
        <div>
          <h3 className="text-xl font-semibold mb-3">Technical Details</h3>
          <div className="bg-muted/50 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {project.technicalDetails.map((detail, index) => (
                <li key={index}>• {detail}</li>
              ))}
            </ul>
          </div>
        </div>
      )
    }

    if (persona === "freelancer" && project.highlights) {
      return (
        <div>
          <h3 className="text-xl font-semibold mb-3">Project Highlights</h3>
          <div className="bg-muted/50 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {project.highlights.map((highlight, index) => (
                <li key={index}>• {highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      )
    }

    return (
      <div>
        <h3 className="text-xl font-semibold mb-3">Project Details</h3>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            {persona === "engineer" 
              ? "Detailed technical specifications and implementation details available upon request."
              : "Custom design solutions tailored to client needs and industry requirements."
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <section id="projects-section" className="py-20 px-6 theme-transition">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef}>
          <h2 className={`text-4xl font-bold mb-4 text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            {data.sectionTitle}
          </h2>
          
          <p className={`text-center text-muted-foreground mb-12 max-w-3xl mx-auto ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            {data.description}
          </p>
        </div>

        <div ref={projectsGridRef} className="grid md:grid-cols-2 gap-8">
          {displayedProjects.map((project, index) => (
            <Card
              key={index}
              className={`project-card theme-transition hover-lift overflow-hidden group ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
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
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedProject(project)
                    }}
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

                {persona === "engineer" && project.company && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-black/20 text-white border-white/30 backdrop-blur-sm">
                      {project.company.includes("Personal") ? "Personal" : 
                       project.company.includes("Internship") ? "Internship" : project.company.includes("Academic") ? "Academic" : "Professional"
                       }
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="mb-2">
                    {project.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {project.year}
                  </div>
                </div>
                <CardTitle className="text-xl mb-2 leading-tight">{project.title}</CardTitle>
                
                {persona === "freelancer" && project.client && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    {project.client}
                  </div>
                )}
                
                {persona === "engineer" && project.company && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    {project.company}
                  </div>
                )}
                
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
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs hover-lift transition-colors hover:bg-primary/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {data.projects.length > 4 && (
          <div className={`mt-12 text-center ${isVisible ? "animate-fade-in-up animate-delay-400" : "opacity-0"}`}>
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              size="lg"
              className="hover-lift transform hover:scale-105 transition-all duration-300"
            >
              {showAll ? "Show Less" : `View All ${data.projects.length} Projects`}
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        )}

        {/* Engineer-specific additional sections */}
        {persona === "engineer" && data.skills && data.academic && (
          <div className={`mt-16 ${isVisible ? "animate-fade-in-up animate-delay-400" : "opacity-0"}`}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Technical Skills Highlight */}
              <Card className="theme-transition hover-lift">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-center">Core Technical Skills</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-primary">{data.skills.embedded.title}</h4>
                      <p className="text-sm text-muted-foreground">{data.skills.embedded.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-primary">{data.skills.web.title}</h4>
                      <p className="text-sm text-muted-foreground">{data.skills.web.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-primary">{data.skills.iot.title}</h4>
                      <p className="text-sm text-muted-foreground">{data.skills.iot.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic & Professional Info */}
              <Card className="theme-transition hover-lift">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-center">Academic Background</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto  flex items-center justify-center mb-3 pulse-glow">
                        <Image src="/enit.png" alt={data.academic.institution} width={96} height={96} />
                      </div>
                      <p className="font-medium">{data.academic.program}</p>
                      <p className="text-sm text-muted-foreground">{data.academic.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{data.academic.duration}</p>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2 text-center">Professional Experience</h4>
                      <div className="space-y-2 text-sm">
                        {data.academic.experience.map((exp, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{exp.company}</span>
                            <span className="text-muted-foreground">{exp.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Freelancer-specific additional sections */}
        {persona === "freelancer" && data.services && data.stats && (
          <div className={`mt-16 ${isVisible ? "animate-fade-in-up animate-delay-400" : "opacity-0"}`}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Services Offered */}
              <Card className="theme-transition hover-lift">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-center">Services Offered</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-primary">{data.services.industries.title}</h4>
                      <p className="text-sm text-muted-foreground">{data.services.industries.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Types & Stats */}
              <Card className="theme-transition hover-lift">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-center">Client Portfolio</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2 pulse-glow">
                          <span className="text-primary font-bold">{data.stats.brandProjects}</span>
                        </div>
                        <p className="text-sm font-medium">Brand Projects</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div>
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2 pulse-glow">
                          <span className="text-primary font-bold">{data.stats.webProjects}</span>
                        </div>
                        <p className="text-sm font-medium">Web Projects</p>
                        <p className="text-xs text-muted-foreground">Live Sites</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3 text-center">Recent Clients</h4>
                      <div className="space-y-2 text-sm">
                        {data.stats.recentClients.map((client, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{client.name}</span>
                            <span className="text-muted-foreground">{client.industry}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Project Details Modal */}
      {mounted && selectedProject && createPortal(
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedProject(null)}>
    <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto theme-transition animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <div className="relative w-full overflow-hidden rounded-t-lg bg-muted">
        <Image
          src={selectedProject.image || "/placeholder.svg"}
          alt={selectedProject.title}
          width={1200}
          height={675}
          className="w-full h-auto object-contain"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

  <Button
    variant="secondary"
    size="sm"
    className="absolute top-4 right-4 z-10"
    onClick={() => setSelectedProject(null)}
  >
    <X className="w-4 h-4" />
  </Button>

  {selectedProject.featured && (
    <div className="absolute top-4 left-4">
      <Badge
        className={`${
          persona === "engineer" ? "bg-blue-500" : "bg-green-500"
        } text-white`}
      >
        Featured
      </Badge>
    </div>
  )}
</div>

        
        <div className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{selectedProject.title}</h2>
              <div className="flex items-center gap-4 text-muted-foreground">
                <Badge variant="secondary">{selectedProject.category}</Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedProject.year}
                </div>
                {((persona === "engineer" && selectedProject.company) || (persona === "freelancer" && selectedProject.client)) && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {persona === "engineer" ? selectedProject.company : selectedProject.client}
                  </div>
                )}
              </div>
            </div>
            <Badge
              variant={selectedProject.status === "Completed" || selectedProject.status === "Live" ? "default" : "outline"}
            >
              {selectedProject.status}
            </Badge>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Project Overview</h3>
              <p className="text-muted-foreground leading-relaxed">{selectedProject.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech: string) => (
                  <span key={tech} className="px-3 py-2 bg-muted text-muted-foreground rounded-full text-sm hover-lift transition-colors hover:bg-primary/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {renderProjectDetailsContent(selectedProject)}

            <div className="flex flex-wrap gap-3 pt-4 border-t">
              {( selectedProject.link) && (
                <Button 
                  variant="outline" 
                  className=" z-50 cursor-pointer" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open( selectedProject.link, '_blank');
                  }}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Source Code
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>,
  document.body
)}
      </div>
    </section>
  )
}