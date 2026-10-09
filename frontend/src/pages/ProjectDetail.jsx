import { Link, useParams } from 'react-router-dom'
import Section from '../components/Section'
import FlowDiagram from '../components/FlowDiagram'
import ProductViewerPlaceholder from '../components/ProductViewerPlaceholder'
import { ErrorState, Spinner } from '../components/States'
import useFetch from '../hooks/useFetch'
import { projectsApi } from '../services/resources'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { data: p, loading, error, reload } = useFetch(() => projectsApi.get(slug), [slug])

  if (loading && !p) return <Spinner />
  if (error) {
    return (
      <div className="container-x py-16">
        <ErrorState message={error} onRetry={reload} />
        <Link to="/projects" className="btn-ghost mt-6">
          ← All projects
        </Link>
      </div>
    )
  }

  return (
    <Section>
      <Link to="/projects" className="text-sm text-muted hover:text-accent">
        ← All projects
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{p.title}</h1>
          <p className="mt-4 text-lg text-muted">{p.full_description || p.short_description}</p>
        </div>
        <div className="flex gap-2">
          {p.github_url && (
            <a href={p.github_url} target="_blank" rel="noreferrer" className="btn-ghost">
              GitHub
            </a>
          )}
          {p.live_url && (
            <a href={p.live_url} target="_blank" rel="noreferrer" className="btn-primary">
              Live demo
            </a>
          )}
        </div>
      </div>

      {p.thumbnail && (
        <img src={p.thumbnail} alt={p.title} className="glass mt-8 max-h-96 w-full object-cover" />
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {p.tech_stack.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      {p.features.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-5 text-xl font-semibold">Key features</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f) => (
              <li key={f} className="glass flex items-center gap-3 px-4 py-3 text-sm">
                <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {p.architecture.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-5 text-xl font-semibold">Architecture</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {p.architecture.map((flow) => (
              <FlowDiagram key={flow.title} title={flow.title} steps={flow.steps} />
            ))}
          </div>
        </div>
      )}

      {p.slug === '360-degree-product-viewer' && (
        <div className="mt-12">
          <h2 className="mb-5 text-xl font-semibold">Visual demo</h2>
          <ProductViewerPlaceholder />
        </div>
      )}
    </Section>
  )
}
