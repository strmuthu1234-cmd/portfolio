import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/resources'
import { refreshAccessToken } from '../services/api'
import { tokenStore } from '../utils/tokenStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(true)

  // Restore a session after reload: refresh token -> new access token -> /me.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (tokenStore.getRefresh()) {
        try {
          await refreshAccessToken()
          const me = await authApi.me()
          if (!cancelled) setUser(me)
        } catch {
          tokenStore.clear()
        }
      }
      if (!cancelled) setBooting(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Fired by the axios interceptor when a refresh fails.
  useEffect(() => {
    const onLogout = () => setUser(null)
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await authApi.login(username, password)
    tokenStore.setAccess(data.access)
    tokenStore.setRefresh(data.refresh)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, booting, isAuthenticated: !!user, login, logout }),
    [user, booting, login, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
