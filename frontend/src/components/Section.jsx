import useReveal from '../hooks/useReveal'

export function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow && (
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
    </div>
  )
}

export default function Section({ id, eyebrow, title, subtitle, children, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <section
      id={id}
      ref={ref}
      className={`container-x py-16 sm:py-20 ${visible ? 'animate-slide-up' : 'opacity-0'} ${className}`}
    >
      {title && <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />}
      {children}
    </section>
  )
}
