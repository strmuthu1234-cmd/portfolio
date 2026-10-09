import { Link } from 'react-router-dom'
import Section from '../Section'
import ProjectCard from '../ProjectCard'
import { AsyncBoundary } from '../States'
import useFetch from '../../hooks/useFetch'
import { projectsApi } from '../../services/resources'

export default function FeaturedProjects({ id = 'projects', limit = 3 }) {
  const state = useFetch(() => projectsApi.list({ page_size: limit }))
  return (
    <Section id={id} eyebrow="04 — Projects" title="Featured work">
      <AsyncBoundary
        state={state}
        isEmpty={(d) => !d.results.length}
        emptyProps={{ title: 'No projects yet' }}
      >
        {(d) => (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {d.results.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
            <div className="mt-8">
              <Link to="/projects" className="btn-ghost">
                View all projects →
              </Link>
            </div>
          </>
        )}
      </AsyncBoundary>
    </Section>
  )
}
