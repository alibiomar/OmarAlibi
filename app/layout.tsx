import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Boot } from "@/components/board/boot";
import { Probe } from "@/components/board/probe";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Omar Alibi — Embedded Systems & IoT Engineer",
    template: "%s | Omar Alibi",
  },
  description: "Omar Alibi is a fresh Electrical Engineering graduate from ENIT specializing in embedded systems, firmware, edge AI, RISC-V and industrial IoT. Open to junior engineering roles.",
  keywords: [
    "Omar Alibi", "Embedded Systems Engineer", "Embedded Firmware Engineer", "IoT Engineer",
    "Edge AI Engineer", "RISC-V Engineer", "Firmware Developer", "Industrial IoT",
    "Real-Time Embedded Systems", "PCB Design", "STM32 Firmware", "ESP8266 Firmware",
    "FreeRTOS", "M-Bus", "MQTT", "FPGA Design", "Embedded Machine Learning",
    "Industrial Energy Monitoring", "Electrical Engineering Graduate", "ENIT",
  ],
  authors: [{ name: "Omar Alibi", url: "https://omaralibi.tn" }],
  creator: "Omar Alibi",
  publisher: "Omar Alibi",
  formatDetection: { email: true, address: false, telephone: true },
  metadataBase: new URL("https://omaralibi.tn"),
  alternates: { canonical: "https://omaralibi.tn/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://omaralibi.tn/",
    title: "Omar Alibi — Embedded Systems & IoT Engineer",
    description: "Fresh Electrical Engineering graduate building embedded firmware, edge-AI systems and industrial IoT products.",
    siteName: "Omar Alibi",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Omar Alibi — Embedded Systems and IoT Engineer" }],
  },
  twitter: { card: "summary_large_image", title: "Omar Alibi — Embedded Systems & IoT Engineer", description: "Embedded firmware, edge AI and industrial IoT projects from Omar Alibi.", images: ["/og-image.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: [{ url: "/logo.ico", sizes: "16x16", type: "image/png" }, { url: "/logo.ico", sizes: "32x32", type: "image/png" }, { url: "/logo.ico" }], apple: [{ url: "/logo.ico", sizes: "180x180", type: "image/png" }] },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [{ color: "#050d0a" }], width: "device-width", initialScale: 1, maximumScale: 5, userScalable: true, colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Omar Alibi",
    jobTitle: "Embedded Systems and IoT Engineer",
    description: "Fresh Electrical Engineering graduate building embedded firmware, edge-AI systems and industrial IoT products.",
    url: "https://omaralibi.tn",
    alumniOf: { "@type": "EducationalOrganization", name: "École Nationale d'Ingénieurs de Tunis", alternateName: "National Engineering School of Tunis" },
    sameAs: ["https://github.com/alibiomar", "https://www.linkedin.com/in/omar-alibi/"],
    knowsAbout: ["Embedded Systems", "Embedded Firmware", "IoT Systems", "Edge AI", "Industrial Automation", "RISC-V", "PCB Design", "Real-time Systems", "STM32", "ESP8266", "FreeRTOS", "MQTT", "M-Bus", "Python", "C", "C++", "Rust", "FPGA Design", "ThingsBoard"],
    seeks: ["Junior Embedded Systems Engineer", "Firmware Engineer", "IoT Engineer", "Edge AI Engineer"],
    serviceArea: { "@type": "Place", name: "Tunisia", additionalProperty: "Open to relocation and remote engineering roles" },
    hasOccupation: { "@type": "Occupation", name: "Embedded Systems Engineer", occupationLocation: { "@type": "Country", name: "Tunisia" }, skills: "Firmware, IoT, edge AI, RISC-V, PCB design" },
  };

  return (
    <html lang="en" data-theme="ink" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("oa-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <meta name="theme-color" content="#050d0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content="Omar Alibi Portfolio" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <Boot />
        <Probe />
        {children}
      </body>
    </html>
  );
}
