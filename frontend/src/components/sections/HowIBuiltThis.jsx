import Section from '../Section'
import FlowDiagram from '../FlowDiagram'
import { BUILD_FLOWS } from '../../data/site'

export default function HowIBuiltThis({ id = 'how-i-built-this' }) {
  return (
    <Section
      id={id}
      eyebrow="05 — Under the hood"
      title="How I built this portfolio"
      subtitle="A real full-stack app, not a static page: every section is served by the Django REST API."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {BUILD_FLOWS.map((f) => (
          <FlowDiagram key={f.title} title={f.title} steps={f.steps} />
        ))}
      </div>
      <ul className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-3">
        <li className="glass p-4">
          <span className="font-semibold text-ink">Frontend:</span> React, Tailwind CSS, Axios, React Router.
        </li>
        <li className="glass p-4">
          <span className="font-semibold text-ink">Backend:</span> Django, DRF, Simple JWT, drf-spectacular docs.
        </li>
        <li className="glass p-4">
          <span className="font-semibold text-ink">Data:</span> PostgreSQL for content, AWS S3 for images.
        </li>
      </ul>
    </Section>
  )
}
