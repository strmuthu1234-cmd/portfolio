import { useState } from 'react'
import Modal from '../Modal'
import FormField from '../FormField'
import { AsyncBoundary } from '../States'
import useFetch from '../../hooks/useFetch'
import { experienceApi } from '../../services/resources'
import { parseApiError } from '../../utils/errors'
import { formatMonthYear } from '../../utils/format'

const EMPTY = { company: '', role: '', start_date: '', end_date: '', description: '', is_current: false }

function ExperienceForm({ item, onSaved, onCancel }) {
  const [values, setValues] = useState(item ? { ...EMPTY, ...item, end_date: item.end_date || '' } : EMPTY)
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
    if (!values.company.trim()) clientErrors.company = 'Company is required.'
    if (!values.role.trim()) clientErrors.role = 'Role is required.'
    if (!values.start_date) clientErrors.start_date = 'Start date is required.'
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length) return

    const payload = {
      company: values.company, role: values.role, start_date: values.start_date,
      end_date: values.is_current ? null : values.end_date || null,
      description: values.description, is_current: values.is_current,
    }
    setSaving(true)
    setFormError('')
    try {
      if (item) await experienceApi.update(item.id, payload)
      else await experienceApi.create(payload)
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
      <FormField label="Company" name="company" value={values.company} onChange={set} error={errors.company} required />
      <FormField label="Role" name="role" value={values.role} onChange={set} error={errors.role} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Start date" type="date" name="start_date" value={values.start_date} onChange={set} error={errors.start_date} required />
        <FormField label="End date" type="date" name="end_date" value={values.is_current ? '' : values.end_date} onChange={set} error={errors.end_date} disabled={values.is_current} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_current" checked={values.is_current} onChange={set} className="h-4 w-4 accent-accent" />
        I currently work here
      </label>
      <FormField label="Responsibilities (one per line)" as="textarea" rows={6} name="description" value={values.description} onChange={set} error={errors.description} />
      {formError && <p className="text-sm text-red-400" role="alert">{formError}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  )
}

export default function ExperienceAdmin() {
  const state = useFetch(() => experienceApi.list({ page_size: 50 }))
  const [modal, setModal] = useState(null)
  const [error, setError] = useState('')

  const remove = async (x) => {
    if (!window.confirm(`Delete "${x.role}" at ${x.company}?`)) return
    try {
      await experienceApi.remove(x.id)
      state.reload()
    } catch (err) {
      setError(parseApiError(err).message)
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" className="btn-primary" onClick={() => setModal({})}>+ Add experience</button>
      </div>
      {error && <p className="mb-3 text-sm text-red-400" role="alert">{error}</p>}
      <AsyncBoundary state={state} isEmpty={(d) => !d.results.length} emptyProps={{ title: 'No experience yet' }}>
        {(d) => (
          <ul className="space-y-3">
            {d.results.map((x) => (
              <li key={x.id} className="glass flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{x.role}</p>
                  <p className="text-sm text-muted">
                    {x.company} · {formatMonthYear(x.start_date)} – {x.is_current ? 'Present' : formatMonthYear(x.end_date)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn-ghost btn-sm" onClick={() => setModal({ item: x })}>Edit</button>
                  <button type="button" className="btn-danger btn-sm" onClick={() => remove(x)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AsyncBoundary>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.item ? 'Edit experience' : 'Add experience'} wide>
        {modal && (
          <ExperienceForm
            item={modal.item}
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
