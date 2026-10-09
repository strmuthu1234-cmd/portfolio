import Section from '../Section'
import SkillGroups from '../SkillGroups'
import { AsyncBoundary } from '../States'
import useFetch from '../../hooks/useFetch'
import { skillsApi } from '../../services/resources'

export default function SkillsSection({ id = 'skills' }) {
  const state = useFetch(() => skillsApi.list({ page_size: 100 }))
  return (
    <Section id={id} eyebrow="02 — Skills" title="Tools I work with" subtitle="Grouped by what I use them for.">
      <AsyncBoundary
        state={state}
        isEmpty={(d) => !d.results.length}
        emptyProps={{ title: 'No skills yet', hint: 'Add skills from the admin dashboard.' }}
      >
        {(d) => <SkillGroups skills={d.results} />}
      </AsyncBoundary>
    </Section>
  )
}
