export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export const formatMonthYear = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'

export const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  cloud_tools: 'Cloud / DevOps / Tools',
  automation_ai: 'Automation & AI',
  core: 'Core Concepts',
}

export const STATUS_LABELS = { active: 'Active', on_leave: 'On Leave', inactive: 'Inactive' }

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('')
