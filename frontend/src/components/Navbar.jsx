import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_LINKS, SITE } from '../data/site'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm transition ${
    isActive ? 'text-accent' : 'text-muted hover:text-ink'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition duration-300 ${
        scrolled || open ? 'border-line bg-bg/85 backdrop-blur-lg' : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link to="/" className="text-lg font-bold tracking-tight">
          <span className="gradient-text">Muthupandi</span>
          <span className="text-ink">.P</span>
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 xl:flex">
          <a href={SITE.github} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
            GitHub
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
            LinkedIn
          </a>
          <a href={SITE.resume} download className="btn-primary btn-sm">
            Download Resume
          </a>
        </div>

        <button
          type="button"
          className="btn-ghost btn-sm xl:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div className="animate-fade-in border-t border-line xl:hidden">
          <ul className="container-x flex flex-col gap-1 py-4">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={(s) => `block ${linkClass(s)}`}>
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-3 flex flex-wrap gap-2">
              <a href={SITE.github} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
                GitHub
              </a>
              <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
                LinkedIn
              </a>
              <a href={SITE.resume} download className="btn-primary btn-sm">
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
