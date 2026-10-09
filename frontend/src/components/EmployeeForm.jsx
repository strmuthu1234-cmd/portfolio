import { useState } from 'react'
import FormField from './FormField'
import { employeesApi } from '../services/resources'
import { parseApiError } from '../utils/errors'
import { validateEmployee } from '../utils/validators'

const EMPTY = { name: '', email: '', department: '', designation: '', status: 'active', join_date: '' }

export default function EmployeeForm({ employee, onSaved, onCancel }) {
  const [values, setValues] = useState(employee ? { ...EMPTY, ...employee } : EMPTY)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const clientErrors = validateEmployee(values)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length) return

    setSaving(true)
    setFormError('')
    const { id, ...payload } = values
    try {
      const saved = employee ? await employeesApi.update(employee.id, payload) : await employeesApi.create(payload)
      onSaved(saved)
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
      <FormField label="Name" name="name" value={values.name} onChange={set} error={errors.name} required />
      <FormField label="Email" name="email" type="email" value={values.email} onChange={set} error={errors.email} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Department" name="department" value={values.department} onChange={set} error={errors.department} required />
        <FormField label="Designation" name="designation" value={values.designation} onChange={set} error={errors.designation} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Status" as="select" name="status" value={values.status} onChange={set} error={errors.status}>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </FormField>
        <FormField label="Join date" name="join_date" type="date" value={values.join_date} onChange={set} error={errors.join_date} required />
      </div>
      {formError && (
        <p className="text-sm text-red-400" role="alert">
          {formError}
        </p>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : employee ? 'Save changes' : 'Add employee'}
        </button>
      </div>
    </form>
  )
}
