import Section from '../components/Section'
import ContactForm from '../components/sections/ContactForm'
import FlowDiagram from '../components/FlowDiagram'
import { SITE } from '../data/site'

export default function Contact() {
  return (
    <Section
      eyebrow="Contact"
      title="Let’s talk"
      subtitle="Have a role or project in mind? Send a message — it goes straight to my API."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
        <div className="space-y-5">
          <FlowDiagram title="Where your message goes" steps={['React Contact Form', 'Django REST API', 'PostgreSQL']} />
          <div className="glass p-5 text-sm">
            <p className="mb-3 font-semibold">Elsewhere</p>
            <div className="flex flex-wrap gap-2">
              <a href={SITE.github} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
                GitHub
              </a>
              <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
