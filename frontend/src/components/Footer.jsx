import { Link } from 'react-router-dom'
import { SITE } from '../data/site'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line">
      <div className="container-x flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {SITE.name}. Built with React, Django REST Framework &amp; PostgreSQL.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a href={SITE.github} target="_blank" rel="noreferrer" className="hover:text-accent">
            GitHub
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">
            LinkedIn
          </a>
          <Link to="/login" className="hover:text-accent">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
