import useTypingLines from '../hooks/useTypingLines'
import { SITE, TERMINAL_SKILLS } from '../data/site'

const SCRIPT = [
  '> whoami',
  `${SITE.name}\n${SITE.role}`,
  '> skills',
  TERMINAL_SKILLS.join('\n'),
]

export default function Terminal() {
  const { typed, done } = useTypingLines(SCRIPT, { speed: 22, pause: 300 })

  return (
    <div className="glass glow-border animate-fade-in overflow-hidden shadow-glow" aria-label="Developer terminal">
      <div className="flex items-center gap-2 border-b border-line bg-surface2/80 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
        <span className="h-3 w-3 rounded-full bg-ok/70" />
        <span className="ml-3 font-mono text-xs text-muted">muthupandi@control-center ~</span>
      </div>
      <div className="min-h-[18rem] space-y-3 p-5 font-mono text-sm leading-relaxed">
        {typed.map((line, i) => (
          <pre
            key={i}
            className={`whitespace-pre-wrap font-mono ${line.startsWith('>') ? 'text-accent' : 'text-ink'}`}
          >
            {line}
            {!done && i === typed.length - 1 && <span className="animate-blink text-accent">▍</span>}
          </pre>
        ))}
        {done && (
          <p className="text-accent">
            {'>'} <span className="animate-blink">▍</span>
          </p>
        )}
      </div>
    </div>
  )
}
