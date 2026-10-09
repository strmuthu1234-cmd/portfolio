import { CATEGORY_LABELS } from '../utils/format'

const ORDER = ['frontend', 'backend', 'database', 'cloud_tools', 'automation_ai', 'core']

export default function SkillGroups({ skills }) {
  const grouped = ORDER.map((cat) => ({
    cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length)

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {grouped.map(({ cat, items }) => (
        <div key={cat} className="glass glass-hover p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
            {CATEGORY_LABELS[cat]}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {items.map((s) => (
              <li
                key={s.id}
                className="rounded-lg border border-line bg-surface2/70 px-3 py-1.5 text-sm transition hover:border-accent/40"
              >
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
