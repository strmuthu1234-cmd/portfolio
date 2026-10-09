import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const { slug, title, short_description, tech_stack = [], thumbnail, featured } = project
  return (
    <Link
      to={`/projects/${slug}`}
      className="glass glass-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="relative h-36 overflow-hidden border-b border-line bg-gradient-to-br from-blue/20 via-surface2 to-violet/20">
        {thumbnail ? (
          <img src={thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-4xl font-bold text-white/10">
            {'</>'}
          </div>
        )}
        {featured && (
          <span className="absolute left-3 top-3 rounded-full border border-accent/40 bg-bg/70 px-2.5 py-0.5 text-[11px] font-medium text-accent">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold transition group-hover:text-accent">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{short_description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tech_stack.slice(0, 5).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
