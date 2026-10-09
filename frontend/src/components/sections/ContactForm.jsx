import { useState } from 'react'
import FormField from '../FormField'
import { contactApi } from '../../services/resources'
import { parseApiError } from '../../utils/errors'
import { validateContact } from '../../utils/validators'

const EMPTY = { name: '', email: '', company: '', subject: '', message: '' }

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const clientErrors = validateContact(values)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length) return

    setStatus({ state: 'sending', message: '' })
    try {
      await contactApi.submit(values)
      setValues(EMPTY)
      setStatus({ state: 'success', message: 'Thanks! Your message has been received.' })
    } catch (err) {
      const { message, fields } = parseApiError(err)
      setErrors(fields)
      setStatus({
        state: 'error',
        message: err.response?.status === 429 ? 'Too many messages — please try again later.' : message,
      })
    }
  }

  if (status.state === 'success') {
    return (
      <div className="glass glow-border animate-fade-in p-8 text-center" role="status">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ok/15 text-xl text-ok">
          ✓
        </div>
        <p className="text-lg font-semibold">{status.message}</p>
        <button type="button" className="btn-ghost mt-6" onClick={() => setStatus({ state: 'idle', message: '' })}>
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="glass glow-border space-y-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" name="name" value={values.name} onChange={set} error={errors.name} required autoComplete="name" />
        <FormField label="Email" name="email" type="email" value={values.email} onChange={set} error={errors.email} required autoComplete="email" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Company" name="company" value={values.company} onChange={set} error={errors.company} autoComplete="organization" />
        <FormField label="Subject" name="subject" value={values.subject} onChange={set} error={errors.subject} required />
      </div>
      <FormField label="Message" as="textarea" rows={5} name="message" value={values.message} onChange={set} error={errors.message} required />

      {status.state === 'error' && (
        <p className="text-sm text-red-400" role="alert">
          {status.message}
        </p>
      )}
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
