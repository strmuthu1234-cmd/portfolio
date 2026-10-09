import { useState } from 'react'
import Modal from '../Modal'
import FormField from '../FormField'
import { AsyncBoundary } from '../States'
import useFetch from '../../hooks/useFetch'
import { projectPayload, projectsApi } from '../../services/resources'
import { parseApiError } from '../../utils/errors'
import { flowsToText, splitList, textToFlows } from '../../utils/architecture'

const EMPTY = {
  title: '', short_description: '', full_description: '', tech_stack: '', features: '',
  architecture: '', github_url: '', live_url: '', featured: false, order: 0,
}

function ProjectForm({ project, onSaved, onCancel }) {
  const [values, setValues] = useState(
    project
      ? {
          ...EMPTY,
          ...project,
          tech_stack: project.tech_stack.join(', '),
          features: project.features.join('\n'),
          architecture: flowsToText(project.architecture),
        }
      : EMPTY,
  )
  const [thumb, setThumb] = useState(null)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (e) => {
    const { name, type, checked, value } = e.target
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const clientErrors = {}
    if (!values.title.trim()) clientErrors.title = 'Title is required.'
    if (!values.short_description.trim()) clientErrors.short_description = 'Short description is required.'
    let architecture = []
    try {
      architecture = textToFlows(values.architecture)
    } catch (err) {
      clientErrors.architecture = err.message
    }
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length) return

    const payload = {
      title: values.title.trim(),
      short_description: values.short_description.trim(),
      full_description: values.full_description,
      tech_stack: splitList(values.tech_stack, ','),
      features: splitList(values.features, '\n'),
      architecture,
      github_url: values.github_url,
      live_url: values.live_url,
      featured: values.featured,
      order: Number(values.order) || 0,
    }
    setSaving(true)
    setFormError('')
    try {
      const body = projectPayload(payload, thumb)
      if (project) await projectsApi.update(project.slug, body)
      else await projectsApi.create(body)
      onSaved()
    } catch (err) {
      const { message, fields } = parseApiError(err)
      setErrors(fields)
      setFormError(Object.keys(fields).length ? '' : message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <FormField label="Title" name="title" value={values.title} onChange={set} error={errors.title} required />
      <FormField label="Short description" name="short_description" value={values.short_description} onChange={set} error={errors.short_description} required />
      <FormField label="Full description" as="textarea" rows={4} name="full_description" value={values.full_description} onChange={set} error={errors.full_description} />
      <FormField label="Tech stack (comma separated)" name="tech_stack" value={values.tech_stack} onChange={set} error={errors.tech_stack} />
      <FormField label="Features (one per line)" as="textarea" rows={4} name="features" value={values.features} onChange={set} error={errors.features} />
      <FormField label="Architecture flows (Title: step > step)" as="textarea" rows={3} name="architecture" value={values.architecture} onChange={set} error={errors.architecture} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="GitHub URL" type="url" name="github_url" value={values.github_url} onChange={set} error={errors.github_url} />
        <FormField label="Live URL" type="url" name="live_url" value={values.live_url} onChange={set} error={errors.live_url} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Display order" type="number" min="0" name="order" value={values.order} onChange={set} error={errors.order} />
        <div>
          <label className="label" htmlFor="thumb">Thumbnail</label>
          <input id="thumb" type="file" accept="image/*" className="input" onChange={(e) => setThumb(e.target.files[0] || null)} />
          {errors.thumbnail && <p className="mt-1 text-xs text-red-400">{errors.thumbnail}</p>}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" checked={values.featured} onChange={set} className="h-4 w-4 accent-accent" />
        Featured project
      </label>
      {formError && <p className="text-sm text-red-400" role="alert">{formError}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save project'}</button>
      </div>
    </form>
  )
}

export default function ProjectsAdmin() {
  const state = useFetch(() => projectsApi.list({ page_size: 100 }))
  const [modal, setModal] = useState(null)
  const [error, setError] = useState('')

  const edit = async (p) => {
    // List payload is trimmed; fetch the full record before editing.
    try {
      setModal({ project: await projectsApi.get(p.slug) })
    } catch (err) {
      setError(parseApiError(err).message)
    }
  }
  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return
    try {
      await projectsApi.remove(p.slug)
      state.reload()
    } catch (err) {
      setError(parseApiError(err).message)
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" className="btn-primary" onClick={() => setModal({})}>+ Add project</button>
      </div>
      {error && <p className="mb-3 text-sm text-red-400" role="alert">{error}</p>}
      <AsyncBoundary state={state} isEmpty={(d) => !d.results.length} emptyProps={{ title: 'No projects yet' }}>
        {(d) => (
          <ul className="space-y-3">
            {d.results.map((p) => (
              <li key={p.id} className="glass flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-medium">
                    {p.title} {p.featured && <span className="chip ml-2">Featured</span>}
                  </p>
                  <p className="truncate text-sm text-muted">{p.short_description}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn-ghost btn-sm" onClick={() => edit(p)}>Edit</button>
                  <button type="button" className="btn-danger btn-sm" onClick={() => remove(p)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AsyncBoundary>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.project ? 'Edit project' : 'Add project'} wide>
        {modal && (
          <ProjectForm
            project={modal.project}
            onCancel={() => setModal(null)}
            onSaved={() => {
              setModal(null)
              state.reload()
            }}
          />
        )}
      </Modal>
    </div>
  )
}
