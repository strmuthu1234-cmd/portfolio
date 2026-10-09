export const SITE = {
  name: 'Muthupandi P',
  brand: 'Muthupandi.P',
  role: 'Python Full Stack Developer',
  tagline:
    'I build backend APIs, automation workflows, HR systems, and interactive web applications.',
  summary:
    'Python Full Stack Developer with hands-on experience in Python, Django, Django REST Framework, React.js, REST APIs, JWT authentication, RBAC, PostgreSQL, MySQL, AWS S3, workflow automation, biometric integration, and interactive web applications.',
  github: import.meta.env.VITE_GITHUB_URL || 'https://github.com/',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/',
  resume: '/Muthupandi_P_Resume.pdf',
}

export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/api-demo', label: 'API Demo' },
  { to: '/contact', label: 'Contact' },
]

export const STATS = [
  { value: '1.5+', label: 'Years Experience' },
  { value: '11', label: 'HRM Modules' },
  { value: '100+', label: 'Employees Managed' },
  { value: '4+', label: 'Major Projects' },
]

export const TERMINAL_SKILLS = ['Python', 'Django', 'DRF', 'React', 'PostgreSQL', 'AWS', 'n8n']

export const BUILD_FLOWS = [
  {
    title: 'Architecture',
    steps: ['User', 'React.js', 'REST API', 'Django REST Framework', 'PostgreSQL', 'AWS S3'],
  },
  {
    title: 'Authentication',
    steps: ['Login', 'JWT Access Token', 'Protected Admin APIs'],
  },
]
