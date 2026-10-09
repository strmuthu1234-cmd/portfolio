import { Spinner } from '../States'
import useFetch from '../../hooks/useFetch'
import { contactApi, experienceApi, mediaApi, projectsApi, skillsApi } from '../../services/resources'

const count = (p) => p.then((d) => d.count)

export default function Overview({ onNavigate }) {
  const { data, loading, error } = useFetch(async () => {
    const [projects, skills, experience, messages, unread, media] = await Promise.all([
      count(projectsApi.list({ page_size: 1 })),
      count(skillsApi.list({ page_size: 1 })),
      count(experienceApi.list({ page_size: 1 })),
      count(contactApi.list({ page_size: 1 })),
      count(contactApi.list({ page_size: 1, is_read: false })),
      count(mediaApi.list({ page_size: 1 })),
    ])
    return { projects, skills, experience, messages, unread, media }
  })

  if (loading) return <Spinner />
  if (error) return <p className="text-red-400">{error}</p>

  const cards = [
    { key: 'projects', label: 'Projects', value: data.projects },
    { key: 'skills', label: 'Skills', value: data.skills },
    { key: 'experience', label: 'Experience entries', value: data.experience },
    { key: 'messages', label: 'Messages', value: data.messages, note: `${data.unread} unread` },
    { key: 'media', label: 'Media files', value: data.media },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onNavigate(c.key)}
          className="glass glass-hover p-6 text-left"
        >
          <p className="text-sm text-muted">{c.label}</p>
          <p className="mt-2 text-4xl font-bold gradient-text">{c.value}</p>
          {c.note && <p className="mt-1 text-xs text-accent">{c.note}</p>}
        </button>
      ))}
    </div>
  )
}
