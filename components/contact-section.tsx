"use client"

import type { PersonaType } from "@/hooks/use-theme-switcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { z } from "zod"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ContactSectionProps {
  persona: PersonaType
}

// Zod schema for form validation
const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactSection({ persona }: ContactSectionProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const contactRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const triggersRef = useRef<ScrollTrigger[]>([])
  const eventListenersRef = useRef<Array<{ element: Element; type: string; handler: EventListener }>>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      if (headerRef.current && headerRef.current.children.length > 0) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        )
      }

      // Animate cards
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.contact-card')
        
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { 
              opacity: 0, 
              y: 60,
              rotateY: -15,
            },
            {
              opacity: 1,
              y: 0,
              rotateY: 0,
              stagger: 0.2,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          )
        }

        // Animate form inputs on focus/blur
        const inputs = cardsRef.current.querySelectorAll('input, textarea')
        inputs.forEach((input) => {
          const focusHandler = () => {
            gsap.to(input, {
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out"
            })
          }
          
          const blurHandler = () => {
            gsap.to(input, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            })
          }

          input.addEventListener('focus', focusHandler)
          input.addEventListener('blur', blurHandler)
          
          eventListenersRef.current.push(
            { element: input, type: 'focus', handler: focusHandler },
            { element: input, type: 'blur', handler: blurHandler }
          )
        })
      }
    }, contactRef)

    return () => {
      // Clean up event listeners
      eventListenersRef.current.forEach(({ element, type, handler }) => {
        element.removeEventListener(type, handler)
      })
      eventListenersRef.current = []
      
      // Clean up GSAP context (automatically kills all animations and ScrollTriggers)
      ctx.revert()
    }
  }, [persona])

  const engineerContent = {
    title: "Get In Touch",
    subtitle: "Ready to discuss your next embedded systems or IoT project?",
    services: [
      "Embedded Systems & Real-Time Control",
      "Edge AI & Machine Learning Integration",
      "IoT Solutions & Industrial Automation",
      "Custom SoC & RISC-V Development",
    ],
    availability: "Available for Internships & Full-time Roles",
  }

  const freelancerContent = {
    title: "Let's Create Together",
    subtitle: "Have a web development or branding project? Let's bring it to life.",
    services: [
      "Full-Stack Web Development (Next.js/React)",
      "Brand Identity & Visual Design",
      "E-commerce Platforms & Dashboards",
      "UI/UX Design & Digital Marketing",
    ],
    availability: "Currently accepting new projects and collaborations",
  }

  const content = persona === "engineer" ? engineerContent : freelancerContent

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Validate form data
      const validatedData = contactSchema.parse(formData)
      
      // Submit to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...validatedData,
          persona,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send message')
      }

      setSubmitStatus('success')
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Partial<ContactFormData> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactFormData] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        setSubmitStatus('error')
        console.error('Form submission error:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={contactRef} id="contact" className="py-20 px-6 theme-transition">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{content.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">{content.subtitle}</p>
        </div>

        <div ref={cardsRef} className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="contact-card theme-transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>contact@omaralibi.tn</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>(+216) 20 261 004</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>Kram Tunis, Tunisia</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{content.availability}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="contact-card theme-transition">
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.services.map((service, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-muted-foreground">{service}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="contact-card theme-transition">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800">Message sent successfully! I'll get back to you soon.</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">Failed to send message. Please try again later.</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">First Name</label>
                    <Input 
                      placeholder="omar" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Name</label>
                    <Input 
                      placeholder="alibi" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input 
                    type="email" 
                    placeholder="contact@omaralibi.tn" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input 
                    placeholder={persona === "engineer" ? "Project Consultation" : "Design Project Inquiry"} 
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={errors.subject ? 'border-red-500' : ''}
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    placeholder={
                      persona === "engineer"
                        ? "Tell me about your electrical engineering needs..."
                        : "Tell me about your design project..."
                    }
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={errors.message ? 'border-red-500' : ''}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}