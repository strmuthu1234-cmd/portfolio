import { Link } from 'react-router-dom'
import Terminal from '../Terminal'
import { SITE, STATS } from '../../data/site'

export default function Hero() {
  return (
    <section className="container-x relative pb-16 pt-12 sm:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-[110px]"
      />
      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        <div className="animate-slide-up">
          <span className="chip mb-5 gap-2">
            <span className="h-2 w-2 rounded-full bg-ok" /> Open to full-stack roles
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Hi, I’m <span className="gradient-text">Muthupandi P</span>
          </h1>
          <p className="mt-2 text-2xl font-semibold text-ink/90 sm:text-3xl">{SITE.role}</p>
          <p className="mt-5 max-w-xl text-lg text-muted">{SITE.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/projects" className="btn-primary">
              View Projects
            </Link>
            <a href={SITE.resume} download className="btn-ghost">
              Download Resume
            </a>
            <Link to="/contact" className="btn-ghost">
              Contact Me
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass px-4 py-3">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-bold gradient-text">{s.value}</dd>
                <p className="mt-0.5 text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>

        <Terminal />
      </div>
    </section>
  )
}
