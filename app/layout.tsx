import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Omar Alibi - Creative Designer & Electrical Engineer | Brand Identity & IoT Solutions",
    template: "%s | Omar Alibi"
  },
  description: "Multidisciplinary designer and engineer combining creativity with technical expertise. Specializing in brand identity design, visual communication, and innovative IoT solutions. From logo design to embedded systems - bridging the gap between design and technology.",
  keywords: [
    "Omar Alibi",
    "Creative Designer",
    "Electrical Engineer", 
    "Brand Identity Designer",
    "Multidisciplinary Designer",
    "Logo Designer Tunisia",
    "Technical Designer",
    "Design Engineer",
    "Visual Brand Identity",
    "Creative Engineering",
    "Restaurant Branding Specialist",
    "Hospitality Brand Design",
    "E-commerce Brand Identity",
    "Cosmetic Brand Design",
    "Event Brand Design",
    "Educational Branding",
    "Car Rental Branding",
    "Corporate Identity Tunisia",
    "Freelance Brand Designer",
    "Creative Services Tunisia",
    "Logo Design Services",
    "Visual Identity Systems",
    "Brand Guidelines Design",
    "Print Design Tunisia",
    "Marketing Materials Design",
    "Business Card Design",
    "Social Media Brand Design",
    "Creative Brand Solutions",
    "Professional Branding Services",
    "ENIT Graduate Designer",
    "Technical Creative Professional",
    "IoT Product Design",
    "Embedded Systems Design",
    "Smart Product Development",
    "Creative Technology Solutions",
    "Design Thinking",
    "User Experience Design",
    "Creative Problem Solving",
    "Innovation Design",
    "Technology Integration",
    "Creative Engineering Solutions",
    // Frontend Technologies
    "React Developer",
    "Next.js Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "HTML5 CSS3",
    "Tailwind CSS",
    "Frontend Engineering",
    // Backend & Full Stack
    "Node.js Developer",
    "Full Stack Developer",
    "MongoDB Developer",
    "MySQL Database",
    "MQTT Protocol",
    "Electron Apps",
    // Engineering & Embedded
    "Arduino Projects",
    "STM32 Microcontroller",
    "Raspberry Pi Projects",
    "Embedded C Programming",
    "IoT Solutions",
    "Linux Systems",
    "FreeRTOS",
    "Real-time Systems",
    // Engineering Tools
    "MATLAB Engineering",
    "Vivado FPGA",
    "QuestaSim Simulation",
    "LTSpice Circuit Design",
    "Eagle PCB Design",
    "Qt Creator",
    "Docker Containers",
    "Git Version Control",
    // Data Science & AI
    "Python Developer",
    "PyTorch AI",
    "Anaconda Data Science",
    "Machine Learning",
    "Data Analysis",
    // Programming Languages
    "C++ Programming",
    "C Programming",
    "Rust Programming",
    "Systems Programming",
    // Design Tools
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe Premiere Pro",
    "Adobe After Effects",
    "Creative Suite Expert",
    "Motion Graphics",
    "Video Editing",
    // Monitoring & DevOps
    "Grafana Dashboards",
    "System Monitoring",
    "DevOps Tools"
  ],
  authors: [{ name: "Omar Alibi", url: "https://omaralibi.com" }],
  creator: "Omar Alibi",
  publisher: "Omar Alibi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://omar-alibi.vercel.app"),
  alternates: {
    canonical: "https://omar-alibi.vercel.app/",
  },
  openGraph: {
    type: "website",
    locale: "en_US", 
    url: "https://omar-alibi.vercel.app/",
    title: "Omar Alibi - Creative Designer & Engineer | Brand Identity Specialist",
    description: "Multidisciplinary creative professional combining design expertise with engineering innovation. Specializing in brand identity, visual communication, and smart technology solutions.",
    siteName: "Omar Alibi - Creative Design & Engineering",
    images: [
      {
        url: "/og-image.jpg", // Add your Open Graph image
        width: 1200,
        height: 630,
        alt: "Omar Alibi - Creative Designer and Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Omar Alibi - Creative Designer & Engineer | Brand Identity Specialist",
    description: "Multidisciplinary creative combining design expertise with technical innovation. Brand identity • Visual design • Smart solutions.",
    creator: "@omaralibi", // Replace with your actual Twitter handle
    images: ["/og-image.jpg"], // Same image as OpenGraph
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  manifest: "/site.webmanifest",
  category: "design",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow some zoom for accessibility
  userScalable: true, // Enable for accessibility
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Omar Alibi",
    jobTitle: ["Creative Designer", "Brand Identity Specialist", "Electrical Engineer"],
    description: "Multidisciplinary creative professional combining design expertise with engineering innovation",
    url: "https://omaralibi.com", // Replace with your actual domain
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "École Nationale d'Ingénieurs de Tunis (ENIT)",
      alternateName: "National Engineering School of Tunis"
    },
    worksFor: [
      {
        "@type": "Organization",
        name: "Freelance Creative Studio",
        jobTitle: "Creative Designer & Brand Identity Specialist"
      },
      {
        "@type": "Organization",
        name: "OnWire Link",
        jobTitle: "Engineering Consultant"
      }
    ],
    sameAs: [
      "https://github.com/omaralibi", // Replace with your actual GitHub
      "https://linkedin.com/in/omaralibi", // Replace with your actual LinkedIn
      "https://twitter.com/omaralibi", // Replace with your actual Twitter
    ],
    knowsAbout: [
      "Brand Identity Design",
      "Visual Identity Systems",
      "Logo Design", 
      "Creative Direction",
      "Brand Strategy",
      "Visual Communication",
      "Graphic Design",
      "Print Design",
      "Digital Design",
      "Marketing Materials",
      "Corporate Branding",
      "Restaurant Branding",
      "Hospitality Design",
      "Event Branding",
      "E-commerce Branding",
      "Educational Institution Branding",
      "Creative Problem Solving",
      "Design Thinking",
      "User Experience Design",
      "Creative Technology",
      // Frontend Development
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Frontend Development",
      // Backend & Database
      "Node.js",
      "MongoDB",
      "MySQL",
      "Database Design",
      "API Development",
      // Engineering & Embedded
      "Electrical Engineering",
      "IoT Systems",
      "Embedded Design",
      "Arduino",
      "STM32",
      "Raspberry Pi",
      "Microcontroller Programming",
      "Circuit Design",
      "PCB Design",
      "Real-time Systems",
      "FreeRTOS",
      "Linux Systems",
      // Programming Languages
      "C Programming",
      "C++",
      "Python",
      "Rust",
      "Systems Programming",
      // Engineering Tools
      "MATLAB",
      "Vivado",
      "QuestaSim",
      "LTSpice",
      "Eagle PCB",
      "Qt Creator",
      // DevOps & Tools
      "Docker",
      "Git",
      "Grafana",
      "System Monitoring",
      // Data Science & AI
      "PyTorch",
      "Machine Learning",
      "Data Analysis",
      "Anaconda",
      // Creative Software
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Adobe Premiere Pro",
      "Adobe After Effects",
      "Motion Graphics",
      "Video Editing",
      // Protocols & Communication
      "MQTT",
      "IoT Protocols",
      "Wireless Communication",
      // Applications
      "Electron Apps",
      "Desktop Applications",
      "Cross-platform Development",
      "Product Development",
      "Smart Solutions",
      "Innovation Design",
      "Creative Engineering"
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Electrical Engineering Degree",
        credentialCategory: "Bachelor's Degree",
        educationalLevel: "Graduate",
        recognizedBy: {
          "@type": "EducationalOrganization",
          name: "École Nationale d'Ingénieurs de Tunis"
        }
      }
    ],
    seeks: [
      "Brand Identity Projects",
      "Visual Identity Design",
      "Logo Design Projects",
      "Creative Direction",
      "Brand Strategy Consulting",
      "Restaurant & Hospitality Branding",
      "E-commerce Brand Development",
      "Corporate Identity Design",
      "Creative Technology Projects",
      "Smart Product Design",
      "Innovation Consulting",
      "Multidisciplinary Design Projects"
    ],
    serviceArea: {
      "@type": "Place",
      name: "Tunisia",
      additionalProperty: "Remote services available globally"
    },
    offers: [
      {
        "@type": "Service",
        name: "Brand Identity Design",
        description: "Complete visual identity systems including logo design, brand guidelines, and marketing materials"
      },
      {
        "@type": "Service", 
        name: "Creative Direction",
        description: "Strategic creative guidance for brands and businesses"
      },
      {
        "@type": "Service",
        name: "Smart Solutions Development", 
        description: "IoT and embedded systems solutions with creative design integration"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content="Omar Alibi Portfolio" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="dark font-sans antialiased">
        <Navbar />
        <main role="main">
          {children}
        </main>
        <footer 
          className="w-full text-center p-4 text-sm text-gray-500 dark:text-gray-400"
          role="contentinfo"
        >
          <p className="font-medium italic scale-90">
            Designed and developed by me.
          </p>
          <p>
            &copy; {currentYear} Omar Alibi. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}