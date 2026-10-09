import { formatMonthYear } from '../utils/format'

export default function ExperienceTimeline({ items }) {
  return (
    <ol className="relative space-y-8 border-l border-line pl-6 sm:pl-8">
      {items.map((exp) => (
        <li key={exp.id} className="relative">
          <span
            className={`absolute -left-[31px] top-2 h-3 w-3 rounded-full sm:-left-[39px] ${
              exp.is_current ? 'bg-ok shadow-[0_0_12px_#22C55E]' : 'bg-accent'
            }`}
          />
          <div className="glass glass-hover p-6">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{exp.role}</h3>
                <p className="text-accent">{exp.company}</p>
              </div>
              <span className="chip">
                {formatMonthYear(exp.start_date)} – {exp.is_current ? 'Present' : formatMonthYear(exp.end_date)}
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {exp.description
                .split('\n')
                .filter(Boolean)
                .map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                    {line}
                  </li>
                ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}
