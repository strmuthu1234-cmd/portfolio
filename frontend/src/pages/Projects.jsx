import { useState } from 'react'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import { AsyncBoundary } from '../components/States'
import useFetch from '../hooks/useFetch'
import { projectsApi } from '../services/resources'

export default function Projects() {
  const [search, setSearch] = useState('')
  const state = useFetch(() => projectsApi.list({ page_size: 50, search: search || undefined }), [search])

  return (
    <Section eyebrow="Projects" title="Things I’ve built" subtitle="Click a project for architecture and feature details.">
      <input
        type="search"
        className="input mb-6 max-w-sm"
        placeholder="Search projects…"
        aria-label="Search projects"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <AsyncBoundary
        state={state}
        isEmpty={(d) => !d.results.length}
        emptyProps={{ title: 'No projects found', hint: search ? 'Try a different search.' : undefined }}
      >
        {(d) => (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {d.results.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </AsyncBoundary>
    </Section>
  )
}
