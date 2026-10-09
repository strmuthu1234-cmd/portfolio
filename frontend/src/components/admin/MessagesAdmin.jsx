import { useState } from 'react'
import { AsyncBoundary } from '../States'
import useFetch from '../../hooks/useFetch'
import { contactApi } from '../../services/resources'
import { parseApiError } from '../../utils/errors'
import { formatDate } from '../../utils/format'

export default function MessagesAdmin() {
  const state = useFetch(() => contactApi.list({ page_size: 100 }))
  const [openId, setOpenId] = useState(null)
  const [error, setError] = useState('')

  const run = async (fn) => {
    setError('')
    try {
      await fn()
      state.reload()
    } catch (err) {
      setError(parseApiError(err).message)
    }
  }

  const toggle = (m) => {
    setOpenId(openId === m.id ? null : m.id)
    if (!m.is_read) run(() => contactApi.update(m.id, { is_read: true }))
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-400" role="alert">{error}</p>}
      <AsyncBoundary
        state={state}
        isEmpty={(d) => !d.results.length}
        emptyProps={{ title: 'No messages yet', hint: 'Submissions from the contact form appear here.' }}
      >
        {(d) => (
          <ul className="space-y-3">
            {d.results.map((m) => (
              <li key={m.id} className={`glass p-4 ${m.is_read ? '' : 'border-accent/40'}`}>
                <button type="button" onClick={() => toggle(m)} className="flex w-full items-start justify-between gap-3 text-left">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {!m.is_read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent" />}
                      {m.subject}
                    </p>
                    <p className="truncate text-sm text-muted">
                      {m.name} · {m.email}{m.company && ` · ${m.company}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{formatDate(m.created_at)}</span>
                </button>
                {openId === m.id && (
                  <div className="mt-4 animate-fade-in border-t border-line pt-4">
                    <p className="whitespace-pre-wrap text-sm">{m.message}</p>
                    <div className="mt-4 flex gap-2">
                      <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="btn-ghost btn-sm">
                        Reply
                      </a>
                      <button type="button" className="btn-ghost btn-sm" onClick={() => run(() => contactApi.update(m.id, { is_read: !m.is_read }))}>
                        Mark {m.is_read ? 'unread' : 'read'}
                      </button>
                      <button
                        type="button"
                        className="btn-danger btn-sm"
                        onClick={() => window.confirm('Delete this message?') && run(() => contactApi.remove(m.id))}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </AsyncBoundary>
    </div>
  )
}
