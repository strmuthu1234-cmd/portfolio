import { useRef, useState } from 'react'
import { AsyncBoundary } from '../States'
import useFetch from '../../hooks/useFetch'
import { mediaApi } from '../../services/resources'
import { parseApiError } from '../../utils/errors'

export default function MediaAdmin() {
  const state = useFetch(() => mediaApi.list({ page_size: 100 }))
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(null)

  const upload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      await mediaApi.upload(file, file.name)
      state.reload()
    } catch (err) {
      const { message, fields } = parseApiError(err)
      setError(fields.file || message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = async (m) => {
    if (!window.confirm('Delete this file?')) return
    try {
      await mediaApi.remove(m.id)
      state.reload()
    } catch (err) {
      setError(parseApiError(err).message)
    }
  }

  const copy = async (m) => {
    try {
      await navigator.clipboard.writeText(m.file)
      setCopied(m.id)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      setError('Could not copy to clipboard.')
    }
  }

  return (
    <div>
      <div className="glass mb-6 flex flex-wrap items-center justify-between gap-3 p-5">
        <p className="text-sm text-muted">Upload images (stored on AWS S3 when enabled, otherwise local disk).</p>
        <label className={`btn-primary cursor-pointer ${uploading ? 'opacity-60' : ''}`}>
          {uploading ? 'Uploading…' : 'Upload image'}
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={upload} disabled={uploading} />
        </label>
      </div>
      {error && <p className="mb-3 text-sm text-red-400" role="alert">{error}</p>}
      <AsyncBoundary state={state} isEmpty={(d) => !d.results.length} emptyProps={{ title: 'No uploads yet' }}>
        {(d) => (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.results.map((m) => (
              <div key={m.id} className="glass overflow-hidden">
                <img src={m.file} alt={m.title} loading="lazy" className="h-40 w-full object-cover" />
                <div className="space-y-2 p-3">
                  <p className="truncate text-sm">{m.title || 'Untitled'}</p>
                  <div className="flex gap-2">
                    <button type="button" className="btn-ghost btn-sm" onClick={() => copy(m)}>
                      {copied === m.id ? 'Copied ✓' : 'Copy URL'}
                    </button>
                    <button type="button" className="btn-danger btn-sm" onClick={() => remove(m)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AsyncBoundary>
    </div>
  )
}
