import Section from '../Section'
import ExperienceTimeline from '../ExperienceTimeline'
import { AsyncBoundary } from '../States'
import useFetch from '../../hooks/useFetch'
import { experienceApi } from '../../services/resources'

export default function ExperienceSection({ id = 'experience' }) {
  const state = useFetch(() => experienceApi.list({ page_size: 50 }))
  return (
    <Section id={id} eyebrow="03 — Experience" title="Where I’ve worked">
      <AsyncBoundary
        state={state}
        isEmpty={(d) => !d.results.length}
        emptyProps={{ title: 'No experience entries yet' }}
      >
        {(d) => <ExperienceTimeline items={d.results} />}
      </AsyncBoundary>
    </Section>
  )
}
