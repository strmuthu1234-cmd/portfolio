import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Overview from '../components/admin/Overview'
import ProjectsAdmin from '../components/admin/ProjectsAdmin'
import SkillsAdmin from '../components/admin/SkillsAdmin'
import ExperienceAdmin from '../components/admin/ExperienceAdmin'
import MessagesAdmin from '../components/admin/MessagesAdmin'
import MediaAdmin from '../components/admin/MediaAdmin'

const TABS = [
  { key: 'overview', label: 'Dashboard Overview' },
  { key: 'projects', label: 'Projects' },
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'messages', label: 'Contact Messages' },
  { key: 'media', label: 'Media Uploads' },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'overview'
  const go = (key) => setParams({ tab: key })

  const signOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const panels = {
    overview: <Overview onNavigate={go} />,
    projects: <ProjectsAdmin />,
    skills: <SkillsAdmin />,
    experience: <ExperienceAdmin />,
    messages: <MessagesAdmin />,
    media: <MediaAdmin />,
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-lg">
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/" className="font-bold">
            <span className="gradient-text">Control Center</span>
            <span className="ml-2 text-xs font-normal text-muted">/ admin</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted sm:inline">{user?.username}</span>
            <Link to="/" className="btn-ghost btn-sm">View site</Link>
            <button type="button" className="btn-danger btn-sm" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="container-x grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Admin sections" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => go(t.key)}
              aria-current={tab === t.key ? 'page' : undefined}
              className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                tab === t.key
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-transparent text-muted hover:bg-surface2/60 hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <main className="min-w-0 animate-fade-in" key={tab}>
          <h1 className="mb-6 text-2xl font-bold">{TABS.find((t) => t.key === tab).label}</h1>
          {panels[tab]}
        </main>
      </div>
    </div>
  )
}
