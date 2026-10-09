import api, { bareClient } from './api'

// Every list endpoint is paginated; pass { page_size: 100 } to get everything.
const unwrap = (promise) => promise.then((r) => r.data)

const crud = (path, key = 'id') => ({
  list: (params) => unwrap(api.get(`/${path}/`, { params })),
  get: (id) => unwrap(api.get(`/${path}/${id}/`)),
  create: (data) => unwrap(api.post(`/${path}/`, data)),
  update: (id, data) => unwrap(api.patch(`/${path}/${id}/`, data)),
  remove: (id) => api.delete(`/${path}/${id}/`),
  key,
})

export const authApi = {
  login: (username, password) => unwrap(bareClient.post('/auth/login/', { username, password })),
  me: () => unwrap(api.get('/auth/me/')),
}

export const projectsApi = crud('projects', 'slug')
export const skillsApi = crud('skills')
export const experienceApi = crud('experience')
export const employeesApi = crud('employees')

export const contactApi = {
  ...crud('contact'),
  submit: (data) => unwrap(api.post('/contact/', data)),
}

export const mediaApi = {
  list: (params) => unwrap(api.get('/media/', { params })),
  upload: (file, title = '') => {
    const form = new FormData()
    form.append('file', file)
    if (title) form.append('title', title)
    return unwrap(api.post('/media/', form))
  },
  remove: (id) => api.delete(`/media/${id}/`),
}

// Builds multipart/JSON payload for a project (thumbnail is optional).
export function projectPayload(values, thumbnailFile) {
  if (!thumbnailFile) return values
  const form = new FormData()
  Object.entries(values).forEach(([k, v]) => {
    form.append(k, typeof v === 'object' ? JSON.stringify(v) : v)
  })
  form.append('thumbnail', thumbnailFile)
  return form
}
