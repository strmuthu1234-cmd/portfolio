import { Link } from 'react-router-dom'
import Hero from '../components/sections/Hero'
import AboutSection from '../components/sections/AboutSection'
import SkillsSection from '../components/sections/SkillsSection'
import ExperienceSection from '../components/sections/ExperienceSection'
import FeaturedProjects from '../components/sections/FeaturedProjects'
import HowIBuiltThis from '../components/sections/HowIBuiltThis'
import Section from '../components/Section'

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <FeaturedProjects />
      <HowIBuiltThis />
      <Section>
        <div className="glass glow-border p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Want to see the API live?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Try the Employee CRUD demo or open the interactive Swagger docs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/api-demo" className="btn-primary">
              Open API Demo
            </Link>
            <Link to="/contact" className="btn-ghost">
              Get in touch
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
