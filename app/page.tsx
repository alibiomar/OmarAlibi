import { Hero } from "@/components/board/hero"
import { Profile } from "@/components/board/profile"
import { Work } from "@/components/board/work"
import { Contact } from "@/components/board/contact"
import { Rail } from "@/components/board/rail"
import { ScrollFX } from "@/components/board/scroll-fx"
import { ThemeSwitch } from "@/components/board/theme-switch"

export default function HomePage() {
  return (
    <main id="main" role="main">
      <Rail />
      <ScrollFX />
      {/* <ThemeSwitch /> */}
      <Hero />
      <Profile />
      <Work />
      <Contact />
    </main>
  )
}
