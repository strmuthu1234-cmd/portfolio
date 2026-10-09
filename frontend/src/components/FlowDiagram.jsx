// Vertical/horizontal step flow used for architecture diagrams.
export default function FlowDiagram({ title, steps, horizontal = false }) {
  return (
    <div className="glass glow-border p-5 sm:p-6">
      {title && <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">{title}</p>}
      <ol className={`flex ${horizontal ? 'flex-col lg:flex-row lg:items-center' : 'flex-col'} gap-1`}>
        {steps.map((step, i) => (
          <li key={step + i} className={`flex ${horizontal ? 'flex-col lg:flex-row lg:items-center' : 'flex-col'} items-center`}>
            <span className="w-full rounded-xl border border-line bg-surface2 px-4 py-2.5 text-center text-sm font-medium lg:w-auto">
              {step}
            </span>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`py-1 text-accent ${horizontal ? 'lg:px-2 lg:py-0 lg:-rotate-90' : ''}`}
              >
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
