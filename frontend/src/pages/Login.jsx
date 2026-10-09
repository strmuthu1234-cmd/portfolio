import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import FlowDiagram from '../components/FlowDiagram'
import { useAuth } from '../context/AuthContext'
import { parseApiError } from '../utils/errors'
import { validateLogin } from '../utils/validators'

export default function Login() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo = location.state?.from || '/admin-dashboard'
  if (isAuthenticated && user?.is_staff) return <Navigate to={redirectTo} replace />

  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const clientErrors = validateLogin(values)
    setErrors(clientErrors)
    setFormError('')
    if (Object.keys(clientErrors).length) return
    setLoading(true)
    try {
      await login(values.username.trim(), values.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const { message, fields } = parseApiError(err)
      // SimpleJWT reports bad credentials under `detail`; staff check under `detail` too.
      setFormError(
        err.response?.status === 401
          ? 'Invalid username or password.'
          : fields.detail || message,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-x grid min-h-[70vh] items-center gap-8 py-16 lg:grid-cols-2">
      <form onSubmit={submit} noValidate className="glass glow-border mx-auto w-full max-w-md space-y-4 p-6 sm:p-8">
        <div>
          <h1 className="text-2xl font-bold">Admin login</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage portfolio content.</p>
        </div>
        <FormField label="Username" name="username" value={values.username} onChange={set} error={errors.username} autoComplete="username" required />
        <FormField label="Password" name="password" type="password" value={values.password} onChange={set} error={errors.password} autoComplete="current-password" required />
        {formError && (
          <p className="text-sm text-red-400" role="alert">
            {formError}
          </p>
        )}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div className="mx-auto hidden w-full max-w-sm lg:block">
        <FlowDiagram title="JWT flow" steps={['Login', 'JWT Access Token', 'Protected Admin APIs']} />
      </div>
    </div>
  )
}
