import { PersonaType } from "@/hooks/use-theme-switcher"
import projectsData from "./projects-data.json"

export interface Project {
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

export interface ProjectData {
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
    experience: Array<{ company: string; role: string }>
  }
  services?: {
    web: { title: string; description: string }
    brand: { title: string; description: string }
    industries: { title: string; description: string }
  }
  stats?: {
    brandProjects: string
    webProjects: string
    recentClients: Array<{ name: string; industry: string }>
  }
}

/**
 * Get project data for a specific persona
 * @param persona - The persona type ("engineer" or "freelancer")
 * @returns ProjectData for the specified persona
 */
export function getProjectData(persona: PersonaType): ProjectData {
  return projectsData[persona] as ProjectData
}

/**
 * Get all projects for a specific persona
 * @param persona - The persona type ("engineer" or "freelancer")
 * @returns Array of projects
 */
export function getProjects(persona: PersonaType): Project[] {
  return projectsData[persona].projects as Project[]
}

/**
 * Get featured projects for a specific persona
 * @param persona - The persona type ("engineer" or "freelancer")
 * @returns Array of featured projects
 */
export function getFeaturedProjects(persona: PersonaType): Project[] {
  return projectsData[persona].projects.filter(project => project.featured) as Project[]
}

/**
 * Get projects by category for a specific persona
 * @param persona - The persona type ("engineer" or "freelancer")
 * @param category - The project category to filter by
 * @returns Array of projects in the specified category
 */
export function getProjectsByCategory(persona: PersonaType, category: string): Project[] {
  return projectsData[persona].projects.filter(project => project.category === category) as Project[]
}

/**
 * Get unique categories for a specific persona
 * @param persona - The persona type ("engineer" or "freelancer")
 * @returns Array of unique category names
 */
export function getProjectCategories(persona: PersonaType): string[] {
  const projects = projectsData[persona].projects as Project[]
  return [...new Set(projects.map(project => project.category))]
}

/**
 * Get project statistics for a specific persona
 * @param persona - The persona type ("engineer" or "freelancer")
 * @returns Object with project statistics
 */
export function getProjectStats(persona: PersonaType) {
  const projects = projectsData[persona].projects as Project[]
  
  return {
    total: projects.length,
    featured: projects.filter(p => p.featured).length,
    completed: projects.filter(p => p.status === "Completed" || p.status === "Live").length,
    categories: getProjectCategories(persona).length,
    byCategory: getProjectCategories(persona).reduce((acc, category) => {
      acc[category] = projects.filter(p => p.category === category).length
      return acc
    }, {} as Record<string, number>)
  }
}