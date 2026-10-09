import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from './States'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, booting } = useAuth()
  const location = useLocation()

  if (booting) return <Spinner label="Checking session…" />
  if (!isAuthenticated || !user?.is_staff) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
