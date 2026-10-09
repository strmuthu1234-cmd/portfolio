import Section from '../Section'
import { SITE } from '../../data/site'

const HIGHLIGHTS = [
  { title: 'Backend-first', text: 'Django + DRF APIs with JWT, RBAC and PostgreSQL.' },
  { title: 'Automation', text: 'n8n and Python workflows that remove manual work.' },
  { title: 'Integrations', text: 'Biometric devices, email systems and cloud storage.' },
]

export default function AboutSection({ id = 'about' }) {
  return (
    <Section id={id} eyebrow="01 — About" title="Engineer with a backend-first mindset">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="glass glow-border p-6 sm:p-8 lg:col-span-3">
          <p className="text-lg leading-relaxed text-ink/90">{SITE.summary}</p>
        </div>
        <div className="grid gap-4 lg:col-span-2">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="glass glass-hover p-5">
              <h3 className="font-semibold text-accent">{h.title}</h3>
              <p className="mt-1 text-sm text-muted">{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
