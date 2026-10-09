import { useState } from 'react'
import FormField from '../FormField'
import { AsyncBoundary } from '../States'
import useFetch from '../../hooks/useFetch'
import { skillsApi } from '../../services/resources'
import { parseApiError } from '../../utils/errors'
import { CATEGORY_LABELS } from '../../utils/format'

const EMPTY = { name: '', category: 'backend', proficiency: 80 }

export default function SkillsAdmin() {
  const state = useFetch(() => skillsApi.list({ page_size: 100 }))
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const add = async (e) => {
    e.preventDefault()
    if (!values.name.trim()) return setErrors({ name: 'Name is required.' })
    setSaving(true)
    setErrors({})
    setError('')
    try {
      await skillsApi.create({ ...values, name: values.name.trim(), proficiency: Number(values.proficiency) })
      setValues(EMPTY)
      state.reload()
    } catch (err) {
      const { message, fields } = parseApiError(err)
      setErrors(fields)
      setError(Object.keys(fields).length ? '' : message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (s) => {
    try {
      await skillsApi.remove(s.id)
      state.reload()
    } catch (err) {
      setError(parseApiError(err).message)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} noValidate className="glass grid items-start gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <FormField label="Skill" name="name" value={values.name} onChange={set} error={errors.name} />
        <FormField label="Category" as="select" name="category" value={values.category} onChange={set} error={errors.category}>
          {Object.entries(CATEGORY_LABELS).map(([k, l]) => (
            <option key={k} value={k}>{l}</option>
          ))}
        </FormField>
        <FormField label="Proficiency (0-100)" type="number" min="0" max="100" name="proficiency" value={values.proficiency} onChange={set} error={errors.proficiency} />
        <div className="self-end">
          <button type="submit" className="btn-primary w-full" disabled={saving}>{saving ? 'Adding…' : 'Add skill'}</button>
        </div>
        {error && <p className="text-sm text-red-400 sm:col-span-full" role="alert">{error}</p>}
      </form>

      <AsyncBoundary state={state} isEmpty={(d) => !d.results.length} emptyProps={{ title: 'No skills yet' }}>
        {(d) => (
          <div className="flex flex-wrap gap-2">
            {d.results.map((s) => (
              <span key={s.id} className="chip gap-2 py-1.5 pr-1.5">
                {s.name} <span className="text-[10px] opacity-60">{CATEGORY_LABELS[s.category]}</span>
                <button
                  type="button"
                  onClick={() => remove(s)}
                  className="rounded-full px-1.5 text-red-300 hover:bg-red-500/20"
                  aria-label={`Remove ${s.name}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </AsyncBoundary>
    </div>
  )
}
