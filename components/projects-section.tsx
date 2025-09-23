"use client"

import type { PersonaType } from "@/hooks/use-theme-switcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Eye, ChevronDown, Calendar, MapPin, X } from "lucide-react"
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
  const [selectedProject, setSelectedProject] = useState<any>(null)
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
      title: "IoT Dashboard for Connected Industrial Machines",
      description:
        "Developed a comprehensive data acquisition server for industrial machines with real-time web visualization interface, transformed into a standalone desktop application. Implemented WhatsApp alert system and automated consumption report generation with email delivery.",
      technologies: ["Node.js", "Real-time Dashboard", "WhatsApp API", "Email Automation", "Desktop App", "Industrial IoT"],
      category: "IoT Systems",
      year: "2025",
      status: "Completed",
      image: "/iot-dashboard-industrial-machines-monitoring.jpg",
      featured: true,
      company: "Personal Project"
    },
    {
      title: "Database File Processor - Full-Stack Web Application",
      description:
        "Built a complete React + Node.js application for uploading and analyzing multiple file formats (CSV, JSON, Excel, SQLite). Features interactive data visualization with dynamic tables and ChartJS graphs, with optimized memory handling for large files.",
      technologies: ["React", "Node.js", "ChartJS", "File Processing", "Data Visualization", "Memory Optimization"],
      category: "Web Development",
      year: "2025",
      status: "Completed",
      image: "/database-file-processor-web-application.jpg",
      featured: true,
      company: "Personal Project"
    },
    {
      title: "Data Fusion System for IMU Orientation Sensors",
      description:
        "Developed advanced Kalman Filter fusion algorithm for inertial sensors (accelerometers, gyroscopes) implemented on STM32 platform. Created simulation software with Qt Creator and optimized algorithms to minimize orientation estimation errors.",
      technologies: ["STM32", "Kalman Filter", "Qt Creator", "C++", "IMU Sensors", "Real-time Processing"],
      category: "Embedded Systems",
      year: "2024",
      status: "Completed",
      image: "/imu-sensor-data-fusion-stm32-kalman.jpg",
      featured: true,
      company: "ENIT - Academic Project (PFA2)"
    },
    {
      title: "Real-time ESP32/Firebase Messaging System",
      description:
        "Built a complete instant messaging system with ESP32 microcontroller integration and Firebase backend. Implemented user authentication, message management, online status tracking, and responsive web interface with enhanced security.",
      technologies: ["ESP32", "Firebase", "Real-time Database", "Web Interface", "Authentication", "IoT Communication"],
      category: "IoT Communication",
      year: "2025",
      status: "Completed",
      image: "/esp32-firebase-messaging-system-iot.jpg",
      featured: false,
      company: "Personal Project"
    },
    {
      title: "OnWire Link - IoT Firmware & Mobile App",
      description:
        "Designed embedded firmware in C++ with web server, MQTT, and WiFiManager. Developed Flutter mobile application with Firebase integration, QR scanning, and hybrid MQTT/local AP control architecture using Raspberry Pi server.",
      technologies: ["C++ Arduino", "Flutter/Dart", "Firebase", "MQTT", "Express.js", "Raspberry Pi"],
      category: "Professional IoT",
      year: "2025",
      status: "Completed",
      image: "/onwire-link-iot-firmware-mobile-app.jpg",
      featured: true,
      company: "OnWire Link - Engineering Internship"
    },
    {
      title: "DC Motor Speed Controller with Custom PCB",
      description:
        "Complete electronic board design using Eagle PCB software with circuit simulation and optimization using PSpice. Developed voltage regulation system specifically for industrial motor control applications.",
      technologies: ["Eagle PCB", "PSpice", "Circuit Design", "Voltage Regulation", "Industrial Control", "PCB Design"],
      category: "Circuit Design",
      year: "2024",
      status: "Completed",
      image: "/dc-motor-speed-controller-pcb-design.jpg",
      featured: false,
      company: "ENIT - Academic Project"
    },
  ]

  const freelancerProjects = [
    {
      title: "Meninx - Car Rental Platform",
      description:
        "Complete web development for a professional car rental company using Next.js. Built responsive booking system, vehicle management, and customer portal with modern UI/UX design.",
      technologies: ["Next.js", "React", "Tailwind CSS", "Booking System", "Responsive Design"],
      category: "Web Development",
      year: "2024",
      status: "Live",
      link: "https://meninx.example.com",
      image: "/meninx-car-rental-website-nextjs.jpg",
      featured: true,
      client: "Meninx Car Rental"
    },
    {
      title: "ASHE - E-commerce with Admin Dashboard",
      description:
        "Full-stack e-commerce website with comprehensive admin dashboard for artisanal products. Developed complete brand identity, product management system, and customer interface using Next.js.",
      technologies: ["Next.js", "Admin Dashboard", "E-commerce", "Brand Identity", "Product Management"],
      category: "E-commerce & Branding",
      year: "2024",
      status: "Live",
      image: "/ashe-ecommerce-admin-dashboard-branding.jpg",
      featured: true,
      client: "ASHE (Own Brand)"
    },
    {
      title: "YouMe Cosmetic Shop",
      description:
        "Modern e-commerce platform for cosmetic products with complete brand identity design. Built with Next.js featuring product catalog, shopping cart, and responsive design optimized for mobile beauty shoppers.",
      technologies: ["Next.js", "E-commerce", "Brand Identity", "Mobile Optimization", "Product Catalog"],
      category: "E-commerce & Branding",
      year: "2024",
      status: "Live",
      image: "/youme-cosmetic-shop-ecommerce-branding.jpg",
      featured: true,
      client: "YouMe Cosmetics"
    },
    {
      title: "Securinets ENIT - Cybersecurity Club Branding",
      description:
        "Complete visual identity design for ENIT's cybersecurity club including logo design, color schemes, typography, and digital assets for social media and events.",
      technologies: ["Adobe Creative Suite", "Logo Design", "Brand Guidelines", "Digital Assets"],
      category: "Brand Identity",
      year: "2025",
      status: "Completed",
      image: "/securinets-enit-cybersecurity-club-branding.jpg",
      featured: false,
      client: "Securinets ENIT"
    },
    {
      title: "Restaurant & Hospitality Brand Collection",
      description:
        "Brand identity projects for multiple hospitality businesses including Chez Monia restaurant, Le Voilier restaurant, and Aqualight Nautic Club. Each featuring unique visual identity and marketing materials.",
      technologies: ["Brand Strategy", "Logo Design", "Marketing Materials", "Visual Identity"],
      category: "Brand Identity",
      year: "2024",
      status: "Multiple Completed",
      image: "/restaurant-hospitality-brand-collection.jpg",
      featured: false,
      client: "Multiple Restaurants & Clubs"
    },
    {
      title: "Event & Lifestyle Brands Portfolio",
      description:
        "Diverse branding projects including REBELE lifestyle brand, Kika Events event management, and various high school and individual client projects. Focus on modern, engaging visual identities.",
      technologies: ["Adobe Creative Suite", "Brand Development", "Print Design", "Digital Marketing"],
      category: "Brand Identity",
      year: "2024",
      status: "Multiple Completed",
      image: "/event-lifestyle-brands-portfolio.jpg",
      featured: false,
      client: "Various Clients"
    },
    {
      title: "Educational Institution Branding",
      description:
        "Brand identity and marketing material design for various high schools and educational institutions. Created cohesive visual systems including logos, promotional materials, and digital assets.",
      technologies: ["Educational Design", "Print Materials", "Logo Design", "Marketing Assets"],
      category: "Brand Identity",
      year: "2023-2024",
      status: "Multiple Completed",
      image: "/educational-institution-branding-highschool.jpg",
      featured: false,
      client: "Various High Schools"
    },
    {
      title: "Individual Client Projects",
      description:
        "Custom design solutions for individual entrepreneurs and small businesses including personal branding, business cards, social media assets, and promotional materials.",
      technologies: ["Personal Branding", "Business Cards", "Social Media Design", "Print Design"],
      category: "Personal Branding",
      year: "2023-2024",
      status: "Ongoing",
      image: "/individual-client-personal-branding-projects.jpg",
      featured: false,
      client: "Individual Entrepreneurs"
    },
  ]

  const projects = persona === "engineer" ? engineerProjects : freelancerProjects
  const sectionTitle = persona === "engineer" ? "Technical Projects & Experience" : "Web Development & Brand Identity Portfolio"
  const displayedProjects = showAll ? projects : projects.slice(0, 4)

  return (
    <section id="projects-section" className="py-20 px-6 theme-transition">
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-4xl font-bold mb-4 text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          {sectionTitle}
        </h2>
        
        {persona === "engineer" && (
          <p className={`text-center text-muted-foreground mb-12 max-w-3xl mx-auto ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            Electrical Engineering student with expertise in IoT systems, embedded electronics, web development, and industrial automation. 
            Experienced in both academic research and professional internship projects.
          </p>
        )}
        
        {persona === "freelancer" && (
          <p className={`text-center text-muted-foreground mb-12 max-w-3xl mx-auto ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            Full-stack web developer and brand designer specializing in Next.js development and comprehensive brand identity solutions. 
            Experienced in e-commerce platforms, business websites, and complete branding packages for diverse industries.
          </p>
        )}

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

                {persona === "engineer" && "company" in project && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-black/20 text-white border-white/30 backdrop-blur-sm">
                      {"company" in project && project.company?.includes("Professional") ? "Professional" : 
                       "company" in project && project.company?.includes("Internship") ? "Internship" : "Academic"}
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
                
                {persona === "freelancer" && "client" in project && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    {"client" in project && project.client}
                  </div>
                )}
                
                {persona === "engineer" && "company" in project && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    {"company" in project && project.company}
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

                {persona === "freelancer" && "link" in project && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover-lift bg-transparent">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover-lift" 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedProject(project)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </div>
                )}

                {persona === "engineer" && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover-lift bg-transparent">
                      <Github className="w-4 h-4 mr-2" />
                      Source Code
                    </Button>
                    {index < 2 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover-lift" 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSelectedProject(project)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    )}
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
          <div className={`mt-16 ${isVisible ? "animate-fade-in-up animate-delay-400" : "opacity-0"}`}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Technical Skills Highlight */}
              <Card className="theme-transition hover-lift">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-center">Core Technical Skills</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-primary">Embedded Systems</h4>
                      <p className="text-sm text-muted-foreground">Arduino, ESP32/8266, STM32, Raspberry Pi, BeagleBone, FPGA, PCB Design</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-primary">Web & Software</h4>
                      <p className="text-sm text-muted-foreground">React, Next.js, Node.js, Python, Flutter, C/C++, Rust</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-primary">IoT & Industrial</h4>
                      <p className="text-sm text-muted-foreground">MQTT, Industrial Automation, Real-time Systems</p>
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
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3 pulse-glow">
                        <span className="text-primary font-bold text-lg">ENIT</span>
                      </div>
                      <p className="font-medium">Electrical Engineering</p>
                      <p className="text-sm text-muted-foreground">National Engineering School of Tunis</p>
                      <p className="text-xs text-muted-foreground mt-1">2023 - Present</p>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2 text-center">Professional Experience</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>OnWire Link</span>
                          <span className="text-muted-foreground">Engineering Intern</span>
                        </div>
                        <div className="flex justify-between">
                          <span>STEG</span>
                          <span className="text-muted-foreground">Technical Intern</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ASHE</span>
                          <span className="text-muted-foreground">Founder & Manager</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto theme-transition" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <div className="h-64 md:h-80 overflow-hidden rounded-t-lg">
                  <Image
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={() => setSelectedProject(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  {selectedProject.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className={`${persona === "engineer" ? "bg-blue-500" : "bg-green-500"} text-white`}>
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
                        {((persona === "engineer" && "company" in selectedProject) || (persona === "freelancer" && "client" in selectedProject)) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {persona === "engineer" && "company" in selectedProject ? selectedProject.company : 
                             persona === "freelancer" && "client" in selectedProject ? selectedProject.client : ""}
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

                    {persona === "engineer" && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Technical Details</h3>
                        <div className="bg-muted/50 rounded-lg p-4">
                          {selectedProject.title.includes("IoT Dashboard") && (
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li>• Real-time data acquisition from industrial machines</li>
                              <li>• Web-based visualization interface with responsive design</li>
                              <li>• Desktop application conversion for offline usage</li>
                              <li>• WhatsApp integration for instant alerts and notifications</li>
                              <li>• Automated report generation with email delivery system</li>
                            </ul>
                          )}
                          {selectedProject.title.includes("Database File Processor") && (
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li>• Support for CSV, JSON, Excel, and SQLite file formats</li>
                              <li>• Memory-optimized processing for large files using streaming</li>
                              <li>• Interactive data visualization with ChartJS integration</li>
                              <li>• Dynamic filtering and export capabilities</li>
                              <li>• Asynchronous file reading for improved performance</li>
                            </ul>
                          )}
                          {selectedProject.title.includes("Data Fusion System") && (
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li>• Advanced Kalman Filter implementation for sensor fusion</li>
                              <li>• STM32 embedded platform optimization</li>
                              <li>• Qt Creator simulation environment</li>
                              <li>• Real-time orientation estimation with error minimization</li>
                              <li>• IMU sensor integration (accelerometers, gyroscopes)</li>
                            </ul>
                          )}
                          {!selectedProject.title.includes("IoT Dashboard") && !selectedProject.title.includes("Database File Processor") && !selectedProject.title.includes("Data Fusion System") && (
                            <p className="text-sm text-muted-foreground">Detailed technical specifications and implementation details available upon request.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {persona === "freelancer" && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Project Highlights</h3>
                        <div className="bg-muted/50 rounded-lg p-4">
                          {selectedProject.title.includes("Meninx") && (
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li>• Complete booking system with availability management</li>
                              <li>• Responsive design optimized for mobile and desktop</li>
                              <li>• Vehicle management dashboard for administrators</li>
                              <li>• Customer portal with booking history and preferences</li>
                              <li>• Modern UI/UX design focused on user experience</li>
                            </ul>
                          )}
                          {selectedProject.title.includes("ASHE") && (
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li>• Full e-commerce functionality with product catalog</li>
                              <li>• Comprehensive admin dashboard for inventory management</li>
                              <li>• Complete brand identity from concept to implementation</li>
                              <li>• Payment integration and order management system</li>
                              <li>• SEO optimization and performance tuning</li>
                            </ul>
                          )}
                          {selectedProject.title.includes("YouMe") && (
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li>• Mobile-first design for beauty product shopping</li>
                              <li>• Product catalog with advanced filtering and search</li>
                              <li>• Brand identity design including logo and color palette</li>
                              <li>• Shopping cart and checkout optimization</li>
                              <li>• Social media integration for marketing</li>
                            </ul>
                          )}
                          {!selectedProject.title.includes("Meninx") && !selectedProject.title.includes("ASHE") && !selectedProject.title.includes("YouMe") && (
                            <p className="text-sm text-muted-foreground">Custom design solutions tailored to client needs and industry requirements.</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      {persona === "freelancer" && "link" in selectedProject && (
                        <Button className="hover-lift">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Live Site
                        </Button>
                      )}
                      <Button variant="outline" className="hover-lift">
                        <Github className="w-4 h-4 mr-2" />
                        Source Code
                      </Button>
                      <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {persona === "freelancer" && (
          <div className={`mt-16 ${isVisible ? "animate-fade-in-up animate-delay-400" : "opacity-0"}`}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Services Offered */}
              <Card className="theme-transition hover-lift">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-center">Services Offered</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-primary">Web Development</h4>
                      <p className="text-sm text-muted-foreground">Next.js, React, E-commerce platforms, Admin dashboards</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-primary">Brand Identity</h4>
                      <p className="text-sm text-muted-foreground">Logo design, Visual identity, Brand guidelines, Marketing materials</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-primary">Industries</h4>
                      <p className="text-sm text-muted-foreground">Hospitality, Cosmetics, Events, Education, Automotive, Tech</p>
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
                          <span className="text-primary font-bold">15+</span>
                        </div>
                        <p className="text-sm font-medium">Brand Projects</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div>
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2 pulse-glow">
                          <span className="text-primary font-bold">8+</span>
                        </div>
                        <p className="text-sm font-medium">Web Projects</p>
                        <p className="text-xs text-muted-foreground">Live Sites</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3 text-center">Recent Clients</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Meninx</span>
                          <span className="text-muted-foreground">Car Rental</span>
                        </div>
                        <div className="flex justify-between">
                          <span>YouMe</span>
                          <span className="text-muted-foreground">Cosmetics</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Various Restaurants</span>
                          <span className="text-muted-foreground">Hospitality</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Educational Institutions</span>
                          <span className="text-muted-foreground">Schools</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}