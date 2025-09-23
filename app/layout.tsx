import type { Metadata,Viewport } from "next";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omar Alibi",
  icons: {
    icon: "/logo.ico",
  },
  description:
    "Get a glimpse of my experience, skills, and projects. Explore my portfolio to see how I can help you achieve your goals.",
};

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  minimumScale: 1.0,
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className="dark font-sans">
        <Navbar />
        {children}
        
      </body>
    </html>
  );
}
