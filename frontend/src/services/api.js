import axios from 'axios'
import { tokenStore } from '../utils/tokenStore'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 })

// Separate client for refresh so the interceptor below can't recurse.
const bare = axios.create({ baseURL: API_BASE_URL, timeout: 15000 })

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise = null

export async function refreshAccessToken() {
  const refresh = tokenStore.getRefresh()
  if (!refresh) throw new Error('No refresh token')
  // Share one in-flight refresh between concurrent 401s.
  refreshPromise ||= bare
    .post('/auth/refresh/', { refresh })
    .then(({ data }) => {
      tokenStore.setAccess(data.access)
      if (data.refresh) tokenStore.setRefresh(data.refresh) // rotation enabled on the backend
      return data.access
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const isAuthCall = original?.url?.startsWith('/auth/')
    if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true
      try {
        const token = await refreshAccessToken()
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      } catch {
        tokenStore.clear()
        window.dispatchEvent(new Event('auth:logout'))
      }
    }
    return Promise.reject(error)
  },
)

export const bareClient = bare
export default api
